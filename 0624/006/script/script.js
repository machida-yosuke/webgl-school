
// = 006 ======================================================================
// WebGL では、オブジェクトは頂点によって描かれます。そのことは、ここまでの取り
// 組みのなかで、徐々に感覚がつかめてきていると思います。
// では、頂点が実際に描画される「順序」についてはどうでしょうか。現実の世界では
// ありとあらゆるものは、手前にあれば奥にあるものを覆い隠します。しかし、3DCG の
// 世界のなかでは、全てのものは頂点が定義された順番に描かれていきます。
// ここではそのことを体感してみましょう。
// ============================================================================

(() => {
    // variables
    let canvas;     // canvas エレメントへの参照
    let canvasSize; // canvas の大きさ（ここでは正方形の一辺の長さ）
    let prg;        // プログラムオブジェクト
    let position;   // 頂点の位置座標
    let color;      // 頂点の色
    let index;      // 頂点インデックス
    let VBO;        // Vertex Buffer Object
    let IBO;        // Index Buffer Object

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
            ['position', 'color'],
            [3, 4],
            ['globalColor'],
            ['4fv'],
            initialize
        );
    }

    function initialize(){
        // - ふたつの三角形ポリゴンを定義 -------------------------------------
        // 現象をわかりやすくするために、ここでは一度にふたつの三角形ポリゴンを
        // 定義しています。
        // WebGL では、奥行きに関する情報を扱う Z 値の扱いが「右手座標系」です。
        // 親指を X の正方向、人差し指を Y の正方向に向けたとき、中指がどちらに
        // 向くかが、Z の正方向を表します。DirectX は、左手系です。
        // 下の頂点定義の配列を見ると、ふたつ目の三角形の Z 値が負の数値になって
        // いますね。WebGL は右手系なので、これは奥に置かれていることを表してい
        // ます。さて、描画結果はどうなるでしょうか。
        // Z 値の原則に沿って考えるなら赤が手前に来るはずですが……
        // --------------------------------------------------------------------
        // 頂点の座標データ @@@
        position = [
            -0.5,  0.5,  0.5, // ひとつ目の三角形の第一頂点
             0.5,  0.0,  0.5, // ひとつ目の三角形の第二頂点
            -0.5, -0.5,  0.5, // ひとつ目の三角形の第三頂点
             0.5,  0.5, -0.5, // ふたつ目の三角形の第一頂点
            -0.5,  0.0, -0.5, // ふたつ目の三角形の第二頂点
             0.5, -0.5, -0.5  // ふたつ目の三角形の第三頂点
        ];
        // 頂点の色データ @@@
        color = [
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0, // ひとつ目の三角形は赤に
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0  // ふたつ目の三角形は緑に
        ];
        // インデックスデータ @@@
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
        // uniform 変数をシェーダにプッシュ
        prg.pushShader([
            [1.0, 1.0, 1.0, 1.0]
        ]);
        // インデックスデータを用いる場合のドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, index.length);
    }
})();

