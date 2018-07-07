
// = 023 ======================================================================
// 022 ではライトの当たり具合がアニメ調になるような、そんなシェーディングが実現
// できました。もっと本来のアニメや漫画の質感に近づけるためには、エッジラインを
// 描画してやる必要があるでしょう。要は、線画のような雰囲気に近づけるわけです。
// このエッジラインの描画方法には、非常に古典的ながら、とてもシンプルな方法があ
// りますので、今回はそれに挑戦してみます。
// ============================================================================

(() => {
    // variables
    let run;          // 実行フラグ
    let startTime;    // ループ開始時間
    let nowTime;      // 現在までの経過時間
    let gl;           // WebGL Rendering Context
    let canvas;       // canvas エレメントへの参照
    let canvasWidth;  // canvas の横幅
    let canvasHeight; // canvas の高さ
    let prg;          // プログラムオブジェクト

    // geometry
    let torusData;    // トーラスの頂点座標
    let torusVBO;     // トーラスの VBO
    let torusIBO;     // トーラスの IBO
    let sphereData;   // 球体の頂点インデックス
    let sphereVBO;    // 球体の VBO
    let sphereIBO;    // 球体の IBO

    // glcubic
    let mat4 = gl3.Math.Mat4; // 行列処理
    let qtn  = gl3.Math.Qtn;  // クォータニオン処理

    // matrix
    let mMatrix;   // モデル座標変換行列
    let vMatrix;   // ビュー座標変換行列
    let pMatrix;   // プロジェクション座標変換行列
    let vpMatrix;  // ビュー x プロジェクション
    let mvpMatrix; // モデル x ビュー x プロジェクション

    window.addEventListener('load', () => {
        // glcubic の初期化
        canvas = document.getElementById('webgl_canvas');
        gl3.init(canvas);
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }
        gl = gl3.gl;

        // サンプルの実行を止めることができるようにイベントを仕込む
        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);

        // キャンバスの大きさをウィンドウサイズにあわせる
        canvas.width  = canvasWidth  = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;

        // イベントの登録
        canvas.addEventListener('mousedown', mouseInteractionStart, false);
        canvas.addEventListener('mousemove', mouseInteractionMove, false);
        canvas.addEventListener('mouseup', mouseInteractionEnd, false);
        canvas.addEventListener('wheel', wheelScroll, false);

        // シェーダロードへ移行
        loadShader();
    }, false);

    function loadShader(){
        // シェーダの読み込み @@@
        prg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'normal', 'color'],
            [3, 3, 4],
            ['mvpMatrix', 'normalMatrix', 'edge'], // エッジフラグを追加 @@@
            ['matrix4fv', 'matrix4fv', '1i'],      // 真偽値ひとつなので 1i @@@
            initialize
        );
    }

    function initialize(){
        // トーラスの頂点データ生成メソッド
        torusData = gl3.Mesh.torus(64, 64, 0.5, 1.5, [0.3, 0.8, 1.0, 1.0]);
        torusVBO = [
            gl3.createVbo(torusData.position),
            gl3.createVbo(torusData.normal),
            gl3.createVbo(torusData.color)
        ];
        torusIBO = gl3.createIbo(torusData.index);

        // 球体の頂点データ生成メソッド
        sphereData = gl3.Mesh.sphere(64, 64, 0.75, [1.0, 0.8, 0.3, 1.0]);
        sphereVBO = [
            gl3.createVbo(sphereData.position),
            gl3.createVbo(sphereData.normal),
            gl3.createVbo(sphereData.color)
        ];
        sphereIBO = gl3.createIbo(sphereData.index);

        // 行列の初期化
        mMatrix      = mat4.identity(mat4.create());
        vMatrix      = mat4.identity(mat4.create());
        pMatrix      = mat4.identity(mat4.create());
        vpMatrix     = mat4.identity(mat4.create());
        mvpMatrix    = mat4.identity(mat4.create());
        normalMatrix = mat4.identity(mat4.create());

        // 深度テストとカリングを有効化する
        gl.enable(gl.DEPTH_TEST); // 深度テストを有効化
        gl.enable(gl.CULL_FACE);  // カリングを有効化
        gl.cullFace(gl.BACK);     // カリング面の設定

        // 汎用変数の初期化
        run = true;
        startTime = Date.now();
        nowTime = 0;

        // レンダリング関数を呼ぶ
        render();
    }

    function render(){
        // 時間を更新
        nowTime = (Date.now() - startTime) / 1000;

        // 再帰呼び出し
        if(run){requestAnimationFrame(render);}

        // キャンバスの大きさをウィンドウサイズにあわせる
        canvas.width  = canvasWidth  = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;

        // 更新された幅と高さで WebGL 側のビューも設定する
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        gl3.sceneClear([0.7, 0.7, 0.7, 1.0]);

        // カメラ関連の変数を更新
        cameraUpdate();
        // アスペクト比もその都度計算する
        let aspect = canvasWidth / canvasHeight;
        mat4.lookAt(cameraPosition, centerPoint, cameraUpDirection, vMatrix);
        mat4.perspective(60, aspect, 0.1, cameraDistance * 2.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // モデル座標変換
        mat4.identity(mMatrix);
        mat4.rotate(mMatrix, nowTime * 0.75, [1.0, 1.0, 0.0], mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        mat4.transpose(mMatrix, normalMatrix);
        mat4.inverse(normalMatrix, normalMatrix);

        // プログラムオブジェクトの選択とバッファのバインド
        prg.useProgram();

        // - まずは裏面だけを描く ---------------------------------------------
        // まずは、カリングする面を「表」に設定して描画します。
        // 表面をカリングするということは、ここでは裏面だけが描かれる、というこ
        // とになります。つまり、エッジとして見える部分を描くことになるので、真
        // 偽値の指定を true としてシェーダに送ります。
        // シェーダ側では、このフラグが true のときは、色を暗くして描画するよう
        // にします。そうすることで、はみだした部分がエッジのように見えるという
        // 寸法です。
        // --------------------------------------------------------------------
        // カリング面を表に設定 @@@
        gl.cullFace(gl.FRONT);
        // uniform 変数をシェーダにプッシュ @@@
        prg.pushShader([
            mvpMatrix,
            normalMatrix,
            true
        ]);
        // トーラスを描画する
        prg.setAttribute(torusVBO, torusIBO);
        gl3.drawElements(gl3.gl.TRIANGLES, torusData.index.length);
        // 球体を描画する
        prg.setAttribute(sphereVBO, sphereIBO);
        gl3.drawElements(gl3.gl.TRIANGLES, sphereData.index.length);

        // - 続いて表面だけを描く ---------------------------------------------
        // まずは、カリングする面を「裏」に設定して描画します。
        // ここで、今までと同様のいわゆる普通に陰影のある面が描かれます。
        // --------------------------------------------------------------------
        // カリング面を表に設定 @@@
        gl.cullFace(gl.BACK);
        // uniform 変数をシェーダにプッシュ @@@
        prg.pushShader([
            mvpMatrix,
            normalMatrix,
            false
        ]);
        // トーラスを描画する
        prg.setAttribute(torusVBO, torusIBO);
        gl3.drawElements(gl3.gl.TRIANGLES, torusData.index.length);
        // 球体を描画する
        prg.setAttribute(sphereVBO, sphereIBO);
        gl3.drawElements(gl3.gl.TRIANGLES, sphereData.index.length);
    }

    // カメラ関連 =========================================================
    let cameraDistance     = 5.0;
    let cameraPosition     = [0.0, 0.0, cameraDistance];
    let centerPoint        = [0.0, 0.0, 0.0];
    let cameraUpDirection  = [0.0, 1.0, 0.0];
    let dCameraPosition    = [0.0, 0.0, cameraDistance];
    let dCenterPoint       = [0.0, 0.0, 0.0];
    let dCameraUpDirection = [0.0, 1.0, 0.0];
    let cameraRotateX      = 0.0;
    let cameraRotateY      = 0.0;
    let cameraScale        = 0.0;
    let clickStart         = false;
    let prevPosition       = [0, 0];
    let offsetPosition     = [0, 0];
    let qt  = qtn.identity(qtn.create());
    let qtx = qtn.identity(qtn.create());
    let qty = qtn.identity(qtn.create());
    function mouseInteractionStart(eve){
        clickStart = true;
        prevPosition = [
            eve.pageX,
            eve.pageY
        ];
        eve.preventDefault();
    }
    function mouseInteractionMove(eve){
        if(!clickStart){return;}
        let w = canvas.width;
        let h = canvas.height;
        let s = 1.0 / Math.min(w, h);
        offsetPosition = [
            eve.pageX - prevPosition[0],
            eve.pageY - prevPosition[1]
        ];
        prevPosition = [eve.pageX, eve.pageY];
        switch(eve.buttons){
            case 1:
                cameraRotateX += offsetPosition[0] * s;
                cameraRotateY += offsetPosition[1] * s;
                cameraRotateX = cameraRotateX % 1.0;
                cameraRotateY = Math.min(Math.max(cameraRotateY % 1.0, -0.25), 0.25);
                break;
        }
    }
    function mouseInteractionEnd(eve){
        clickStart = false;
    }
    function wheelScroll(eve){
        let w = eve.wheelDelta;
        if(w > 0){
            cameraScale = 0.8;
        }else if(w < 0){
            cameraScale = -0.8;
        }
    }
    function cameraUpdate(){
        let v = [1.0, 0.0, 0.0];
        cameraScale *= 0.75;
        cameraDistance += cameraScale;
        cameraDistance = Math.min(Math.max(cameraDistance, 5.0), 20.0);
        dCameraPosition[2] = cameraDistance;
        qtn.identity(qt);
        qtn.identity(qtx);
        qtn.identity(qty);
        qtn.rotate(cameraRotateX * gl3.PI2, [0.0, 1.0, 0.0], qtx);
        qtn.toVecIII(v, qtx, v);
        qtn.rotate(cameraRotateY * gl3.PI2, v, qty);
        qtn.multiply(qtx, qty, qt)
        qtn.toVecIII(dCameraPosition, qt, cameraPosition);
        qtn.toVecIII(dCameraUpDirection, qt, cameraUpDirection);
    }
    // カメラ関連ここまで =================================================
})();

