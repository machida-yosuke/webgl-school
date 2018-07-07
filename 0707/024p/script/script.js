
// = 024p =====================================================================
// WebGL のインスタンシングの話題が出ましたので、急遽用意したサンプルです。
// このサンプルは、024 のフォグのサンプルを改造したもので、ループを回して地道に
// ひとつひとつ描画していた 024 に対し、ここではインスタンシングを使って、一気に
// 大量のトーラスを描画しています。
// WebGL の拡張機能であるインスタンシングを有効化するフローなど、若干手間が掛か
// りますが、WebGL 2.0 では既定でインスタンシングが使えるようになっています。
// ============================================================================

(() => {
    // variables
    let run;          // 実行フラグ
    let startTime;    // ループ開始時間
    let nowTime;      // 現在までの経過時間
    let gl;           // WebGL Rendering Context
    let ext;          // WebGL の拡張機能のインスタンス用 @@@
    let canvas;       // canvas エレメントへの参照
    let canvasWidth;  // canvas の横幅
    let canvasHeight; // canvas の高さ
    let prg;          // プログラムオブジェクト
    let torusData;    // トーラスのジオメトリデータ
    let VBO;          // Vertex Buffer Object
    let IBO;          // Index Buffer Object

    // glcubic
    let mat4 = gl3.Math.Mat4; // 行列処理
    let qtn  = gl3.Math.Qtn;  // クォータニオン処理
    let wrapper;              // GUI ラッパー
    let fogStartSlider;       // スライダー GUI（フォグ開始位置）
    let fogEndSlider;         // スライダー GUI（フォグ終了位置）
    let fogStart = 5.0;       // フォグ開始位置
    let fogEnd = 15.0;        // フォグ終了位置

    // matrix
    let mMatrix;      // モデル座標変換行列
    let vMatrix;      // ビュー座標変換行列
    let pMatrix;      // プロジェクション座標変換行列
    let vpMatrix;     // ビュー x プロジェクション
    let mvpMatrix;    // モデル x ビュー x プロジェクション
    let normalMatrix; // 法線変換行列

    // constant
    const TORUS_COUNT = 1000;      // 描画するトーラスの数 @@@
    const TORUS_RANDOM_WIDTH = 25; // トーラスがランダムに配置される広さ

    window.addEventListener('load', () => {
        // glcubic の初期化
        canvas = document.getElementById('webgl_canvas');
        gl3.init(canvas);
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }
        gl = gl3.gl;

        // インスタンシングのための拡張機能を有効化する @@@
        ext = gl.getExtension('ANGLE_instanced_arrays');
        if(ext == null){
            alert('ANGLE_instanced_arrays not supported');
            return;
        }

        // GUI Wrapper
        wrapper = new gl3.Gui.Wrapper();
        document.body.appendChild(wrapper.getElement());
        // フォグ開始位置
        fogStartSlider = new gl3.Gui.Slider('fog start', fogStart, 5.0, 15.0, 0.1);
        fogStartSlider.add('input', (eve, self) => {
            fogStart = self.getValue();
        });
        wrapper.append(fogStartSlider.getElement());
        // フォグ終了位置
        fogEndSlider = new gl3.Gui.Slider('fog end', fogEnd, 15.0, 25.0, 0.1);
        fogEndSlider.add('input', (eve, self) => {
            fogEnd = self.getValue();
        });
        wrapper.append(fogEndSlider.getElement());

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
            ['position', 'normal', 'color', 'randomValue'], // ランダムな座標を attribute に追加 @@@
            [3, 3, 4, 3],                                   // XYZ の座標値なのでストライドは 3 @@@
            [
                'mMatrix',
                'mvpMatrix',
                'normalMatrix',
                'eyePosition',
                'fogStart',
                'fogEnd',
                'time'
            ],
            ['matrix4fv', 'matrix4fv', 'matrix4fv', '3fv', '1f', '1f', '1f'],
            initialize
        );
    }

    function initialize(){
        // トーラスをランダムに配置するためのオフセット量
        let torusRandom = [];
        // 乱数からオフセット量を決める
        for(let i = 0; i < TORUS_COUNT; ++i){
            // VBO にするので、一次元の配列にランダムな XYZ 座標をインスタンス分入れておく @@@
            torusRandom.push(
                Math.random() * TORUS_RANDOM_WIDTH - TORUS_RANDOM_WIDTH / 2,
                Math.random() * TORUS_RANDOM_WIDTH - TORUS_RANDOM_WIDTH / 2,
                Math.random() * TORUS_RANDOM_WIDTH - TORUS_RANDOM_WIDTH / 2
            );
        }

        // トーラスの頂点データ生成メソッド
        torusData = gl3.Mesh.torus(64, 64, 0.2, 0.5, [0.8, 0.2, 0.6, 1.0]);
        // インスタンシングの情報を VBO として追加しておく @@@
        VBO = [
            gl3.createVbo(torusData.position),
            gl3.createVbo(torusData.normal),
            gl3.createVbo(torusData.color),
            gl3.createVbo(torusRandom) // ← 追加！
        ];
        IBO = gl3.createIbo(torusData.index);

        // インスタンシングの除数を設定する @@@
        // 除数
        ext.vertexAttribDivisorANGLE(prg.attL[3], 1);

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
        mat4.perspective(60, aspect, 0.1, cameraDistance * 5.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // トーラスの頂点情報をバインド
        prg.setAttribute(VBO, IBO);
        // モデル座標変換行列
        mat4.identity(mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        mat4.transpose(mMatrix, normalMatrix);
        mat4.inverse(normalMatrix, normalMatrix);
        // uniform 変数をシェーダにプッシュ
        prg.pushShader([
            mMatrix,
            mvpMatrix,
            normalMatrix,
            cameraPosition,
            fogStart,
            fogEnd,
            nowTime
        ]);
        // インスタンシング専用のどローコールを用いる @@@
        ext.drawElementsInstancedANGLE(
            gl.TRIANGLES,
            torusData.index.length,
            gl.UNSIGNED_SHORT,
            0,
            TORUS_COUNT
        );
    }

    // カメラ関連 =========================================================
    let cameraDistance     = 10.0;
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
