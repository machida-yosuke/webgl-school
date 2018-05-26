
// = 027 ======================================================================
// 先にクォータニオンを使ったサンプルをオマケとして見せましたが、クォータニオン
// について調べていると必ずと言っていいほど登場するあるキーワードがあります。
// それがジンバルロックと呼ばれる現象です。
// ジンバルロックは、Object3D の持つ rotation などで回転を指定する方法では避ける
// ことのできない現象で、回転が正しく処理できない状態になります。より正確に言う
// と、Object3D の rotation などはすべてオイラー角と呼ばれる回転の指定方法です。
// このオイラー角による回転は考えるときは直感的でわかりやすいのですが、複雑な回
// 転を表現することが難しいです。サンプル 026 の星の向きなどがまさにそれですね。
// このサンプル 027 では、ジンバルロックやオイラー角による回転定義の難しい側面を
// 感じることができると思います。スライダーを操作しながら、いろいろと自分なりに
// 試してみましょう。
// ※このサンプルも、やはりコードを見て勉強するというよりは、実際のサンプルを動
// 作させながらその挙動を観察する目的で作っています
// ============================================================================

(() => {
    // variables
    let canvasWidth  = null;
    let canvasHeight = null;
    let targetDOM    = null;
    let run = true;
    // three objects
    let scene;
    let camera;
    let controls;
    let renderer;
    let directionalLight;
    let ambientLight;
    let axesHelper;
    let sphereGeometry;
    let earthSphere;
    let earthTexture;
    let earthMaterial;
    let torusGeometry; // トーラスジオメトリ @@@
    let xTorus;        // x 軸回転用トーラス @@@
    let yTorus;        // y 軸回転用トーラス @@@
    let zTorus;        // z 軸回転用トーラス @@@
    let xMaterial;     // x 軸回転用マテリアル @@@
    let yMaterial;     // y 軸回転用マテリアル @@@
    let zMaterial;     // z 軸回転用マテリアル @@@
    let xRange;        // x 軸回転量のスライダ @@@
    let yRange;        // y 軸回転量のスライダ @@@
    let zRange;        // z 軸回転量のスライダ @@@
    let resetButton;   // リセットボタン @@@
    // constant variables
    const RENDERER_PARAM = {
        clearColor: 0xaaaaaa
    };
    const MATERIAL_PARAM = {
        color: 0xffffff
    };
    const MATERIAL_X_AXIS_PARAM = {color: 0xff3311}; // x 軸用マテリアル @@@
    const MATERIAL_Y_AXIS_PARAM = {color: 0x11ff33}; // y 軸用マテリアル @@@
    const MATERIAL_Z_AXIS_PARAM = {color: 0x3311ff}; // z 軸用マテリアル @@@
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
        earthTexture = earthLoader.load('earth.jpg', init);

        // controls @@@
        xRange = generateRange();
        yRange = generateRange();
        zRange = generateRange();
        document.body.appendChild(xRange); xRange.style.top = '20px';
        document.body.appendChild(yRange); yRange.style.top = '50px';
        document.body.appendChild(zRange); zRange.style.top = '80px';
        resetButton = document.createElement('input');
        resetButton.type = 'button';
        resetButton.value = 'reset';
        resetButton.style.position = 'absolute';
        resetButton.style.top = '110px';
        resetButton.style.left = '20px';
        resetButton.addEventListener('click', () => {
            xRange.value = yRange.value = zRange.value = 0;
        }, false);
        document.body.appendChild(resetButton);
    }, false);

    function init(){
        // scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0.0;
        camera.position.y = 3.0;
        camera.position.z = 8.0;
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
        // axis material @@@
        xMaterial = new THREE.MeshLambertMaterial(MATERIAL_X_AXIS_PARAM);
        yMaterial = new THREE.MeshLambertMaterial(MATERIAL_Y_AXIS_PARAM);
        zMaterial = new THREE.MeshLambertMaterial(MATERIAL_Z_AXIS_PARAM);

        // geometry
        sphereGeometry = new THREE.SphereGeometry(1.0, 64, 64);
        earthSphere = new THREE.Mesh(sphereGeometry, earthMaterial);
        scene.add(earthSphere);
        // torus geometry @@@
        torusGeometry = new THREE.TorusGeometry(2.5, 0.05, 16, 16);
        let tempX = new THREE.Mesh(torusGeometry, xMaterial);
        tempX.rotation.y = Math.PI * 0.5;
        xTorus = new THREE.Group();
        xTorus.add(tempX);
        scene.add(xTorus);
        let tempY = new THREE.Mesh(torusGeometry, yMaterial);
        tempY.rotation.x = Math.PI * 0.5;
        yTorus = new THREE.Group();
        yTorus.add(tempY);
        scene.add(yTorus);
        zTorus = new THREE.Mesh(torusGeometry, zMaterial);
        scene.add(zTorus);

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

        // rotation torus
        let halfPI = Math.PI * 0.5;
        let x = xRange.value / 50.0 * halfPI;
        let y = yRange.value / 50.0 * halfPI;
        let z = zRange.value / 50.0 * halfPI;
        zTorus.rotation.x = x;
        xTorus.rotation.y = y;
        yTorus.rotation.z = z;

        earthSphere.rotation.set(x, y, z);

        renderer.render(scene, camera);
    }

    // input[type=range] を生成する関数 @@@
    function generateRange(){
        let input = document.createElement('input');
        input.type = 'range';
        input.setAttribute('min', -50);
        input.setAttribute('max', 50);
        input.style.position = 'absolute';
        input.style.left = '20px';
        input.value = 0;
        return input;
    }
})();

