
// = 002 ======================================================================
// まず最初に、描画結果を確認しやすくするために、マウスで描画結果に干渉できるよ
// うにしておきましょう。
// three.js には、カメラを操作するためのコントロールと呼ばれる補助機能が用意され
// ているので、それを読み込んで利用します。
// ============================================================================

(() => {
    window.addEventListener('load', () => {
        // 汎用変数の宣言
        let width = window.innerWidth;   // ブラウザのクライアント領域の幅
        let height = window.innerHeight; // ブラウザのクライアント領域の高さ
        let targetDOM = document.getElementById('webgl'); // スクリーンとして使う DOM

        let scene;    // シーン
        let camera;   // カメラ
        let controls; // カメラコントロール @@@
        let renderer; // レンダラ
        let geometry; // ジオメトリ
        let material; // マテリアル
        let box;      // ボックスメッシュ

        const CAMERA_PARAM = { // カメラに関するパラメータ
            fovy: 60,
            aspect: width / height,
            near: 0.1,
            far: 10.0,
            x: 0.0,
            y: 2.0,
            z: 5.0,
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
        };
        const RENDERER_PARAM = { // レンダラに関するパラメータ
            clearColor: 0x333333,
            width: width,
            height: height
        };
        const MATERIAL_PARAM = { // マテリアルに関するパラメータ
            color: 0xff9933
        };

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.x = CAMERA_PARAM.x;
        camera.position.y = CAMERA_PARAM.y;
        camera.position.z = CAMERA_PARAM.z;
        camera.lookAt(CAMERA_PARAM.lookAt);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        targetDOM.appendChild(renderer.domElement);

        // - オービットコントロールを追加する ---------------------------------
        // JavaScript では DOM 上で発生するマウスイベントを捕捉してインタラクテ
        // ィブな処理が行なえますね。ですから、コントローラにはイベントを拾う対
        // 象となるオブジェクトを与えてやる必要があります。
        // 通常は、three.js のレンダリングの対象となる DOM を指定すればいいでし
        // ょう。第一引数にはカメラオブジェクトを与えます。
        // --------------------------------------------------------------------
        // orbit controls @@@
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        material = new THREE.MeshBasicMaterial(MATERIAL_PARAM);
        box = new THREE.Mesh(geometry, material);

        scene.add(box);

        // - レンダリングループを定義 -----------------------------------------
        // 繰り返しレンダリングを行うために、レンダリングループを定義します。
        // 以下の render という関数が、requestAnimationFrame によって繰り返し呼
        // び出され、結果的にループしながら何度も描画が行われるようになります。
        // このようなレンダリングループは、Esc キーで停止できるようにしておくと
        // 精神の安定が得られます（個人の見解ですｗ）
        // --------------------------------------------------------------------
        let run = true;
        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);

        // rendering @@@
        render();
        function render(){
            // rendering loop
            if(run){requestAnimationFrame(render);}

            // rendering
            renderer.render(scene, camera);
        }
    }, false);
})();

