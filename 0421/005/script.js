
// = 005 ======================================================================
// オブジェクトに光を当て、より立体感を出すためにライトを導入しましょう。
// three.js を用いる場合はライトはオブジェクトとしてシーンに追加します。つまり、
// これまでに登場した様々なオブジェクトと同じような感じで扱えばいいのですね。
// 3D にはライトには様々な種類がありますが、まずは平行光源のライトをシーンに追加
// してみましょう。
// ============================================================================

(() => {
    window.addEventListener('load', () => {
        // 汎用変数の宣言
        let width = window.innerWidth;
        let height = window.innerHeight;
        let targetDOM = document.getElementById('webgl');

        let run = true;       // 実行フラグ
        let scene;            // シーン
        let camera;           // カメラ
        let controls;         // カメラコントロール
        let renderer;         // レンダラ
        let geometry;         // ジオメトリ
        let material;         // マテリアル
        let box;              // ボックスメッシュ
        let directionalLight; // ディレクショナルライト（平行光源） @@@
        let axesHelper;       // 軸ヘルパーメッシュ
        let isDown = false;   // マウスボタンが押されているかどうか

        const CAMERA_PARAM = {
            fovy: 60,
            aspect: width / height,
            near: 0.1,
            far: 10.0,
            x: 0.0,
            y: 2.0,
            z: 5.0,
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
        };
        const RENDERER_PARAM = {
            clearColor: 0x333333,
            width: width,
            height: height
        };
        const MATERIAL_PARAM = {
            color: 0xff9933
        };
        // ライトに関するパラメータの定義 @@@
        const DIRECTIONAL_LIGHT_PARAM = {
            color: 0xffffff,
            intensity: 1.0,
            x: 1.0,
            y: 1.0,
            z: 1.0
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

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        // - ライトを有効にするためにマテリアルを変更する ---------------------
        // ライトというと照らす側の光源のことばかり考えてしまいがちですが、その
        // 光を受け取る側の準備も必要です。
        // 具体的には、メッシュに適用するマテリアルをライトを受けることができる
        // タイプに変更します。いくつかある対応するマテリアルのうち、今回はまず
        // ランバートマテリアルを選択します。
        // --------------------------------------------------------------------
        // change mesh type @@@
        material = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
        box = new THREE.Mesh(geometry, material);
        scene.add(box);

        // - ライトオブジェクトを生成してシーンに追加する ---------------------
        // 続いてライトオブジェクトを作ります。
        // 先述のとおりライトにはいくつか種類がありますが今回は平行光源を使いま
        // す。平行光源は英語ではディレクショナルライト、と呼びます。
        // また、光には色や強度という概念を持たせることができますので、これらは
        // 引数で任意の値を指定してやります。
        // --------------------------------------------------------------------
        // initialize light @@@
        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);

        window.addEventListener('mousemove', (eve) => {
            let horizontal = (eve.clientX / width - 0.5) * 2.0;
            let vertical   = -(eve.clientY / height - 0.5) * 2.0;
            box.position.x = horizontal;
            box.position.y = vertical;
        }, false);
        window.addEventListener('mousedown', () => {
            isDown = true;
        }, false);
        window.addEventListener('mouseup', () => {
            isDown = false;
        }, false);

        render();
        function render(){
            if(run){requestAnimationFrame(render);}

            if(isDown === true){
                box.rotation.y += 0.02;
            }

            renderer.render(scene, camera);
        }
    }, false);
})();

