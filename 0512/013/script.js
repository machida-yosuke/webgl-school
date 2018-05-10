
// = 013 ======================================================================
// three.js に限らず、3D プログラミングではカメラをどう実装しているかによって、
// 最終的な描画結果は大きく変わります。
// このことを手軽に理解するきっかけとして、ここでは正射影投影を行うカメラを用い、
// その描画結果の変化を体験してみましょう。three.js ではカメラを生成する際にどの
// オブジェクトを用いたのかによってカメラの性質が変化します。
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
    const RENDERER_PARAM = {
        clearColor: 0x333333
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

        // scene and camera
        scene = new THREE.Scene();
        // camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        // - 正射影投影を行うカメラを使う -------------------------------------
        // これまでのサンプルで一貫して利用していた PerspectiveCamera は、透視投
        // 影変換を行うカメラです。
        // ここでは、正射影投影変換を行う OrthographicCamera を使っています。
        // 初期化や、あるいはウィンドウサイズがリサイズされた際に、どのようにパ
        // ラメータを設定するのかなどが全く異なりますので注意しましょう。
        // また、見た目がどのように変化するのかも把握しておきましょう。
        // --------------------------------------------------------------------
        // generate camera parameter @@@
        let cameraParam = generateCameraParam(10.0);
        camera = new THREE.OrthographicCamera(
            cameraParam.left,   // レンダリングする空間の左端
            cameraParam.right,  // レンダリングする空間の右端
            cameraParam.top,    // レンダリングする空間の上端
            cameraParam.bottom, // レンダリングする空間の下端
            0.1,                // ニアクリップ面までの距離
            50.0                // ファークリップ面までの距離
        );
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
            // camera.aspect = window.innerWidth / window.innerHeight;
            // リサイズ時のパラメータ変更も正射影投影用に変更 @@@
            let cameraParam = generateCameraParam(10.0);
            camera.left   = cameraParam.left;
            camera.right  = cameraParam.right;
            camera.top    = cameraParam.top;
            camera.bottom = cameraParam.bottom;
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

    // generate camera parameter @@@
    /**
     * 正射影投影変換のためのカメラパラメータを生成する
     * @param {number} scale - レンダリングする空間の広さを示すスケール
     * @return {object}
     */
    function generateCameraParam(scale){
        let w = window.innerWidth;
        let h = window.innerHeight;
        let aspect = w / h;
        return {
            aspect:  aspect,
            left:   -aspect * scale,
            right:   aspect * scale,
            top:     scale,
            bottom: -scale,
        };
    }
})();

