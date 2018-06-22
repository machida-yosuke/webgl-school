
// = 009 ======================================================================
// やってみよう！
// 008 では、行列が登場し一気に 3D 感が増してきましたね。
// 恐らく、既にみなさんも感じていらっしゃるかなと思いますが、ここが 3D 開発の最
// 初の「大きな壁」となるところ。ここで挫折してしまうのは簡単ですが、もう一歩、
// 勇気を出して踏み出してみましょう。
// ここでは、以下のような条件を満たす「頂点定義関数」をがんばって自分で作ること
// に挑戦してみましょう。
// １．形状はピラミッド型（底面が四角の三角錐）
// ２．幅や高さを引数で自由に変更できるようにすること
// ３．回転しても、どこから見ても破綻しないように作られていること
// ※詳細は下のほうにあるコメントブロックを参照
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
        // 記述が冗長になるので WebGL のコンテキストを取得しておく
        gl = gl3.gl;
        // こちらも同様に、記述が冗長になるので変数にいったん格納
        mat4 = gl3.Math.Mat4;

        // サンプルの実行を止めることができるようにイベントを仕込む
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
            ['mvpMatrix', 'globalColor'],
            ['matrix4fv', '4fv'],
            initialize
        );
    }

    function initialize(){
        // - 頂点の定義 -------------------------------------------------------
        // 以下に、頂点属性の定義用として、座標を表す position、色を表す color、
        // そしてインデックス用の index と３つの配列が定義されています。
        // これらの中身を定義する関数を作ってみましょう。
        // このサンプルでは、これまでと違ってカリングがオフになってます。
        // 一度完成したと思ったら、カリングをオンにしても大丈夫かどうか、検証し
        // てみましょう。カリングの原則、カメラに向かって反時計回りを表と判定す
        // る、ということを念頭に考えるのがポイントです。
        // --------------------------------------------------------------------
        position = [];
        color = [];
        index = [];
        // ピラミッドの頂点定義に挑戦！
        let pWidth = 1.0;
        let pHeight = 1.5;
        generatePyramid(pWidth, pHeight);

        function generatePyramid(width, height){
            // ここでは底面だけが定義されているのでこれを改造してピラミッドにしよう
            position.push(
                 width, 0.0,  width,
                -width, 0.0,  width,
                 width, 0.0, -width,
                -width, 0.0, -width
            );
            color.push(
                0.8, 0.5, 0.1, 1.0,
                0.8, 0.5, 0.1, 1.0,
                0.8, 0.5, 0.1, 1.0,
                0.8, 0.5, 0.1, 1.0
            );
            index.push(
                0, 1, 2, 2, 1, 3
            );
        }

        // 座標データから頂点バッファを生成
        VBO = [
            gl3.createVbo(position),
            gl3.createVbo(color)
        ];
        // インデックスバッファを生成
        IBO = gl3.createIbo(index);

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
        // gl.enable(gl.CULL_FACE);  // 今回はカリングは有効化しない
        // gl.cullFace(gl.BACK);     // カリング面の設定

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
        mat4.rotate(mMatrix, nowTime * 0.5, [1.0, 1.0, 1.0], mMatrix);
        mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
        // uniform 変数をシェーダにプッシュ
        prg.pushShader([
            mvpMatrix,
            [1.0, 1.0, 1.0, 1.0]
        ]);
        // ドローコール（描画命令）
        gl3.drawElements(gl3.gl.TRIANGLES, index.length);

        // 再帰呼び出し
        if(run){requestAnimationFrame(render);}
    }
})();

