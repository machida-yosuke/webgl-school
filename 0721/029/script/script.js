
// = 029 ======================================================================
// 3DCG には環境マッピングと呼ばれているテクニックがあります。
// WebGL では、そんな環境マッピングの一種であるキューブ環境マッピングをサポート
// しています。
// 初期化処理が非常に冗長で面倒なのですが、その質感は一般的なテクスチャマッピン
// グと比較すると格段に高い質感を持っています。考え方がちょっと難しいですが、こ
// こで一度がんばってトライしてみましょう。
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
    let torusData;    // トーラスのジオメトリデータ
    let torusVBO;     // トーラスの VBO
    let torusIBO;     // トーラスの IBO
    let cubeData;     // キューブのジオメトリデータ
    let cubeVBO;      // キューブの VBO
    let cubeIBO;      // キューブの IBO

    // glcubic
    let mat4 = gl3.Math.Mat4; // 行列処理
    let qtn  = gl3.Math.Qtn;  // クォータニオン処理
    let wrapper;              // GUI ラッパー
    let cubeVisibleCheck;     // チェックボックス GUI（キューブを描くかどうか） @@@
    let cubeVisible = false;  // キューブを描くかどうか @@@

    // matrix
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

        // GUI Wrapper
        wrapper = new gl3.Gui.Wrapper();
        document.body.appendChild(wrapper.getElement());
        // キューブを描くかどうか @@@
        cubeVisibleCheck = new gl3.Gui.Checkbox('cube visible', cubeVisible);
        cubeVisibleCheck.add('change', (eve, self) => {
            cubeVisible = self.getValue();
        });
        wrapper.append(cubeVisibleCheck.getElement());

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
            ['position', 'normal'],
            [3, 3],
            [
                'mMatrix',
                'mvpMatrix',
                'normalMatrix',
                'eyePosition',
                'cubeTexture', // キューブテクスチャのユニット番号 @@@
                'reflection'   // 法線による反射を行うかどうか @@@
            ],
            ['matrix4fv', 'matrix4fv', 'matrix4fv', '3fv', '1i', '1i'],
            loadTexture
        );
    }

    function loadTexture(){
        // - キューブマップテクスチャの初期化 ---------------------------------
        // キューブ環境マッピングを行う上で、実は一番大変なのは初期化処理です。
        // 正六面体の各面にマッピングするための合計 6 枚のテクスチャを順番に読み
        // 込み、次々とアタッチしていきます。この処理は非常に冗長なので、ここで
        // は glcubic.js のヘルパーを使っています。
        // ポジションとネガティブの、それぞれの意味だけはしっかり理解しておくよ
        // うにしましょう。
        // またキューブテクスチャは読み込む画像は複数ですが、テクスチャオブジェ
        // クトとしては単体なので、そのあたりにも気をつけましょう。
        // --------------------------------------------------------------------
        // キューブマップ用のファイル名配列 @@@
        let sourceArray = [
            'cube_PX.png',
            'cube_PY.png',
            'cube_PZ.png',
            'cube_NX.png',
            'cube_NY.png',
            'cube_NZ.png'
        ];
        // キューブマップ用のターゲット定数配列 @@@
        let targetArray = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];
        // テクスチャ用の画像を読み込み @@@
        gl3.createTextureCubeFromFile(sourceArray, targetArray, 0, initialize);
    }

    function initialize(){
        // トーラスの頂点データ生成メソッド
        torusData = gl3.Mesh.torus(64, 64, 0.75, 1.5, [1.0, 1.0, 1.0, 1.0]);
        torusVBO = [
            gl3.createVbo(torusData.position),
            gl3.createVbo(torusData.normal)
        ];
        torusIBO = gl3.createIbo(torusData.index);

        // キューブの頂点データ生成メソッド
        cubeData = gl3.Mesh.cube(50.0, [1.0, 1.0, 1.0, 1.0]);
        cubeVBO = [
            gl3.createVbo(cubeData.position),
            gl3.createVbo(cubeData.normal)
        ];
        cubeIBO = gl3.createIbo(cubeData.index);

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

        // キューブマップテクスチャをバインドしておく @@@
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, gl3.textures[0].texture);

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
        mat4.perspective(60, aspect, 0.1, cameraDistance * 5.0 + 50.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // キューブを描画する
        if(cubeVisible === true){
            gl.cullFace(gl.FRONT); // カリング面の設定 @@@
            mat4.identity(mMatrix);
            mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
            mat4.transpose(mMatrix, normalMatrix);
            mat4.inverse(normalMatrix, normalMatrix);
            prg.setAttribute(cubeVBO, cubeIBO);
            // uniform 変数をシェーダにプッシュ
            prg.pushShader([
                mMatrix,
                mvpMatrix,
                normalMatrix,
                cameraPosition,
                0,    // キューブテクスチャユニット番号 @@@
                false // 法線による反射を行うかどうか @@@
            ]);
            gl3.drawElements(gl3.gl.TRIANGLES, cubeData.index.length);
        }

        // トーラスを描画する
        gl.cullFace(gl.BACK); // カリング面の設定 @@@
        mat4.identity(mMatrix);
        mat4.rotate(mMatrix, nowTime, [0.0, 1.0, 1.0], mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        mat4.transpose(mMatrix, normalMatrix);
        mat4.inverse(normalMatrix, normalMatrix);
        prg.setAttribute(torusVBO, torusIBO);
        // uniform 変数をシェーダにプッシュ
        prg.pushShader([
            mMatrix,
            mvpMatrix,
            normalMatrix,
            cameraPosition,
            0,   // キューブテクスチャユニット番号 @@@
            true // 法線による反射を行うかどうか @@@
        ]);
        gl3.drawElements(gl3.gl.TRIANGLES, torusData.index.length);
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
        cameraDistance = Math.min(Math.max(cameraDistance, 3.0), 20.0);
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

