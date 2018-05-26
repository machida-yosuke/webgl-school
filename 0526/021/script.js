
// = 021 ======================================================================
// ラジアン、そしてサインとコサインを使って、月を周回させることができたものの、
// 月は本来なら、常に地球側に同じ面が向いています。月の裏側というのは、地球上か
// ら空を見上げても見ることができないはずです。
// これを正しく実現するには、いったいどのような方法があるでしょうか。
// まずサンプル 021 では月自体の rotation を操作する方法で実現するやり方を考えて
// みましょう。
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
        // moonSphere.position.set(2.75, 0.0, 0.0); // 月はあとあと動かすのでここではなにもしない

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

        // 時間の経過からサインやコサインが求まるようにする
        let rad = nowTime % (Math.PI * 2.0);
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);
        let x = cos * 2.75;
        let z = sin * 2.75;
        moonSphere.position.set(x, 0.0, -z);

        // - 月のある面が常に地球に向くようにする -----------------------------
        // 月の向きを地球側に常に向いた状態にする、というとすごく難しいことを計
        // 算しなくてはいけないのではと感じるかもしれません。
        // でも、これは図を描くなどして落ち着いて考えれば実はとても簡単なことな
        // んです。答えとしては以下のように、座標を求めるために用いたラジアンを
        // 回転にも適用してやればいいのです。
        // そして、このことからもわかるとおり、これまで特に意識して使っていなか
        // った人も多いかもしれませんが、Object3D.rotation にはラジアンを指定す
        // ればよかったのです。なにげなく 0.01 などの数値を足し続けるような記述
        // をこれまでしていましたが、あれはラジアン単位で角度を加算し続ける処理
        // を行っていたのですね。
        // --------------------------------------------------------------------
        // 月のある面を常に地球のほうに向けさせるために回転させる @@@
        moonSphere.rotation.y = rad + Math.PI;

        renderer.render(scene, camera);
    }
})();

