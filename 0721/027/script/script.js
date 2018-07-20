
// = 027 ======================================================================
// WebGL では、頂点シェーダでテクスチャを参照することもできます。
// つまり一連のパーティクルのサンプルで見てきたような、ダイナミックな頂点の制御
// に対して、テクスチャを用いた処理を行うこともできるのですね。
// ここでは画像を読み込みテクスチャとしてシェーダに転送したあと、その読み出した
// 色から輝度を算出しシーンに影響するようにしてみましょう。
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
    let position;     // 頂点座標
    let color;        // 頂点カラー
    let texCoord;     // 頂点のテクスチャ座標 @@@
    let randomValue;  // 頂点が持つ乱数
    let VBO;          // Vertex Buffer Object
    let texture;      // テクスチャオブジェクト @@@

    // glcubic
    let mat4 = gl3.Math.Mat4; // 行列処理
    let qtn  = gl3.Math.Qtn;  // クォータニオン処理
    let wrapper;              // GUI ラッパー
    let pointSizeSlider;      // スライダー GUI（ポイントサイズ）
    let pointSize = 2.0;      // ポイントサイズ
    let timeScaleSlider;      // スライダー GUI（時間の経過速度）
    let timeScale = 10.0;     // 時間の経過速度
    let offsetScaleSlider;    // スライダー GUI（オフセット係数） @@@
    let offsetScale = 0.5;    // オフセット係数 @@@

    // matrix
    let mMatrix;   // モデル座標変換行列
    let vMatrix;   // ビュー座標変換行列
    let pMatrix;   // プロジェクション座標変換行列
    let vpMatrix;  // ビュー x プロジェクション
    let mvpMatrix; // モデル x ビュー x プロジェクション

    // constant
    const POINT_RESOLUTION = 256;             // 頂点を一行に配置する個数
    const POINT_AREA_WIDTH = 5;               // 頂点を配置するエリアの広さ
    const POINT_COLOR = [1.0, 0.3, 0.6, 0.7]; // 頂点の色

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
        // 頂点のポイントサイズ
        pointSizeSlider = new gl3.Gui.Slider('point size', pointSize, 0.5, 16.0, 0.1);
        pointSizeSlider.add('input', (eve, self) => {
            pointSize = self.getValue();
        });
        wrapper.append(pointSizeSlider.getElement());
        // 時間の経過速度
        timeScaleSlider = new gl3.Gui.Slider('time scale', timeScale, 1.0, 20.0, 0.1);
        timeScaleSlider.add('input', (eve, self) => {
            timeScale = self.getValue();
        });
        wrapper.append(timeScaleSlider.getElement());
        // オフセット係数 @@@
        offsetScaleSlider = new gl3.Gui.Slider('offset scale', offsetScale, 0.0, 1.0, 0.01);
        offsetScaleSlider.add('input', (eve, self) => {
            offsetScale = self.getValue();
        });
        wrapper.append(offsetScaleSlider.getElement());

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
            ['position', 'color', 'texCoord', 'randomValue'],
            [3, 4, 2, 4],
            [
                'mvpMatrix',
                'pointSize',
                'timeScale',
                'time',
                'offsetScale', // オフセット係数 @@@
                'textureUnit'  // テクスチャをシェーダに送る @@@
            ],
            ['matrix4fv', '1f', '1f', '1f', '1f', '1i'],
            loadTexture
        );
    }

    function loadTexture(){
        // 画像をロードしてテクスチャを生成する
        let img = new Image();
        // まず先にイベントハンドラを登録する
        img.addEventListener('load', () => {
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            // テクスチャの生成が終ったので初期化ロジックを呼ぶ
            initialize();
        }, false);
        img.src = 'sample.jpg';
    }

    function initialize(){
        // 頂点の点群データを定義 @@@
        position = [];
        color = [];
        texCoord = [];
        randomValue = [];
        (() => {
            let i, j;                          // 汎用カウンタ変数
            let x, y;                          // XY の座標格納用
            let s, t;                          // テクスチャ座標用 @@@
            let width = POINT_AREA_WIDTH;      // XY 平面の一辺の長さ
            let half = width / 2.0;            // 一辺の長さの半分（効率化のために先に求めておく）
            let resolution = POINT_RESOLUTION; // 平面上に配置する点の解像度
            let offset = width / resolution;   // 頂点間のオフセット量
            for(i = 0; i < resolution; ++i){
                // x 座標
                x = -half + offset * i;
                s = i / resolution;
                for(j = 0; j < resolution; ++j){
                    // y 座標
                    y = -half + offset * j;
                    t = 1.0 - j / resolution;
                    position.push(x, y, 0.0);
                    color.push(
                        POINT_COLOR[0],
                        POINT_COLOR[1],
                        POINT_COLOR[2],
                        POINT_COLOR[3]
                    );
                    // テクスチャ座標を頂点属性に加える
                    texCoord.push(s, t);
                    randomValue.push(
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        Math.random()
                    );
                }
            }
        })();
        VBO = [
            gl3.createVbo(position),
            gl3.createVbo(color),
            gl3.createVbo(texCoord),
            gl3.createVbo(randomValue)
        ];
        prg.setAttribute(VBO);

        // 行列の初期化
        mMatrix   = mat4.identity(mat4.create());
        vMatrix   = mat4.identity(mat4.create());
        pMatrix   = mat4.identity(mat4.create());
        vpMatrix  = mat4.identity(mat4.create());
        mvpMatrix = mat4.identity(mat4.create());

        // ブレンドを使うので深度テストを無効化する
        gl.disable(gl.DEPTH_TEST);
        // 質感向上のために加算合成のブレンドを有効にする
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);

        // テクスチャをバインドしておく
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

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
        gl3.sceneClear([0.05, 0.05, 0.05, 1.0]);

        // カメラ関連の変数を更新
        cameraUpdate();
        // アスペクト比もその都度計算する
        let aspect = canvasWidth / canvasHeight;
        mat4.lookAt(cameraPosition, centerPoint, cameraUpDirection, vMatrix);
        mat4.perspective(60, aspect, 0.1, cameraDistance * 5.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // 行列に反映する
        mat4.identity(mMatrix);
        mat4.rotate(mMatrix, nowTime * 0.05, [0.0, 1.0, 0.0], mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        // uniform 変数をシェーダにプッシュ
        prg.pushShader([
            mvpMatrix,
            pointSize,
            timeScale,
            nowTime,
            offsetScale, // オフセット係数 @@@
            0            // テクスチャユニット @@@
        ]);
        // ドローコール（描画命令）
        gl3.drawArrays(gl.POINTS, position.length / 3);
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
        cameraDistance = Math.min(Math.max(cameraDistance, 3.0), 10.0);
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

