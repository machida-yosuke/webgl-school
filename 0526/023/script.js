
// = 023 ======================================================================
// 三角関数の基本を押さえたら、次に取り組むべきはベクトルです。
// まずは手始めに、マウスカーソルの座標を取得し、そこからベクトルの概念を活用し
// て月がインタラクティブに動くようにしてみましょう。
// ここでは、ベクトルの正規化が登場しますが、落ち着いて考えればきっと理解できま
// す。XY のふたつの要素を含む二次元ベクトルを正規化し、それを元に月の座標を変化
// させます。
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

        // - マウスカーソルの動きを監視するイベントを設定 ---------------------
        // マウスカーソルが動いたことを検出するには mousemove イベントを使います。
        // イベント発火時に呼ばれる関数には、マウスに関する情報を持ったイベント
        // オブジェクトが渡されてくるので、そこからカーソルの位置などを取得して
        // 計算します。
        // --------------------------------------------------------------------
        // マウスムーブイベントを設定する @@@
        window.addEventListener('mousemove', (eve) => {
            // - オブジェクトが未初期化であることも考慮する -------------------
            // このサンプルでは画像を使って非同期処理を行っているので、ページが
            // 読み込まれた瞬間には、まだ init が呼ばれておらず、各種変数が初期
            // 化されていない可能性があります。
            // カーソルが動いたときにエラーが起こらないように、最初に if 文で確
            // 認するようになっているのはそのためです。
            // ----------------------------------------------------------------
            if(moonSphere == null){return;}

            // - ウィンドウの幅と高さを用いてスクリーン座標を変換する ---------
            // ブラウザのウィンドウ内は、いわゆるスクリーン座標系です。
            // このスクリーン座標系は、原点がブラウザのクライアント領域の左上に
            // なっています。右に行けば行くほどプラス、下に行けば行くほどプラス
            // になる座標系ですね。
            // 3D に限りませんが、このようなスクリーン座標系で取得できるマウスカ
            // ーソルの値は、そのままでは使いにくい場合があります。
            // 今回も、まずはカーソルの座標をスクリーンの中心を原点とした座標系
            // へ変換しています。
            // 単純計算なので、図を描くなどして落ち着いて考えよう！
            // ----------------------------------------------------------------
            // スクリーンの中心が原点となるように変換する @@@
            let w = window.innerWidth;     // スクリーン空間の幅
            let h = window.innerHeight;    // スクリーン空間の高さ
            let x = eve.clientX - w / 2.0; // マウス座標からスクリーンの幅の半分を引く
            let y = eve.clientY - h / 2.0; // マウス座標からスクリーンの高さの半分を引く

            // 得られた中心原点の座標（二次元ベクトル）を正規化する @@@
            let nVector = normalize2D([x, y]);
            console.log(nVector);
            // このときは長さが１のベクターになってる
            // 方角のみになってる
            // 月の位置が雨後ない理由はベクトルが向きしか考えてないから
            // 正規化したベクトルを元に月の座標を設定する @@@
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

        // geometry
        geometry = new THREE.SphereGeometry(1.0, 64, 64);
        earthSphere = new THREE.Mesh(geometry, earthMaterial);
        scene.add(earthSphere);
        moonSphere = new THREE.Mesh(geometry, moonMaterial);

        // move mesh
        moonSphere.scale.set(0.36, 0.36, 0.36);
        moonSphere.position.set(2.75, 0.0, 0.0);
        scene.add(moonSphere);

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

        renderer.render(scene, camera);
    }

    /**
     * 二次元ベクトルを正規化する
     * @param {Array} vec - 正規化したい二次元ベクトル
     * @return {Array} 正規化した二次元ベクトル
     */
    function normalize2D(vec){
        let length = calcLength2D(vec);
        console.log('length', length);
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

})();
