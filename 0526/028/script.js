
// = 028 ======================================================================
// WebGL や three.js に限らず、CG 用語のひとつに「ポストプロセス」というキーワー
// ドがあります。
// このポストプロセスは、ポストエフェクトなどとも呼ばれることがありますが、いず
// れも意味していることはほとんど同じで、口語的に言うなら「一度撮影した写真を後
// から加工する」という工程のことを指しています。
// three.js では、コンポーザーという概念を導入することにより、この一度撮影した、
// つまり一度レンダリングしたシーンに対して、事後処理的にエフェクトを加えること
// ができるようになります。
// このサンプルでは、読み込む JS ファイルが大量に増えているので、HTML ファイルの
// head セクションも別途確認しておきましょう。
// ============================================================================

(() => {
    // variables
    let canvasWidth  = null;
    let canvasHeight = null;
    let targetDOM    = null;
    let run = true;
    let isDown = false;
    // three objects
    let scene;
    let camera;
    let controls;
    let renderer;
    let composer;   // effect composer @@@
    let renderPass; // rendering pass @@@
    let glitchPass; // digital glitch pass @@@
    let geometry;
    let material;
    let materialPoint;
    let texture;
    let plane;
    let box;
    let sphere;
    let cone;
    let torus;
    let group;
    let directionalLight;
    let ambientLight;
    let axesHelper;
    // constant variables
    const SCENE_PARAM = {
        fogColor: 0xffffff,
        fogNear: 8.0,
        fogFar: 15.0
    };
    const RENDERER_PARAM = {
        clearColor: 0xffffff
    };
    const MATERIAL_PARAM = {
        color: 0xffffff,
        specular: 0x000000
    };
    const MATERIAL_PARAM_POINT = {
        color: 0xff9933,
        size: 0.1
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
        window.addEventListener('mousedown', () => {
            isDown = true;
        }, false);
        window.addEventListener('mouseup', () => {
            isDown = false;
        }, false);
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        // load texture
        let loader = new THREE.TextureLoader();
        texture = loader.load('sample.jpg', init);
    }, false);

    // initialize
    function init(){
        // camera
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0.0;
        camera.position.y = 3.0;
        camera.position.z = 10.0;
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        // scene and fog
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(
            SCENE_PARAM.fogColor,
            SCENE_PARAM.fogNear,
            SCENE_PARAM.fogFar
        );

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(canvasWidth, canvasHeight);
        targetDOM.appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // - コンポーザーやパスを初期化する -----------------------------------
        // コンポーザーとは、直訳すると作曲家などの意味になりますが、ここではシ
        // ーンの切り替えを行ってくれる構成作家のようなイメージです。
        // コンポーザーは、自身に追加された順番通りにレンダリングを行ってくれる
        // ようになっていて、それぞれの「レンダリング一回分」のことをパスと呼び
        // ます。
        // three.js には、様々な種類のパスが用意されており、ここではその中から、
        // グリッチパスをコンポーザーに渡して実行してもらいましょう。
        // renderPass: これが従来どおり普通にシーンを描くパス
        // glitchPass: これが renderPass が描画したシーンにグリッチを掛けるパス
        // --------------------------------------------------------------------
        // post effect @@@
        composer = new THREE.EffectComposer(renderer);
        renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass); // まず先に renderPass をコンポーザーに渡す
        glitchPass = new THREE.GlitchPass();
        composer.addPass(glitchPass); // 二番目に glitchPass をコンポーザーに渡す
        glitchPass.renderToScreen = true; // glitchPass 適用後の結果は画面に直接出す

        // group
        group = new THREE.Group();
        scene.add(group);

        // material and geometory
        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
        material.map = texture;
        materialPoint = new THREE.PointsMaterial(MATERIAL_PARAM_POINT);
        // plane
        geometry = new THREE.PlaneGeometry(20.0, 20.0);
        plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2.0;
        plane.position.set(0.0, -2.0, 0.0);
        scene.add(plane);
        // box
        geometry = new THREE.BoxGeometry(0.5, 2.0, 1.0);
        box = new THREE.Mesh(geometry, material);
        box.position.x = 2.0;
        box.position.z = 2.0;
        group.add(box);
        // sphere
        geometry = new THREE.SphereGeometry(1.5, 16, 16);
        sphere = new THREE.Line(geometry, material);
        sphere.position.x = 2.0;
        sphere.position.z = -2.0;
        group.add(sphere);
        // cone
        geometry = new THREE.ConeGeometry(1.0, 1.5, 32);
        cone = new THREE.Mesh(geometry, material);
        cone.position.x = -2.0;
        cone.position.z = 2.0;
        group.add(cone);
        // torus
        geometry = new THREE.TorusGeometry(1.0, 0.4, 32, 32);
        torus = new THREE.Points(geometry, materialPoint);
        torus.position.x = -2.0;
        torus.position.z = -2.0;
        group.add(torus);

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

        // rendering
        render();
    }

    // rendering
    function render(){
        if(run){requestAnimationFrame(render);}

        if(isDown === true){
            group.rotation.y += 0.02;
        }

        // renderer ではなくコンポーザーにシーン全体を描画するよう指示する @@@
        composer.render();
    }
})();

