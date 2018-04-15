
// = 008 ======================================================================
// three.js にはたくさんの組み込みジオメトリがあります。
// これまでのサンプルでは一貫してボックスばかり使っていましたが、代表的なその他
// のジオメトリについてもここで試してみましょう。
// 引数がそれぞれどういった意味を持っているのか疑問に思ったときは、公式のドキュ
// メント等を参考にしましょう。
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
        let sphere;           // スフィアメッシュ（球体） @@@
        let cone;             // コーンメッシュ（円錐） @@@
        let torus;            // トーラスメッシュ（輪・ドーナツ） @@@
        let directionalLight; // ディレクショナルライト（平行光源）
        let ambientLight;     // アンビエントライト（環境光）
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
            color: 0xff9933,
            specular: 0xffffff
        };
        const DIRECTIONAL_LIGHT_PARAM = {
            color: 0xffffff,
            intensity: 1.0,
            x: 1.0,
            y: 1.0,
            z: 1.0
        };
        const AMBIENT_LIGHT_PARAM = {
            color: 0xffffff,
            intensity: 0.2
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

        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);

        // ボックスジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.BoxGeometry(1.0, 0.5, 2.0);
        box = new THREE.Mesh(geometry, material);
        box.position.x = 2.0;
        box.position.y = 2.0;
        scene.add(box);
        // スフィアジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.SphereGeometry(1.5, 16, 16);
        sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = 2.0;
        sphere.position.y = -2.0;
        scene.add(sphere);
        // コーンジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.ConeGeometry(1.0, 1.5, 32);
        cone = new THREE.Mesh(geometry, material);
        cone.position.x = -2.0;
        cone.position.y = 2.0;
        scene.add(cone);
        // トーラスジオメトリの生成とメッシュ化 @@@
        geometry = new THREE.TorusGeometry(1.0, 0.4, 32, 32);
        torus = new THREE.Mesh(geometry, material);
        torus.position.x = -2.0;
        torus.position.y = -2.0;
        scene.add(torus);

        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
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
                box.rotation.y    += 0.02;
                box.rotation.z    += 0.02;
                sphere.rotation.y += 0.02;
                sphere.rotation.z += 0.02;
                cone.rotation.y   += 0.02;
                cone.rotation.z   += 0.02;
                torus.rotation.y  += 0.02;
                torus.rotation.z  += 0.02;
            }

            renderer.render(scene, camera);
        }
    }, false);
})();

