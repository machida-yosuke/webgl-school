
// = 002 ======================================================================
// WebGL にとって欠かすことのできない概念に「シェーダ」があります。
// シェーダといかに密に連携することができるかは、WebGL を理解する上で非常に重要
// です。
// 理解できていれば上手にできる、ということではなく、理解していないと何もできな
// い、それが WebGL とシェーダの関係です。最初は非常に難しいですが、落ち着いて、
// 基本から順番に押さえていきましょう。
// 001 では、ポリゴンが白い色で描かれました。それはどうしてなのか。そして、自由
// にポリゴンの色を変えるにはどうしたらいいのか、それを考えてみましょう。
// ============================================================================

(() => {
    // variables
    let canvas;     // canvas エレメントへの参照
    let canvasSize; // canvas の大きさ（ここでは正方形の一辺の長さ）
    let prg;        // プログラムオブジェクト
    let position;   // 頂点の位置座標
    let color;      // 頂点の色 @@@
    let VBO;        // Vertex Buffer Object

    window.addEventListener('load', () => {
        // glcubic の初期化
        canvas = document.getElementById('webgl_canvas');
        gl3.init(canvas);
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }

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
            ['position', 'color'], // attribute 変数を追加 @@@
            [3, 4],                // attribute 変数のストライドも追加 @@@
            [],
            [],
            initialize
        );
    }

    function initialize(){
        // - 頂点に新たな属性を持たせる ---------------------------------------
        // 頂点とは、3D シーンを構成する最も基本的な単位です。
        // 頂点がひとつも無い場合、スクリーンにはオブジェクトが映し出されること
        // はありません。そして、頂点は最低でも、座標という情報を持っている必要
        // があります。そうでなくては、どこに頂点を描いたらいいのかがわからない
        // からです。
        // 頂点に任意の色を割当てたいのなら、頂点自身が「色という属性」を持って
        // いる状態にしてやればいいでしょう。VBO として頂点の色データを用意して
        // やることによって、シェーダへと色に関する情報を送り込むことができるよ
        // うになります。
        // --------------------------------------------------------------------
        // 頂点の座標データ
        position = [
             0.0,  0.5,  0.0, // ひとつ目の頂点の x, y, z 座標
             0.5, -0.5,  0.0, // ふたつ目の頂点の x, y, z 座標
            -0.5, -0.5,  0.0  // みっつ目の頂点の x, y, z 座標
        ];
        // 頂点の色データ @@@
        color = [
            1.0, 0.0, 0.0, 1.0, // ひとつ目の頂点の R, G, B, A カラー
            0.0, 1.0, 0.0, 1.0, // ふたつ目の頂点の R, G, B, A カラー
            0.0, 0.0, 1.0, 1.0  // みっつ目の頂点の R, G, B, A カラー
        ];
        // 座標データから頂点バッファを生成
        VBO = [
            gl3.createVbo(position),
            gl3.createVbo(color) // 色データからも VBO を作るのを忘れずに！ @@@
        ];

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
        // プログラムに頂点バッファをアタッチ
        prg.setAttribute(VBO);
        // ドローコール（描画命令）
        gl3.drawArrays(gl3.gl.TRIANGLES, position.length / 3);
    }
})();

