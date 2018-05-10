
// = 014 ======================================================================
// three.js では霧を意味するフォグと呼ばれるテクニックを非常に簡単に利用すること
// ができます。
// 一般的な 3D プログラミングでは、フォグはシェーダに対する記述などが必要な場合
// が多いですが、three.js ならシーンに対してフォグを簡単に適用できます。
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
    let geometry;
    let material;
    let materialPoint;
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
    // - フォグのパラメータを定義 ---------------------------------------------
    // three.js では、シーンに対してフォグを設定する、という形を採用しています。
    // ここではフォグに対するパラメータとして、色、フォグが掛かり始める距離、フ
    // ォグが完全に掛かるまでの距離、という３つのパラメータを定義しておきます。
    // 地味にポイントになるのは、フォグの色が「背景クリアの色と同じ」ということ
    // です。これはフォグの色を変更してみると、どういうことかわかるでしょう。
    // ------------------------------------------------------------------------
    // scene parameter @@@
    const SCENE_PARAM = {
        fogColor: 0x333333, // フォグの色
        fogNear: 1.0,       // フォグの掛かり始める距離
        fogFar: 15.0        // フォグが完全に掛かる距離
    };
    const RENDERER_PARAM = {
        clearColor: 0x333333 // フォグと同じ色にしておくのがポイント！
    };
    const MATERIAL_PARAM = {
        color: 0xff9933,
        specular: 0xffffff
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

        // camera
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0.0;
        camera.position.y = 3.0;
        camera.position.z = 10.0;
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        // - シーンにフォグを追加する -----------------------------------------
        // 宣言セクションで設定したフォグに関するパラメータは、シーンの fog プロ
        // パティに対して THREE.Fog インスタンスを設定する際に利用します。
        // three.js に限らず、一般的なフォグの実装では「なにも描かれない空間」に
        // 対しては色がつかないという点がとても重要です。現実世界の霧とは挙動が
        // 違いますので注意しましょう。
        // --------------------------------------------------------------------
        // scene and fog @@@
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

        // group
        group = new THREE.Group();
        scene.add(group);

        // material and geometory
        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
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

        // rendering
        render();
    }, false);

    // rendering
    function render(){
        if(run){requestAnimationFrame(render);}

        if(isDown === true){
            group.rotation.y += 0.02;
        }

        renderer.render(scene, camera);
    }
})();

