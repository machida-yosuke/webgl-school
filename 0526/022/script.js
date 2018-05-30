
// = 022 ======================================================================
// さてサンプル 021 では、直接月の rotation を指定することで一定の面が地球のほう
// を向いたままにするようにしましたが、実はグループ機能を用いることでも同様の状
// 態を再現できます。
// グループ機能は、以前も解説したようにオブジェクトを特定の世界のなかで固定し、
// グループ自体をまとめて操作します。
// 頭を柔らかくして、どうしてグループ機能でサンプル 021 と同じことができるのか、
// 考えてみてください。
// ============================================================================

(() => {
    // variables
    let canvasWidth  = null;
    let canvasHeight = null;
    let targetDOM    = null;
    let run = true;
    let startTime = 0.0;
    let nowTime = 0.0;
    // three objects
    let scene;
    let camera;
    let controls;
    let renderer;
    let directionalLight;
    let ambientLight;
    let axesHelper;
    let geometry;
    let earthSphere;   // 地球のメッシュ
    let earthTexture;  // 地球用のテクスチャ
    let earthMaterial; // 地球用のマテリアル
    let moonSphere;    // 月のメッシュ
    let moonTexture;   // 月のテクスチャ
    let moonMaterial;  // 月のマテリアル
    let moonGroup;     // 月用のグループ @@@
    // constant variables
    const RENDERER_PARAM = {
        clearColor: 0xaaaaaa
    };
    const MATERIAL_PARAM = {
        color: 0xffffff
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

    // entry point
    window.addEventListener('load', () => {
        // canvas
        canvasWidth  = window.innerWidth;
        canvasHeight = window.innerHeight;
        targetDOM    = document.getElementById('webgl');

        // events
        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        // texture load
        let earthLoader = new THREE.TextureLoader();
        let moonLoader = new THREE.TextureLoader();
        earthTexture = earthLoader.load('earth.jpg', () => {
            moonTexture = moonLoader.load('moon.jpg', init);
        });
    }, false);

    function init(){
        // scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0.0;
        camera.position.y = 3.0;
        camera.position.z = 10.0;
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(canvasWidth, canvasHeight);
        targetDOM.appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // material
        earthMaterial = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
        earthMaterial.map = earthTexture;
        moonMaterial = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
        moonMaterial.map = moonTexture;

        // geometry
        geometry = new THREE.SphereGeometry(1.0, 64, 64);
        earthSphere = new THREE.Mesh(geometry, earthMaterial);
        scene.add(earthSphere);
        moonSphere = new THREE.Mesh(geometry, moonMaterial);

        // move mesh
        moonSphere.scale.set(0.36, 0.36, 0.36);  // 月を小さくし……
        moonSphere.position.set(2.75, 0.0, 0.0); // 月を動かし……
        moonSphere.rotation.y = Math.PI;         // 面をあらかじめ地球に向きにする
        moonGroup = new THREE.Group();
        moonGroup.add(moonSphere); // 月をグループに入れて固定する @@@
        scene.add(moonGroup);      // グループをシーンに追加する @@@

        // lights
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

        // helper
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        // begin
        startTime = Date.now();

        // rendering
        render();
    }

    // rendering
    function render(){
        if(run){requestAnimationFrame(render);}

        nowTime = (Date.now() - startTime) / 1000.0;

        earthSphere.rotation.y += 0.01;

        // 時間の経過からラジアンを求める
        let rad = nowTime % (Math.PI * 2.0);

        // 月を含むグループを回転させる @@@
        moonGroup.rotation.y = rad;

        renderer.render(scene, camera);
    }
})();

