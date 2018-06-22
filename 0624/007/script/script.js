
// = 007 ======================================================================
// 006 では、サンプルのほうに深度テストの設定のお手本がなかったこともありますの
// で、ここでしっかりと再度確認しておきます。
// 深度テストは 3DCG にはなくてはならないもののひとつで、通常は API 側でこれを設
// 定することができます。OpenGL 系の場合だと、様々な設定を行うことができる汎用的
// なメソッドである gl.enable や gl.disable を使って、フラグをオン・オフできるよ
// うになっています。
// そして、カリングについても、同様にこれらのメソッドを使って制御します。
// カリングは、ポリゴンの表面と裏面とを判断の基準として、どちらか一方をあえて描
// かないように設定することができる機能です。
// ※このサンプルでは唐突に記述量が一気に増えていますがまた別途解説しますので、
//   ここではブロックコメントが書かれている部分をしっかりと理解しましょう。
// ============================================================================

(() => {
    // variables
    let run;        // 実行フラグ
    let startTime;  // ループ開始時間
    let nowTime;    // 現在までの経過時間
    let gl;         // WebGL Rendering Context
    let mat4;       // glcubic.Math.Mat4 クラス
    let canvas;     // canvas エレメントへの参照
    let canvasSize; // canvas の大きさ（ここでは正方形の一辺の長さ）
    let prg;        // プログラムオブジェクト
    let position;   // 頂点の位置座標
    let color;      // 頂点の色
    let index;      // 頂点インデックス
    let VBO;        // Vertex Buffer Object
    let IBO;        // Index Buffer Object

    let mMatrix;    // モデル座標変換行列
    let vMatrix;    // ビュー座標変換行列
    let pMatrix;    // プロジェクション座標変換行列
    let vpMatrix;   // ビュー x プロジェクション
    let mvpMatrix;  // モデル x ビュー x プロジェクション

    window.addEventListener('load', () => {
        // glcubic の初期化
        canvas = document.getElementById('webgl_canvas');
        gl3.init(canvas);
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }
        // 記述が冗長になるので WebGL のコンテキストを取得しておく @@@
        gl = gl3.gl;
        // こちらも同様に、記述が冗長になるので変数にいったん格納 @@@
        mat4 = gl3.Math.Mat4;

        // サンプルの実行を止めることができるようにイベントを仕込む @@@
        window.addEventListener('keydown', (eve) => {
            // Esc キーを押下したら run に false が入るようにする
            run = eve.key !== 'Escape';
        }, false);

        // キャンバスの大きさはウィンドウの短辺
        canvasSize = Math.min(window.innerWidth, window.innerHeight);
        canvas.width  = canvasSize;
        canvas.height = canvasSize;

        // シェーダロードへ移行
        loadShader();
    }, false);

    function loadShader(){
        // glcubic の機能を使ってプログラムを生成
        prg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'color'],
            [3, 4],
            ['mvpMatrix', 'globalColor'], // 行列を追加 @@@
            ['matrix4fv', '4fv'],         // 行列用のデータ型識別名を追加 @@@
            initialize
        );
    }

    function initialize(){
        // 頂点の座標データ
        position = [
            -0.5,  0.5,  0.5, // ひとつ目の三角形の第一頂点
             0.5,  0.0,  0.5, // ひとつ目の三角形の第二頂点
            -0.5, -0.5,  0.5, // ひとつ目の三角形の第三頂点
             0.5,  0.5, -0.5, // ふたつ目の三角形の第一頂点
            -0.5,  0.0, -0.5, // ふたつ目の三角形の第二頂点
             0.5, -0.5, -0.5  // ふたつ目の三角形の第三頂点
        ];
        // 頂点の色データ
        color = [
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0, // ひとつ目の三角形は赤に
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0  // ふたつ目の三角形は緑に
        ];
        // インデックスデータ
        index = [
            0, 2, 1, // ひとつ目の三角形に使うインデックス
            3, 5, 4  // ふたつ目の三角形に使うインデックス
        ];
        // 座標データから頂点バッファを生成
        VBO = [
            gl3.createVbo(position),
            gl3.createVbo(color)
        ];
        // インデックスバッファを生成
        IBO = gl3.createIbo(index);

        // 行列変数の宣言 @@@
        mMatrix   = mat4.identity(mat4.create());
        vMatrix   = mat4.identity(mat4.create());
        pMatrix   = mat4.identity(mat4.create());
        vpMatrix  = mat4.identity(mat4.create());
        mvpMatrix = mat4.identity(mat4.create());

        // 行列の生成 @@@
        mat4.lookAt([0.0, 0.0, 3.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], vMatrix);
        mat4.perspective(45, 1.0, 0.1, 6.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // - 描画のための設定を行う -------------------------------------------
        // 深度テストもカリングも、既定値は「無効の状態」です。
        // 意図的に有効化を行ってやる必要があり、これには gl.enable を使います。
        // 反対に、無効化させたい場合には gl.disable を使い、引数に無効にしたい
        // 効果を enable の場合と同じように渡してやります。
        // カリングは、ポリゴンの面の向きを元に特定の向きの面を描画しないように
        // することができます。これにより負荷の軽減などの様々な効果を得られます。
        // 一般に、カリングするのは裏面であることが多いですが、表面をカリング面
        // に設定することもでき、gl.cullFace(gl.FRONT) とすることで、表面の方を
        // 描画しないようにすることも可能です。既定値は裏をカリングする、という
        // 状態なので gl.BACK を設定したのと同じになります。
        // --------------------------------------------------------------------
        // 深度テストとカリングを有効化する @@@
        gl.enable(gl.DEPTH_TEST); // 深度テストを有効化
        gl.enable(gl.CULL_FACE);  // カリングを有効化
        gl.cullFace(gl.BACK);     // カリング面の設定

        // 汎用変数の初期化 @@@
        run = true;
        startTime = Date.now();
        nowTime = 0;

        // レンダリング関数を呼ぶ
        render();
    }

    function render(){
        // ビューを設定
        gl3.sceneView(0, 0, canvasSize, canvasSize);
        // シーンのクリア
        gl3.sceneClear([0.7, 0.7, 0.7, 1.0]);
        // どのプログラムオブジェクトを利用するか明示的に設定
        prg.useProgram();
        // プログラムに頂点バッファとインデックスバッファをアタッチ
        prg.setAttribute(VBO, IBO);

        // 行列を計算する @@@
        nowTime = (Date.now() - startTime) / 1000;
        mat4.identity(mMatrix);
        mat4.rotate(mMatrix, nowTime, [0.0, 1.0, 0.0], mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        // uniform 変数をシェーダにプッシュ @@@
        prg.pushShader([
            mvpMatrix,
            [1.0, 1.0, 1.0, 1.0]
        ]);
        // ドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, index.length);
        // - アニメーション用の再帰呼び出し -----------------------------------
        // requestAnimationFrame 関数を用いると、ループしながら再帰的に関数の呼
        // び出しを行うことができます。
        // setTimeout 等でも同じような処理は書けますが requestAnimationFrame を
        // 使ってアニメーション用のループを記述するほうが良いでしょう。
        // これは、同関数ではモニターのリフレッシュレートなどに応じて自動的に最
        // 適な呼び出しが成されるためで、ブラウザのタブが非アクティブな状態だと
        // 呼び出し回数が極端に減るなど、より負荷を抑えながら効率的にアニメーシ
        // ョン処理を行うことができるようになっています。
        // --------------------------------------------------------------------
        if(run){requestAnimationFrame(render);}
    }
})();

