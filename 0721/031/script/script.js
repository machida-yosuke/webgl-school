
// = 031 ======================================================================
// WebGL による実装の難関のひとつであり、かつ、この壁を乗り越えることができたか
// どうかがその後の 3D 開発人生を決めると言っても過言ではないターニングポイント、
// フレームバッファを使ってみましょう。
// 一気にコードが複雑＋冗長になるので、まずはおおまかな全体の流れをしっかりと把
// 握することが大切です。
// 一度、フレームバッファのための準備関数のようなものを作ればけして恐くない概念
// なのですが、今回はあえて全部平文で書いてます。とにかくめげないこと（笑）
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
    let mainPrg;      // メインシーン用プログラムオブジェクト
    let postPrg;      // ポストプロセス用プログラムオブジェクト
    let sphereData;   // 球体のジオメトリデータ
    let sphereVBO;    // 球体の VBO
    let sphereIBO;    // 球体の VBO
    let planeData;    // 板ポリゴンのジオメトリデータ
    let planeVBO;     // 板ポリゴンの VBO
    let planeIBO;     // 板ポリゴンの VBO

    // framebuffer
    let framebuffer;        // フレームバッファ
    let depthRenderBuffer;  // 深度描画用のレンダーバッファ
    let framebufferTexture; // フレームバッファにアタッチするテクスチャ

    // glcubic
    let mat4 = gl3.Math.Mat4; // 行列処理
    let qtn  = gl3.Math.Qtn;  // クォータニオン処理
    let wrapper;              // GUI ラッパー
    let darkSlider;           // スライダー GUI（暗さ）
    let dark = 1.0;           // 暗さ

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
        // 暗さ
        darkSlider = new gl3.Gui.Slider('dark', dark, 0.0, 1.0, 0.01);
        darkSlider.add('input', (eve, self) => {
            dark = self.getValue();
        });
        wrapper.append(darkSlider.getElement());

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
        // - リソースのロードを行う -------------------------------------------
        // 今回のサンプルはこれまでにない「マルチシェーダ」の実装です。
        // マルチシェーダとはそのままの意味で、要はシェーダが複数同時に使われる
        // という意味です。
        // JavaScript 慣れしていないとちょっと違和感があるかもしれませんが、以下
        // では「テクスチャロード」→「シェーダを非同期読み込み」→「初期化関数」
        // というように順番に読み込みと初期化を行なっています。
        // --------------------------------------------------------------------
        mainPrg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'normal', 'texCoord'],
            [3, 3, 2],
            [
                'mMatrix',
                'mvpMatrix',
                'normalMatrix',
                'eyePosition',
                'textureUnit'
            ],
            ['matrix4fv', 'matrix4fv', 'matrix4fv', '3fv', '1i'],
            isLoaded
        );
        postPrg = gl3.createProgramFromFile(
            './shader/post.vert',
            './shader/post.frag',
            ['position'],
            [3],
            ['textureUnit', 'dark'],
            ['1i', '1f'],
            isLoaded
        );

        function isLoaded(){
            if(mainPrg.prg != null &&
               postPrg.prg != null &&
               true
            ){loadTexture();}
        }
    }

    function loadTexture(){
        let source = 'test.jpg';
        gl3.createTextureFromFile(source, 0, () => {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, gl3.textures[0].texture);
            initialize();
        });
    }

    function initialize(){
        // トーラスの頂点データ生成メソッド
        sphereData = gl3.Mesh.sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
        sphereVBO = [
            gl3.createVbo(sphereData.position),
            gl3.createVbo(sphereData.normal),
            gl3.createVbo(sphereData.texCoord)
        ];
        sphereIBO = gl3.createIbo(sphereData.index);

        // 板ポリゴンの頂点データを定義
        planeData = {
            position: [
                -1.0,  1.0,  0.0,
                 1.0,  1.0,  0.0,
                -1.0, -1.0,  0.0,
                 1.0, -1.0,  0.0
            ],
            index: [
                0, 2, 1,
                1, 2, 3
            ]
        };
        planeVBO = [
            gl3.createVbo(planeData.position)
        ];
        planeIBO = gl3.createIbo(planeData.index);

        // - フレームバッファを生成する ---------------------------------------
        // フレームバッファとは、描画領域として利用できるバッファの集合体です。
        // この初期化処理は非常に冗長ですが、要は地道に必要なオブジェクトを生成
        // してはアタッチしていくことを繰り返すだけです。
        // 基本的に、一度関数化してしまえば、特別な理由がなければそれを使いまわ
        // しすれば問題ありません。というかこの中身について無理に覚えようとする
        // 必要はほぼないので、安心して大丈夫です。
        // ※実際、次のサンプルからは glcubic のヘルパー使って初期化します
        // ただし、アクティブなテクスチャユニットの設定など、他の箇所に影響を与
        // えたり、あるいは受けたりする項目もあるので注意が必要です。
        // --------------------------------------------------------------------
        // 空のフレームバッファの生成
        framebuffer = gl.createFramebuffer();
        // フレームバッファのバインド
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        // 空のレンダーバッファの生成
        depthRenderBuffer = gl.createRenderbuffer();
        // レンダーバッファのバインド
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
        // レンダーバッファにサイズとフォーマットを指定
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvasWidth, canvasHeight);
        // フレームバッファにレンダーバッファを深度バッファとしてアタッチ
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
        // テクスチャのアクティブなユニットを変更
        gl.activeTexture(gl.TEXTURE1);
        // 空のテクスチャオブジェクトを生成
        framebufferTexture = gl.createTexture();
        // テクスチャをバインド
        gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
        // テクスチャにサイズとフォーマットを指定してリセット
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvasWidth, canvasHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        // テクスチャパラメータの設定
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // フレームバッファにテクスチャをカラーバッファとしてアタッチ
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebufferTexture, 0);
        // 最後に念のためバッファのバインドは解除しておく
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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

        // カメラ関連の変数を更新
        cameraUpdate();
        // アスペクト比もその都度計算する
        let aspect = canvasWidth / canvasHeight;
        mat4.lookAt(cameraPosition, centerPoint, cameraUpDirection, vMatrix);
        mat4.perspective(60, aspect, 0.1, cameraDistance * 5.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // - フレームバッファに対してレンダリングする -------------------------
        // さていよいよ描画ですが、ここもなかなかに冗長で、かなり紛らわしい部分
        // が多いので落ち着いて考えましょう。
        // まず最初に、フレームバッファのほうにレンダリングを行います。
        // フレームバッファをバインドし、ビューポートを設定しクリアします。
        // そしてメインプログラムを用いて球体を描きます。
        // この時点では、フレームバッファに対しての描画が行われただけですので、
        // スクリーンには何も描画されません。
        // --------------------------------------------------------------------
        // フレームバッファのバインド
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        // 更新された幅と高さでフレームバッファ用にビューを設定する
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        // フレームバッファに描画するビューのためのクリアカラーを設定する
        gl3.sceneClear([0.7, 0.7, 0.7, 1.0], 1.0);
        // フレームバッファに対するレンダリングはメインプログラムを使う
        mainPrg.useProgram();
        // 球体の VBO と IBO を有効化
        mainPrg.setAttribute(sphereVBO, sphereIBO);
        // 行列の計算と描画命令
        mat4.identity(mMatrix);
        mat4.rotate(mMatrix, nowTime * 0.5, [0.0, 1.0, 0.0], mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        mat4.transpose(mMatrix, normalMatrix);
        mat4.inverse(normalMatrix, normalMatrix);
        // uniform 変数をシェーダにプッシュ
        mainPrg.pushShader([
            mMatrix,
            mvpMatrix,
            normalMatrix,
            cameraPosition,
            0
        ]);
        gl3.drawElements(gl3.gl.TRIANGLES, sphereData.index.length);

        // - スクリーンにポストプロセスで描画する -----------------------------
        // フレームバッファへの描画が終わったので、今度はスクリーンのほうに本番
        // のシーンをレンダリングします。
        // といっても、ここでは画面いっぱいに隙間なく板ポリゴンを置くだけですの
        // で、行列処理すら登場しません。
        // 落ち着いて考えましょう。
        // --------------------------------------------------------------------
        // フレームバッファのバインドを解除する
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // ※もしフレームバッファと canvas の大きさが違う場合は以下のように設定しなおしが必要
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        // スクリーンに描画するビューのためのクリアカラーを設定する
        gl3.sceneClear([0.0, 0.0, 0.0, 1.0], 1.0);
        // スクリーンへの描画にはポストプロセス用プログラムを使う
        postPrg.useProgram();
        // 板ポリゴンの VBO と IBO を有効化
        postPrg.setAttribute(planeVBO, planeIBO);
        // テクスチャユニット番号をポストプロセスプログラムのシェーダへ送る
        postPrg.pushShader([1, dark]);
        // ドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, planeData.index.length);
    }

    // カメラ関連 =========================================================
    let cameraDistance     = 3.0;
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
            cameraScale = 0.25;
        }else if(w < 0){
            cameraScale = -0.25;
        }
    }
    function cameraUpdate(){
        let v = [1.0, 0.0, 0.0];
        cameraScale *= 0.8;
        cameraDistance += cameraScale;
        cameraDistance = Math.min(Math.max(cameraDistance, 2.0), 10.0);
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

