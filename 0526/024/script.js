
// = 024 ======================================================================
// 二次元のベクトルの長さを調べたり、あるいは正規化を行ったりという処理を行いま
// したが、実はこれ、そのまま三次元にも応用できます。
// ここでは、地球、月、に続く第三の登場人物として「月が大好きすぎる星」に登場し
// てもらいましょう。
// この星は、月がいる場所めがけて常に移動し続けるような動作をします。このように
// 三次元空間上の特定の位置に向かって移動し続けるオブジェクトを定義するにはどの
// ような計算が必要なのか、考えてみましょう。
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
    let starSphere;    // 星のメッシュ @@@
    let starMaterial;  // 星のマテリアル @@@
    // constant variables
    const RENDERER_PARAM = {
        clearColor: 0xaaaaaa
    };
    const MATERIAL_PARAM = {
        color: 0xffffff
    };
    const MATERIAL_STAR_PARAM = { // 星用マテリアル設定 @@@
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
        starMaterial = new THREE.MeshLambertMaterial(MATERIAL_STAR_PARAM); // 星用マテリアル @@@

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
        starSphere.scale.set(0.1, 0.1, 0.1);    // 星の大きさ @@@
        starSphere.position.set(0.0, 3.0, 0.0); // 星の初期位置 @@@

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

        // - 星は常に月を追いかけるようにする ---------------------------------
        // 月、あるいは星は、それぞれ Object3D クラスに属するオブジェクトなので
        // 当然ですが position プロパティを見れば現在の位置がわかります。
        // 三次元空間上でふたつのオブジェクトの座標がわかれば、そこから三次元ベ
        // クトルを定義することができます。ここで定義できるベクトルは、地点 A か
        // ら地点 B のように、二点間を結ぶベクトルとなります。
        // 言い換えるとこのベクトルは、A から B の方角へ向いたベクトル、とも言え
        // ます。つまりこのベクトルを活用すると、特定のオブジェクトを追いかける
        // ように動く追尾の動作を行うことができるんですね。
        // これはベクトルが大きさだけでなく、向きを持つからにほかなりません。
        // --------------------------------------------------------------------
        // 星から月に向かって伸びるベクトルを求める（終点 - 始点） @@@
        let direction = [
            moonSphere.position.x - starSphere.position.x,
            moonSphere.position.y - starSphere.position.y,
            moonSphere.position.z - starSphere.position.z
        ];
        // 求めたベクトルを正規化する @@@
        let nDirection = normalize3D(direction);
        // 正規化したベクトルを使って星を動かす @@@
        // ※正規化したベクトルは大きすぎる場合があるので 0.1 倍して影響を小さく補正
        starSphere.position.x += nDirection[0] * 0.1;
        starSphere.position.y += nDirection[1] * 0.1;
        starSphere.position.z += nDirection[2] * 0.1;

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

