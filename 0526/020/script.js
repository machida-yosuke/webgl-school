
// = 020 ======================================================================
// まずは 3D 数学に関する基本中の基本、三角関数の使い方です。
// three.js の Object3D が持つ rotation などのプロパティではなく、自力で計算した
// 結果を使って月を周回させます。
// 三角関数などプログラミングで角度を扱う場合は、角度は常に度数ではなくラジアン
// で表現します。ラジアンとはなにか、またそれをどのように使ってサインやコサイン
// を求めるのかを確認しましょう。
// ============================================================================

(() => {
    // variables
    let canvasWidth  = null;
    let canvasHeight = null;
    let targetDOM    = null;
    let run = true;
    let startTime = 0.0; // 実行開始時間 @@@
    let nowTime = 0.0;   // 現在までの経過時間 @@@
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
        scene.add(moonSphere);

        // move mesh
        moonSphere.scale.set(0.36, 0.36, 0.36);
        // moonSphere.position.set(2.75, 0.0, 0.0); // 月はあとあと動かすのでここではなにもしない @@@

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

        // レンダリング開始前の時刻を保持しておく @@@
        startTime = Date.now();

        // rendering
        render();
    }

    // rendering
    function render(){
        if(run){requestAnimationFrame(render);}

        nowTime = Date.now() - startTime; // 経過時間を計算（ミリ秒） @@@
        nowTime /= 1000;                  // そのままでは大きすぎるので秒単位にする @@@

        // - 経過時間からラジアンやサイン・コサインを求める -------------------
        // ラジアンとは、弧度法で表した角度です。
        // その範囲は 0.0 ～ Math.PI * 2.0 で、度数法で言えば 0 ～ 360 度と同等
        // になります。JavaScript を始めとする多くの言語やツールでは、角度の表現
        // はラジアンを用います。度数法で 180 度なら、弧度法では PI になります。
        // これらのことを踏まえて、以下の処理でどうして % 記号による式が出てくる
        // のか考えてみましょう。
        // % 記号は、除算の剰余を求める演算子です。
        // --------------------------------------------------------------------
        // 時間の経過からサインやコサインが求まるようにする @@@
        let rad = nowTime % (Math.PI * 2.0);
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);

        // - 求めたサイン・コサインを使って座標を指定する ---------------------
        // サインやコサインは、その性質上、常に値の範囲が -1.0 ~ 1.0 になります。
        // このままでは値が小さすぎる、あるいは逆に大きすぎる、という場合は単純
        // にその結果に対して拡縮を行ってやればいいでしょう。
        // 今回は、本来の地球と月の距離の約 1/10 となる 2.75 倍しています。
        // このような単純な乗算をスカラー倍、などと呼ぶことがあります。意味とし
        // ては単純になんらかの数値を乗算することを表しているだけですので、必要
        // 以上に難しく捉える必要はありません。
        // --------------------------------------------------------------------
        // 計算結果をスカラー倍して月の座標に設定する @@@
        let x = cos * 2.75;
        let z = sin * 2.75;
        moonSphere.position.set(x, 0.0, -z);

        earthSphere.rotation.y += 0.01;
        moonSphere.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
})();

