
// = 032 ======================================================================
// 地獄のようなフレームバッファの大変さに思わず投げ出したくなってしまった人もい
// るかもしれませんが、フレームバッファを使うことで初めて可能になる表現はたくさ
// んあります。むしろ、フレームバッファを使わないで高品質なシーンは作れない、と
// 言い切ってしまってもいいくらいです。
// そんなフレームバッファを用いた処理の代表格に「ポストエフェクト」があります。
// 今回はネガポジ反転シェーダを利用しながら、その考え方をしっかり理解しておきま
// しょう。
// このサンプルでは、JavaScript にはほとんど変更はありません。変わっているのは
// GUI のスライダーの設定に関する部分と、フレームバッファの生成を glcubic で行
// っている点のみです。
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
    let framebuffer;  // フレームバッファ

    // glcubic
    let mat4 = gl3.Math.Mat4; // 行列処理
    let qtn  = gl3.Math.Qtn;  // クォータニオン処理
    let wrapper;              // GUI ラッパー
    let curtainSlider;        // スライダー GUI（カーテン）
    let curtain = 0.5;        // カーテン
    let mixRatioSlider;       // スライダー GUI（補間係数）
    let mixRatio = 1.0;       // 補間係数

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
        // カーテン
        curtainSlider = new gl3.Gui.Slider('curtain', curtain, 0.0, 1.0, 0.01);
        curtainSlider.add('input', (eve, self) => {
            curtain = self.getValue();
        });
        wrapper.append(curtainSlider.getElement());
        // 補間係数
        mixRatioSlider = new gl3.Gui.Slider('mix ratio', mixRatio, 0.0, 1.0, 0.01);
        mixRatioSlider.add('input', (eve, self) => {
            mixRatio = self.getValue();
        });
        wrapper.append(mixRatioSlider.getElement());

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
            ['textureUnit', 'curtain', 'mixRatio'],
            ['1i', '1f', '1f'],
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

        // - glcubic のフレームバッファ生成 -----------------------------------
        // glcubic では内部的にテクスチャを全て記憶しておくように設計されており、
        // gl3.textures[n].texture で任意のテクスチャにアクセスできます。
        // このテクスチャを記憶しておく仕組みは、フレームバッファにアタッチされ
        // るテクスチャに対しても共通なので、以下のようにフレームバッファを生成
        // する際に、末尾に引数で番号を渡すようになっています。
        // バインドするためにテクスチャを参照する際など、番号ベースでアクセスが
        // できるようになっているわけですね。
        // --------------------------------------------------------------------
        // フレームバッファを生成 @@@
        framebuffer = gl3.createFramebuffer(canvasWidth, canvasHeight, 1);

        // テクスチャのバインド @@@
        gl3.textures.map((v, i) => {
            if(v == null){return;}
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, gl3.textures[i].texture);
        });

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

        // フレームバッファのバインド
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer)

        // シーンのクリアとプログラムの選択
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        gl3.sceneClear([0.7, 0.7, 0.7, 1.0], 1.0);
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

        // フレームバッファのバインドを解除する
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // シーンのクリアとプログラムの選択
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        gl3.sceneClear([0.0, 0.0, 0.0, 1.0], 1.0);
        postPrg.useProgram();

        // 板ポリゴンの VBO と IBO を有効化
        postPrg.setAttribute(planeVBO, planeIBO);
        // テクスチャユニット番号をポストプロセスプログラムのシェーダへ送る
        postPrg.pushShader([
            1,       // フレームバッファのテクスチャユニット
            curtain, // カーテン
            mixRatio // 補間係数
        ]);
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

