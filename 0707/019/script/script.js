
// = 019 ======================================================================
// テクスチャには「テクスチャパラメータ」と呼ばれる設定項目があります。
// このパラメータの設定には、大別して「フィルタリング」に関する設定項目と「オー
// バーラップ」に関する設定項目があります。
// ここではまず、フィルタリングに関する設定を変更した場合にどのような変化が起こ
// るのかを検証してみましょう。
// 今回のサンプルでは、以前登場したビューポートの設定を上手に使って、一度に画面
// に４つのシーンを同時に描画しています。一見、記述量が多く見えると思いますが、
// ここは単純な算数なので落ち着いて考えましょう。
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
    let texCoord;     // 頂点のテクスチャ座標
    let index;        // 頂点インデックス
    let VBO;          // Vertex Buffer Object
    let IBO;          // Index Buffer Object
    let texture;      // テクスチャオブジェクト

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
        prg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'color', 'texCoord'],
            [3, 4, 2],
            ['mvpMatrix', 'textureUnit'],
            ['matrix4fv', '1i'],
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
        img.src = 'sample.png';
    }

    function initialize(){
        // 板ポリゴンの頂点定義
        position = [
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        color = [
            0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 1.0, 1.0,
            0.5, 0.5, 1.0, 1.0
        ];
        texCoord = [
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ];
        index = [
            0, 2, 1,
            1, 2, 3
        ];
        VBO = [
            gl3.createVbo(position),
            gl3.createVbo(color),
            gl3.createVbo(texCoord)
        ];
        IBO = gl3.createIbo(index);

        // 行列の初期化
        mMatrix      = mat4.identity(mat4.create());
        vMatrix      = mat4.identity(mat4.create());
        pMatrix      = mat4.identity(mat4.create());
        vpMatrix     = mat4.identity(mat4.create());
        mvpMatrix    = mat4.identity(mat4.create());

        // 深度テストとカリングを有効化する
        gl.enable(gl.DEPTH_TEST); // 深度テストを有効化
        gl.enable(gl.CULL_FACE);  // カリングを有効化
        gl.cullFace(gl.BACK);     // カリング面の設定

        // アクティブなテクスチャユニットを指定してバインド
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
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        gl3.sceneClear([0.7, 0.7, 0.7, 1.0]);

        // カメラ関連の変数を更新
        cameraUpdate();
        let aspect = canvasWidth / canvasHeight;
        mat4.lookAt(cameraPosition, centerPoint, cameraUpDirection, vMatrix);
        mat4.perspective(45, aspect, 0.1, cameraDistance * 2.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);
        // モデル座標変換
        mat4.identity(mMatrix);
        mat4.rotate(mMatrix, nowTime * 0.1, [0.0, 0.0, 1.0], mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);

        // プログラムオブジェクトの選択とバッファのバインド
        prg.useProgram();
        prg.setAttribute(VBO, IBO);
        // 行列とテクスチャユニット番号をシェーダへ送る
        prg.pushShader([
            mvpMatrix,
            0
        ]);

        // - テクスチャパラメータを変化させながら四つのシーンを描画 -----------
        // 以前に、ビューポートに関するサンプルがあったのを覚えているでしょうか。
        // ここではビューポートの設定を変更しながら、同時にテクスチャパラメータ
        // を変化させます。
        // それぞれのシーンごとにフィルタリング設定が違っているのですが、実際に
        // どのような見た目の変化が起こるのか確認しましょう。
        // --------------------------------------------------------------------
        // . （左下） gl.NEAREST ..............................................
        // いわゆるニアレストネイバー法。
        // 参照した画素の色をそのまま採用する。
        // ....................................................................
        // ビューポートを設定する
        gl3.sceneView(0, 0, canvasWidth / 2, canvasHeight / 2);
        // テクスチャパラメータの設定（NEAREST、ニアレストネイバー）
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // ドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, index.length);
        // . （右下） gl.LINEAR ...............................................
        // いわゆるバイリニアフィルタリング。
        // 周辺の画素も参照しながら線形補間した結果を利用する。
        // ....................................................................
        // ビューポートを設定する
        gl3.sceneView(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight / 2);
        // テクスチャパラメータの設定（LINEAR、リニア）
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // ドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, index.length);
        // . （左上） gl.NEAREST_MIPMAP_NEAREST ...............................
        // ミップマップを利用してニアレストネイバー法を適用する。
        // ....................................................................
        // ビューポートを設定する
        gl3.sceneView(0, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2);
        // テクスチャパラメータの設定（ミップマップ＋ニアレストネイバー）
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
        // ドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, index.length);
        // . （右上） gl.LINEAR_MIPMAP_LINEAR .................................
        // ミップマップを利用してさらにリニアで補間する。
        // ....................................................................
        // ビューポートを設定する
        gl3.sceneView(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2);
        // テクスチャパラメータの設定（ミップマップ＋リニア）
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        // ドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, index.length);
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
        cameraDistance = Math.min(Math.max(cameraDistance, 1.5), 20.0);
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

