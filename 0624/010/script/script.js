
// = 010 ======================================================================
// WebGL でのライティング（照明効果）を実現するために、法線について学びましょう。
// 法線は頂点の向いている方向を表すパラメータです。3DCG ではよく耳にする言葉なの
// ですが、日常生活ではほとんど使うことはないですね。
// 法線がどうして必要なのかはおいおいわかってきます。まずは、それがどういうもの
// なのかを理解するために、まずは法線をそのまま色として出した場合の結果を見なが
// ら、法線について考えてみましょう。
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
    let torusData;  // トーラスのジオメトリデータ @@@
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
        gl = gl3.gl;
        mat4 = gl3.Math.Mat4;

        // サンプルの実行を止めることができるようにイベントを仕込む
        window.addEventListener('keydown', (eve) => {
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
        prg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'normal', 'color'],
            [3, 3, 4],
            ['mvpMatrix'],
            ['matrix4fv'],
            initialize
        );
    }

    function initialize(){
        // - glcubic.js のトーラス生成メソッドを拝借 --------------------------
        // サンプル 009 でピラミッドを作ってみてわかったかと思うのですが、WebGL
        // ではジオメトリを定義するのは非常に難易度の高い作業です。
        // ここでは学習を効率よく行うために、ジオメトリの生成はヘルパー関数を使
        // って行います。もし自分で挑戦してみたければ、最初は球体からトライする
        // ことをおすすめします。
        // --------------------------------------------------------------------
        // トーラスの頂点データ生成メソッド @@@
        // 第一引数：トーラスの輪の部分の分割数
        // 第二引数：輪を構成するパイプの分割数
        // 第三引数：パイプの太さ
        // 第四引数：輪の半径
        // 第五引数：色を表すベクトル（RGBA を 0.0 ～ 1.0 で指定）
        torusData = gl3.Mesh.torus(32, 32, 0.5, 1.0, [1.0, 1.0, 1.0, 1.0]);
        // 座標データから頂点バッファを生成
        VBO = [
            gl3.createVbo(torusData.position),
            gl3.createVbo(torusData.normal),
            gl3.createVbo(torusData.color)
        ];
        // インデックスバッファを生成
        IBO = gl3.createIbo(torusData.index);

        mMatrix   = mat4.identity(mat4.create()); // モデル座標変換行列
        vMatrix   = mat4.identity(mat4.create()); // ビュー座標変換行列
        pMatrix   = mat4.identity(mat4.create()); // プロジェクション座標変換行列
        vpMatrix  = mat4.identity(mat4.create()); // v と p を掛け合わせたもの
        mvpMatrix = mat4.identity(mat4.create()); // m と v と p の全てを掛け合わせたもの

        mat4.lookAt([0.0, 0.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], vMatrix);
        mat4.perspective(45, 1.0, 0.1, 10.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

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
        // ビューを設定
        gl3.sceneView(0, 0, canvasSize, canvasSize);
        // シーンのクリア
        gl3.sceneClear([0.7, 0.7, 0.7, 1.0]);
        // どのプログラムオブジェクトを利用するか明示的に設定
        prg.useProgram();
        // プログラムに頂点バッファとインデックスバッファをアタッチ
        prg.setAttribute(VBO, IBO);

        // 時間の経過を得る（Date.now は現在時刻のタイムスタンプをミリ秒で返す）
        nowTime = (Date.now() - startTime) / 1000;
        mat4.identity(mMatrix);
        mat4.rotate(mMatrix, Math.PI * 0.1, [1.0, 0.0, 0.0], mMatrix); // ちょい手前に傾ける @@@
        mat4.rotate(mMatrix, nowTime * 0.5, [0.0, 1.0, 0.0], mMatrix); // 時間経過で Y 軸回転 @@@
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        // uniform 変数をシェーダにプッシュ
        prg.pushShader([
            mvpMatrix
        ]);
        // ドローコール（描画命令） @@@
        gl3.drawElements(gl3.gl.TRIANGLES, torusData.index.length);

        // 再帰呼び出し
        if(run){requestAnimationFrame(render);}
    }
})();

