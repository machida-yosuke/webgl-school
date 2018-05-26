
// = 026 ======================================================================
// 注意：これはオマケのサンプルです！
// クォータニオンや、ベクトルの内積・外積などが登場しますので、かなり数学的に難
// しい内容なので、あくまでもオマケです。一見して意味がわからなくても気に病む必
// 要はまったくありませんので、あまり過度に落ち込んだり心配したりしないようにし
// てください（笑）
// この 026 のサンプルでは、星を三角錐に置き換え、進行方向にきちんと頭を向けるよ
// うにしています。内積や外積といったベクトル演算は、実際にどのような使いみちが
// あるのかわかりにくかったりもするので、このサンプルを通じて雰囲気だけでも掴ん
// でおくと、いつか自分でなにか特殊な挙動を実現したい、となったときにヒントにな
// るかもしれません。
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
    let sphereGeometry;
    let coneGeometry; // cone @@@
    let earthSphere;
    let earthTexture;
    let earthMaterial;
    let moonSphere;
    let moonTexture;
    let moonMaterial;
    let starCone;
    let starMaterial;
    let starDirection;
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
        sphereGeometry = new THREE.SphereGeometry(1.0, 64, 64);
        coneGeometry = new THREE.ConeGeometry(0.2, 0.5, 32); // cone @@@
        earthSphere = new THREE.Mesh(sphereGeometry, earthMaterial);
        scene.add(earthSphere);
        moonSphere = new THREE.Mesh(sphereGeometry, moonMaterial);
        scene.add(moonSphere);
        starCone = new THREE.Mesh(coneGeometry, starMaterial); // star @@@
        scene.add(starCone);

        // move mesh
        moonSphere.scale.set(0.36, 0.36, 0.36);
        moonSphere.position.set(2.75, 0.0, 0.0);
        starCone.position.set(0.0, 3.0, 0.0);

        // default star direction
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
            moonSphere.position.x - starCone.position.x,
            moonSphere.position.y - starCone.position.y,
            moonSphere.position.z - starCone.position.z
        ];

        // 求めたベクトルを正規化する（これが本来進みたい方向）
        let nDirection = normalize3D(direction);

        // 更新前のスターの進行方向をあとで使うので取っておく @@@
        let prevDirection = [
            starDirection[0],
            starDirection[1],
            starDirection[2]
        ];

        // 本来進みたい方向に少しだけベクトルを向ける
        starDirection = normalize3D([
            starDirection[0] + nDirection[0] * 0.1,
            starDirection[1] + nDirection[1] * 0.1,
            starDirection[2] + nDirection[2] * 0.1
        ]);
        // 求めた進行方向と距離を元に星の位置を動かす
        starCone.position.x += starDirection[0] * 0.1;
        starCone.position.y += starDirection[1] * 0.1;
        starCone.position.z += starDirection[2] * 0.1;

        // - クォータニオン関連 -----------------------------------------------
        // ここは数学的な予備知識のあるひと向けのオマケです。
        // ベクトルの内積や外積が何を表すものなのかがわかっていないと、ちょっと
        // 意味不明な可能性が大きいですので、仮に見ても意味がわからなかったとし
        // ても、落ち込まないように！
        // --------------------------------------------------------------------
        // 変換前と変換後のふたつのベクトルから外積で接線ベクトルを求める @@@
        let tangent = normalize3D(cross3D(prevDirection, starDirection));
        // 変換前と変換後のふたつのベクトルから内積でコサインを取り出す @@@
        let c = dot3D(prevDirection, starDirection);
        // コサインをラジアンに戻す @@@
        let r = Math.acos(c);
        // 求めた接線ベクトルとラジアンからクォータニオンを定義 @@@
        let q = new THREE.Quaternion();
        q.setFromAxisAngle(new THREE.Vector3(tangent[0], tangent[1], tangent[2]), r);
        // スターの現在のクォータニオンに乗算する @@@
        starCone.quaternion.premultiply(q);

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

    /**
     * 三次元ベクトルの内積を計算する
     * @param {Array} v0 - ひとつめのベクトル
     * @param {Array} v1 - ふたつめのベクトル
     * @return {float} 内積の結果
     */
    function dot3D(v0, v1){
        return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
    }

    /**
     * 三次元ベクトルの外積を計算する
     * @param {Array} v0 - ひとつめのベクトル
     * @param {Array} v1 - ふたつめのベクトル
     * @return {Array} 外積の結果
     */
    function cross3D(v0, v1){
        return [
            v0[1] * v1[2] - v0[2] * v1[1],
            v0[2] * v1[0] - v0[0] * v1[2],
            v0[0] * v1[1] - v0[1] * v1[0]
        ];
    }

})();

