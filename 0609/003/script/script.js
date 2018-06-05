
// = 003 ======================================================================
// 頂点自身に、色という情報を持たせることで自由にポリゴンに色を塗ることができる
// ことがわかりました。
// しかしこのような「頂点と直接紐付いた情報」しかシェーダに渡すことができないと
// したら、ライトのような、頂点とは直接関係のない情報はどのようにシェーダへ送れ
// ばいいのでしょうか。
// これには uniform 変数という概念を使います。
// ============================================================================

(() => {
    // variables
    let canvas;     // canvas エレメントへの参照
    let canvasSize; // canvas の大きさ（ここでは正方形の一辺の長さ）
    let prg;        // プログラムオブジェクト
    let position;   // 頂点の位置座標
    let color;      // 頂点の色
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
        // - uniform 変数定義の紐付け -----------------------------------------
        // glcubic.js には、頂点属性を表す attribute 変数や、汎用的なデータを表
        // す uniform 変数を、一括して紐付けてくれる機能があります。
        // gl3.program の初期化処理などを見ていくと詳細がわかりますが、ものすご
        // く冗長な初期化処理を行ってやる必要があるので、このように配列で一括指
        // 定ができるような設計になっています。
        // uniform 変数の場合はその名前とデータ型を指定する必要がありますが、こ
        // のデータ型は f が float を、v が vector を表しており、vec2 のデータを
        // シェーダに送りたいのであれば 2fv というようにデータ型に応じて指定して
        // やる必要があります。（WebGL API の仕様に準拠）
        // --------------------------------------------------------------------
        // glcubic の機能を使ってプログラムを生成
        prg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'color'],
            [3, 4],
            ['globalColor'], // uniform 変数の名前 @@@
            ['4fv'],         // データの種類（型） @@@
            initialize
        );
    }

    function initialize(){
        // 頂点の座標データ
        position = [
             0.0,  0.5,  0.0, // ひとつ目の頂点の x, y, z 座標
             0.5, -0.5,  0.0, // ふたつ目の頂点の x, y, z 座標
            -0.5, -0.5,  0.0  // みっつ目の頂点の x, y, z 座標
        ];
        // 頂点の色データ
        color = [
            1.0, 0.0, 0.0, 1.0, // ひとつ目の頂点の R, G, B, A カラー
            0.0, 1.0, 0.0, 1.0, // ふたつ目の頂点の R, G, B, A カラー
            0.0, 0.0, 1.0, 1.0  // みっつ目の頂点の R, G, B, A カラー
        ];
        // 座標データから頂点バッファを生成
        VBO = [
            gl3.createVbo(position),
            gl3.createVbo(color)
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
        // - 描画の前にデータを送り込む ---------------------------------------
        // WebGL ではシェーダを利用して描画を行います。それゆえに、これまで見て
        // きたように VBO を生成して登録するなど、若干冗長に見えるような手続きを
        // 行ってやる必要がありました。
        // uniform 変数の場合もやはりそれは変わりません。
        // 描画命令を発行する前に、まるでサーバに新しいファイルを送ってサイトを
        // 更新するときのように、変数の内容を送信してやります。
        // glcubic を用いる場合は、配列にまとめて一気に送り込めるようになってい
        // ますが、実際にはひとつひとつ、新しい情報をシェーダに送ってやる必要が
        // あります。
        // --------------------------------------------------------------------
        // uniform 変数をシェーダにプッシュ @@@
        prg.pushShader([
            [1.0, 0.5, 0.5, 1.0] // 赤はそのまま、緑と青は半減させるような色
        ]);
        // ドローコール（描画命令）
        gl3.drawArrays(gl3.gl.TRIANGLES, position.length / 3);
    }
})();

