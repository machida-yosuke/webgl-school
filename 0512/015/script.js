
// = 015 ======================================================================
// 単に CG の世界でテクスチャと言った場合には、大抵の場合それは画素の集まり、つ
// まり画像のことを言う場合が多いです。イメージデータ、と言ってもいいかもしれま
// せん。
// three.js でも、やはり画像を読み込んでこれを 3DCG の世界で利用する方法があり、
// 当然のごとくテクスチャが登場します。非常に簡単に使うことができますが、ブラウ
// ザのセキュリティ上の問題から、ローカルファイルを直接ブラウザでリソースとして
// 扱うことができないのでローカルサーバなどを用いて実行してやる必要があります。
// また一連の処理が非同期に行われることにも気をつけましょう。
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
    let texture; // texture @@@
    let plane;
    let box;
    let sphere;
    let cone;
    let torus;
    let group;
    let directionalLight;
    let ambientLight;
    let axesHelper;
    // - テクスチャの効果をわかりやすく ---------------------------------------
    // 今回のサンプルでは、テクスチャの効果をわかりやすくするために、各種の色設
    // 定を変更しています。
    // 背景を白に、またフォグの色も同様の白に、そしてマテリアルの色を白に設定す
    // ることで、テクスチャが貼られた際の色合いを元データの画像と同じになるよう
    // にしています。
    // もちろん、実際の実装においては、その時々の状況に応じてこれらの色設定はそ
    // の都度変更しましょう。
    // ------------------------------------------------------------------------
    // constant variables @@@
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

        // - 画像をロードしてテクスチャを生成する -----------------------------
        // 一般的な実行ファイルとは異なり、画像などのリソースを非同期で取得する
        // ことになる JavaScript では、以下のようにコールバックを使ってロード完
        // 了を検出し、処理を進めていく手法を用いることが多いです。
        // three.js には様々なリソースをロードするためのローダーが用意されている
        // ので、これらに対象のファイル名とコールバック関数を指定して初期化を行
        // なっていきます。
        // 以下では、sample.jpg というファイルを読み込み、ロードが完了したあとで
        // init 関数をコールする、という指定になっています。
        // --------------------------------------------------------------------
        // load texture @@@
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

        // group
        group = new THREE.Group();
        scene.add(group);

        // - テクスチャをマテリアルに割り当てる -------------------------------
        // three.js では、テクスチャはマテリアルに対して割り当てることになってい
        // ます。マテリアルを生成したあと、その map プロパティに対して単にテクス
        // チャを代入して格納するだけで OK です。簡単！
        // --------------------------------------------------------------------
        // material and geometory
        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
        material.map = texture; // map プロパティにテクスチャをセットする @@@
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

        renderer.render(scene, camera);
    }
})();

