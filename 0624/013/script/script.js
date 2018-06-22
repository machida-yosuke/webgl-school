
// = 013 ======================================================================
// これまでのサンプルでは、よく見かけるようなマウスによるシーンへの干渉が一切で
// きませんでした。実は、マウスによるインタラクションは「すごく難しい」です。
// もし、自力でマウスによるカメラ操作などが行えるとしたら、完全に中級者以上には
// 達していると言えます。もし、チャレンジ精神のある方がいたら、ぜひトライしてみ
// てください。
// とは言え、かなり難しい分野ではあるので、このサンプルでは three.js のサンプル
// で出てきた OrbitControl に近い操作感をスクラッチで書いたものを載せておきます。
// 完全に同じ動作をするわけではないですし、あくまでも参考程度に。
// ============================================================================

(() => {
    // variables
    let run;          // 実行フラグ
    let startTime;    // ループ開始時間
    let nowTime;      // 現在までの経過時間
    let gl;           // WebGL Rendering Context
    let mat4;         // glcubic.Math.Mat4 クラス
    let qtn;          // glcubic.Math.Qtn クラス
    let canvas;       // canvas エレメントへの参照
    let canvasSize;   // canvas の大きさ（ここでは正方形の一辺の長さ）
    let prg;          // プログラムオブジェクト
    let torusData;    // トーラスのジオメトリデータ
    let VBO;          // Vertex Buffer Object
    let IBO;          // Index Buffer Object
    mat4 = gl3.Math.Mat4;
    qtn  = gl3.Math.Qtn;

    let mMatrix;      // モデル座標変換行列
    let vMatrix;      // ビュー座標変換行列
    let pMatrix;      // プロジェクション座標変換行列
    let vpMatrix;     // ビュー x プロジェクション
    let mvpMatrix;    // モデル x ビュー x プロジェクション
    let normalMatrix; // 法線変換行列

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

        // キャンバスの大きさはウィンドウの短辺
        canvasSize = Math.min(window.innerWidth, window.innerHeight);
        canvas.width  = canvasSize;
        canvas.height = canvasSize;

        // イベントの登録 @@@
        canvas.addEventListener('mousedown', mouseInteractionStart, false);
        canvas.addEventListener('mousemove', mouseInteractionMove, false);
        canvas.addEventListener('mouseup', mouseInteractionEnd, false);
        canvas.addEventListener('wheel', wheelScroll, false);

        // シェーダロードへ移行
        loadShader();
    }, false);

    function loadShader(){
        prg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'normal', 'color'],
            [3, 3, 4],
            ['mvpMatrix', 'normalMatrix'],
            ['matrix4fv', 'matrix4fv'],
            initialize
        );
    }

    function initialize(){
        // トーラスの頂点データ生成メソッド
        torusData = gl3.Mesh.torus(32, 32, 0.5, 1.0, [1.0, 1.0, 1.0, 1.0]);
        VBO = [
            gl3.createVbo(torusData.position),
            gl3.createVbo(torusData.normal),
            gl3.createVbo(torusData.color)
        ];
        IBO = gl3.createIbo(torusData.index);

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
        gl3.sceneView(0, 0, canvasSize, canvasSize);
        gl3.sceneClear([0.7, 0.7, 0.7, 1.0]);
        prg.useProgram();
        prg.setAttribute(VBO, IBO);

        // - カメラ情報の更新 -------------------------------------------------
        // カメラの情報は、このファイルの末尾の方でまとめて定義してあります。
        // これらのカメラの関するパラメータは絶えず更新し続ける必要は必ずしもな
        // く、イベントが発火したときだけに最適化することもできるのですが、ここ
        // ではシンプルにするために、カメラのパラメータを更新するための関数であ
        // る cameraUpdate を毎回呼び出しています。
        // --------------------------------------------------------------------
        // カメラ関連の変数を更新 @@@
        cameraUpdate();
        // 更新された情報を元にビュー座標変換行列を生成
        mat4.lookAt(cameraPosition, centerPoint, cameraUpDirection, vMatrix);
        mat4.perspective(45, 1.0, 0.1, cameraDistance * 2.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // 時間の経過からモデル座標変換行列を生成
        nowTime = (Date.now() - startTime) / 1000;
        mat4.identity(mMatrix);
        mat4.rotate(mMatrix, nowTime * 0.5, [0.0, 1.0, 0.0], mMatrix);
        // モデル座標変換行列を用い MVP マトリックスを生成
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        // 法線変換行列の生成
        mat4.transpose(mMatrix, normalMatrix);
        mat4.inverse(normalMatrix, normalMatrix);
        // uniform 変数をシェーダにプッシュ
        prg.pushShader([
            mvpMatrix,
            normalMatrix
        ]);
        // ドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, torusData.index.length);

        // 再帰呼び出し
        if(run){requestAnimationFrame(render);}
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

