
// = 025 ======================================================================
// サンプル 024 での星の動きは、かなり直線的です。
// これは考えてみれば当たり前ですが、月と星の両者の位置を結んだベクトルを、その
// まま進行方向として使っているためにこのような挙動になります。
// では、星が自分の進行方向を持っており、これが月と星との位置関係によって影響を
// 受けるようにしたらどうなるでしょうか。
// ここでは、両者の位置関係が星の進行方向に影響を与えるようにした上で、双方の間
// の距離に応じて、進むスピードも変化するようにしてみましょう。
// 結構難しい計算がたくさん出てくるように感じるかもしれませんが、焦らず、じっく
// り考えましょう。
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
    let starSphere;    // 星のメッシュ
    let starMaterial;  // 星のマテリアル
    let starDirection; // 星の進行方向 @@@
    // constant variables
    const RENDERER_PARAM = {
        clearColor: 0xaaaaaa
    };
    const MATERIAL_PARAM = {
        color: 0xffffff
    };
    const MATERIAL_STAR_PARAM = {
        color: 0xff9900
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
        window.addEventListener('mousemove', (eve) => {
            if(moonSphere == null){return;}
            let w = window.innerWidth;
            let h = window.innerHeight;
            let x = eve.clientX - w / 2.0;
            let y = eve.clientY - h / 2.0;
            let nVector = normalize2D([x, y]);
            moonSphere.position.set(
                nVector[0] * 2.75,
                0.0,
                nVector[1] * 2.75
            );
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
        starMaterial = new THREE.MeshLambertMaterial(MATERIAL_STAR_PARAM);

        // geometry
        geometry = new THREE.SphereGeometry(1.0, 64, 64);
        earthSphere = new THREE.Mesh(geometry, earthMaterial);
        scene.add(earthSphere);
        moonSphere = new THREE.Mesh(geometry, moonMaterial);
        scene.add(moonSphere);
        starSphere = new THREE.Mesh(geometry, starMaterial);
        scene.add(starSphere);

        // move mesh
        moonSphere.scale.set(0.36, 0.36, 0.36);
        moonSphere.position.set(2.75, 0.0, 0.0);
        starSphere.scale.set(0.1, 0.1, 0.1);
        starSphere.position.set(0.0, 3.0, 0.0);

        // 星の進行方向は初期状態ではまずは真上に向かわせる @@@
        starDirection = [0.0, 1.0, 0.0];

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

        // 地球は一定速で回転し続ける
        earthSphere.rotation.y += 0.01;

        // 星から月に向かって伸びるベクトルを求める（終点 - 始点）
        let direction = [
            moonSphere.position.x - starSphere.position.x,
            moonSphere.position.y - starSphere.position.y,
            moonSphere.position.z - starSphere.position.z
        ];

        // 星と月の距離も調べておく @@@
        let distance = calcLength3D(direction);
        // あとで係数として使う都合上、1.0 より大きくならないようにする
        distance = Math.min(distance, 2.0) / 2.0;

        // 求めたベクトルを正規化する
        let nDirection = normalize3D(direction);

        // - 星の進行方向を補正する -------------------------------------------
        // 星は初期状態では真上にまっすぐ向かうような進行方向になっています。
        // ここに、星と月との座標から求めた「本来向かいたい方向」の影響を加える
        // わけですが……
        // ベクトルは正規化すると常に長さが 1.0 になること、方向に関することだけ
        // を考えるときは常にベクトルを正規化しておくこと、このふたつをしっかり
        // と意識しながら、星の進行方向を補正します。
        // 具体的には、本来進みたい方向の影響を少し小さくしてから加算し、加算後
        // にそのベクトルを正規化したあと、これを進行方向ベクトルとして設定し星
        // の位置を動かします。
        // --------------------------------------------------------------------
        // 正規化したベクトルを補正してから加算し、再度正規化する @@@
        starDirection = normalize3D([
            starDirection[0] + nDirection[0] * 0.1,
            starDirection[1] + nDirection[1] * 0.1,
            starDirection[2] + nDirection[2] * 0.1
        ]);

        // 求めた進行方向と距離を元に星の位置を動かす @@@
        starSphere.position.x += starDirection[0] * 0.05 * distance;
        starSphere.position.y += starDirection[1] * 0.05 * distance;
        starSphere.position.z += starDirection[2] * 0.05 * distance;

        renderer.render(scene, camera);
    }

    /**
     * 二次元ベクトルを正規化する
     * @param {Array} vec - 正規化したい二次元ベクトル
     * @return {Array} 正規化した二次元ベクトル
     */
    function normalize2D(vec){
        let length = calcLength2D(vec);
        if(length === 0.0){return vec;}
        return [vec[0] / length, vec[1] / length];
    }

    /**
     * 二次元ベクトルの長さを計算する
     * @param {Array} vec - 長さを知りたい二次元ベクトル
     * @return {float} ベクトルの長さ
     */
    function calcLength2D(vec){
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }

    /**
     * 三次元ベクトルを正規化する
     * @param {Array} vec - 正規化したい三次元ベクトル
     * @return {Array} 正規化した三次元ベクトル
     */
    function normalize3D(vec){
        let length = calcLength3D(vec);
        if(length === 0.0){return vec;}
        return [vec[0] / length, vec[1] / length, vec[2] / length];
    }

    /**
     * 三次元ベクトルの長さを計算する
     * @param {Array} vec - 長さを知りたい三次元ベクトル
     * @return {float} ベクトルの長さ
     */
    function calcLength3D(vec){
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    }

})();

