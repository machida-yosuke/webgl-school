
// = 018 ======================================================================
// three.js では、テクスチャはローダーが用意されており比較的簡単に利用することが
// できました。WebGL のピュアな実装で行う場合も、基本的な流れは同じです。
// まず JavaScript で画像を読み込むのですが、読み込みが完了したことをトリガーに
// して処理を行うようにするために、onload イベントを活用します。
// このように読み込みに応じた処理を記述しないと、画像が読み込まれる前にレンダリ
// ングがスタートしてしまい、画面に黒いポリゴンが出てしまいます。
// また、テクスチャはユニット単位で管理されるということも、重要なポイントです。
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
    let index;        // 頂点インデックス
    let VBO;          // Vertex Buffer Object
    let IBO;          // Index Buffer Object
    let texture;      // テクスチャオブジェクト @@@

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
        // attribute にテクスチャ座標を追加し、テクスチャユニット用の uniform 変数も追加 @@@
        prg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'color', 'texCoord'], // テクスチャ座標を追加
            [3, 4, 2],                         // テクスチャ座標は vec2
            ['mvpMatrix', 'textureUnit'],      // テクスチャユニット
            ['matrix4fv', '1i'],               // ユニットは整数で指定するので 1i
            loadTexture
        );
    }

    function loadTexture(){
        // - テクスチャ用の画像をロードしイベントで初期化を実行 ---------------
        // 画像が読み込まれると onload イベントが発火することを利用して、そこか
        // らテクスチャの初期化処理を行うよう処理を記述します。
        // テクスチャはまず空の入れ物を用意し、そこに画素データを流し込むような
        // イメージで処理されます。ミップマップの生成なども含め、すべての処理は
        // バインドされているテクスチャに対してのみ有効になりますので、その点を
        // 間違えないように理解しておきましょう。
        // --------------------------------------------------------------------
        // 画像をロードしてテクスチャを生成する @@@
        let img = new Image();
        // まず先にイベントハンドラを登録する
        img.addEventListener('load', () => {
            // 空のテクスチャオブジェクトを生成
            texture = gl.createTexture();
            // テクスチャオブジェクトをバインド
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // バインド済みテクスチャオブジェクトに画素を適用
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            // バインド済みテクスチャのミップマップを自動生成
            gl.generateMipmap(gl.TEXTURE_2D);
            // 間違い防止のために念のためバインドは解除しておくのがお行儀が良い
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
        // - テクスチャ座標 ---------------------------------------------------
        // 頂点には、座標や色などの様々な属性が付加できますが、テクスチャ座標も
        // そんな頂点属性のひとつです。
        // これは、与えられたテクスチャのどの位置から画素を抽出すればいいのかを
        // 指定するための座標で、0.0 から 1.0 の範囲で指定します。
        // --------------------------------------------------------------------
        texCoord = [
            0.0, 0.0, // ひとつ目の頂点のテクスチャ座標 @@@
            1.0, 0.0, // ふたつ目の頂点のテクスチャ座標 @@@
            0.0, 1.0, // みっつ目の頂点のテクスチャ座標 @@@
            1.0, 1.0  // よっつ目の頂点のテクスチャ座標 @@@
        ];
        index = [
            0, 2, 1,
            1, 2, 3
        ];
        VBO = [
            gl3.createVbo(position),
            gl3.createVbo(color),
            gl3.createVbo(texCoord) // VBO も忘れずに追加 @@@
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

        // - テクスチャをあらためて正しくバインドしておく ---------------------
        // テクスチャオブジェクトは、常にバインドされているものが使われます。
        // ただし、複数のテクスチャを同時に扱うこともできるようにするために、テ
        // クスチャには「ユニット番号」という識別番号が与えられています。
        // 何番のユニット番号まで利用できるのかは、実行環境の GPU の性能によって
        // 変化しますので注意しましょう。
        // 原則として、テクスチャユニットは出来る限り少ない数で抑えて運用するほ
        // うが実行時の事故を減らせます。
        // --------------------------------------------------------------------
        // アクティブなテクスチャユニットを指定 @@@
        gl.activeTexture(gl.TEXTURE0);
        // テクスチャをバインド @@@
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
        mat4.rotate(mMatrix, nowTime, [0.0, 0.0, 1.0], mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);

        // プログラムオブジェクトの選択とバッファのバインド
        prg.useProgram();
        prg.setAttribute(VBO, IBO);
        // - シェーダへはユニット番号を整数でプッシュ -------------------------
        // シェーダに送り込む情報は、あくまでもテクスチャのユニット番号です。も
        // し複数のユニットに異なるテクスチャがバインドされているのであれば、シ
        // ェーダに送り込むユニット番号を変化させることで、任意のテクスチャを利
        // 用した描画が行えるわけですね。
        // --------------------------------------------------------------------
        // 行列とテクスチャユニット番号をシェーダへ送る @@@
        prg.pushShader([
            mvpMatrix, // MVPMatrix
            0          // texture unit number
        ]);
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

