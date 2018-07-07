
// = 021 ======================================================================
// 3D 表現に限らず、グラフィックスを描画するとき透明や半透明を扱いたいと思う場面
// は結構あると思います。もちろん、WebGL でも透明度を扱うことができます。
// ただし、脅すわけではないのですが 3D API における透明系の処理は、はっきり言っ
// て、ものすごく難しいです。鬼門、と言ってもいいくらいです。
// ここでは、簡単な設定例を見ながら、ブレンドについて概要だけでも理解しましょう。
// ここで出てくる透明度の扱いに関しては、three.js を使う場合でも同様の問題が起こ
// る可能性は当然あります。
// どのような方法で描画するとしても、不具合が出たときにどうしてその不具合がでる
// のか、また回避するにはどのような措置を取ればいいのか……
// これらのことを理解していると役に立つ場面があるはずです。最初は難しいと思いま
// すが雰囲気だけでも掴んでおきましょう。
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
    let wrapper;              // gui wrapper
    let defaultRadio;         // 既定値 @@@
    let alphaBlendRadio;      // アルファブレンド @@@
    let additionRadio;        // 加算合成 @@@
    let alphaAdditionRadio;   // アルファブレンド＋加算合成 @@@

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

        // GUI Wrapper @@@
        wrapper = new gl3.Gui.Wrapper();
        document.body.appendChild(wrapper.getElement());
        // 既定値（完全な上書き処理） @@@
        defaultRadio = new gl3.Gui.Radio('default', null, true);
        wrapper.append(defaultRadio.getElement());
        // アルファブレンド @@@
        alphaBlendRadio = new gl3.Gui.Radio('alpha', null, false);
        wrapper.append(alphaBlendRadio.getElement());
        // 加算合成 @@@
        additionRadio = new gl3.Gui.Radio('add', null, false);
        wrapper.append(additionRadio.getElement());
        // アルファブレンド＋加算合成 @@@
        alphaAdditionRadio = new gl3.Gui.Radio('alpha + add', null, false);
        wrapper.append(alphaAdditionRadio.getElement());

        // サンプルの実行を止めることができるようにイベントを仕込む
        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);

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
        // 半透明を扱うためアルファ値を下げた頂点を作っておく @@@
        color = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 0.2,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 0.2
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

        // ブレンドを有効化 @@@
        gl.enable(gl.BLEND);

        // 深度テストとカリングを有効化する
        gl.enable(gl.DEPTH_TEST); // 深度テストを有効化
        // gl.enable(gl.CULL_FACE);  // ここではカリングは有効化しない @@@

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
        gl3.sceneClear([0.2, 0.2, 0.2, 1.0]); // 今回は効果をわかりやすくするため暗く @@@

        // カメラ関連の変数を更新
        cameraUpdate();
        let aspect = canvasWidth / canvasHeight;
        mat4.lookAt(cameraPosition, centerPoint, cameraUpDirection, vMatrix);
        mat4.perspective(45, aspect, 0.1, cameraDistance * 2.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // プログラムオブジェクトの選択とバッファのバインド
        prg.useProgram();
        prg.setAttribute(VBO, IBO);

        // - ブレンドファクターの設定例 ---------------------------------------
        // ここではいくつかブレンドファクターの設定例を示します。
        // ただし、ここでの設定内容にかかわらず、透明度を扱う場合の特有の問題は
        // 常に起こる可能性がありますので、注意深く、落ち着いて考えるようにしま
        // しょう。
        // --------------------------------------------------------------------
        // 既定と同じ状態（完全な上書きで処理する） @@@
        if(defaultRadio.getValue() === true){
            gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
        }
        // 一般的なアルファブレンドの設定例 @@@
        if(alphaBlendRadio.getValue() === true){
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
        }
        // 加算合成 @@@
        if(additionRadio.getValue() === true){
            gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
        }
        // アルファブレンドと加算合成 @@@
        if(alphaAdditionRadio.getValue() === true){
            gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
        }

        // - 同時に三枚の板ポリゴンを描画する ---------------------------------
        // 微妙に位置をずらしながら、三枚の板ポリゴンを描きます。
        // ここでは特に、Z 軸に対する移動がどのような順序になっているのかをしっ
        // かり把握することが理解を得ることに繋がります。
        // WebGL は右手座標系であることをイメージしながら考えましょう。
        // --------------------------------------------------------------------
        for(let i = 0; i < 3; ++i){
            // オフセット量を計算
            let offsetX = -0.5 + i * 0.5; // X 方向のオフセット量
            let offsetZ =  0.5 - i * 0.5; // Z 方向のオフセット量
            let speed = 0.5 + i * 0.2;    // 回転速度のオフセット
            // モデル座標変換
            mat4.identity(mMatrix);
            mat4.translate(mMatrix, [offsetX, 0.0, offsetZ], mMatrix);
            mat4.rotate(mMatrix, nowTime * speed, [0.0, 0.0, 1.0], mMatrix);
            // 行列を掛け合わせる
            mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
            // 行列とテクスチャユニット番号をシェーダへ送る
            prg.pushShader([
                mvpMatrix,
                0
            ]);
            // ドローコール（描画命令）
            gl3.drawElements(gl.TRIANGLES, index.length);
        }
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

