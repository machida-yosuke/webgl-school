
// = 011 ======================================================================
// サンプル 010 をベースに、宣言セクション、初期化セクション、そしてレンダリング
// 関数とを整理整頓したものがこのサンプル 011 です。
// canvas などの HTML ドキュメントに含まれるオブジェクトは、ページが完全にロード
// された状態になってから初期化する必要があるので、そのあたりを考慮しつつ全体的
// に整理したものです。
// 描画結果などはサンプル 010 と大差ないですが、初期化のタイミングやイベント設定
// のタイミングなどが極力ひとまとまりになるようにしてあります。
// 今後のサンプルのベースになる実装ですので、それぞれの処理がどのようにまとめら
// れているのか、しっかり確認しておきましょう。
// ============================================================================

(() => {
    // - 宣言セクション -------------------------------------------------------
    // この部分は、ブラウザのロードが完了する前の段階で呼び出されます。
    // ここでは、広い範囲で参照することになる変数や定数の宣言を行っておきます。
    // ただし、canvas のサイズの設定などはこの段階では行えないので、その点には十
    // 分に注意しましょう。
    // ------------------------------------------------------------------------
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

    // - 初期化セクション -----------------------------------------------------
    // window.onload から呼ばれる各種処理は、上記の宣言セクションで定義した変数
    // や定数を用いて、各種オブジェクトを初期化するためのフェーズです。
    // ここで最初の設定を漏れなく行っておき、あとはレンダリングを行うだけのとこ
    // ろまで一気に処理を進めます。
    // ここでは出てきていませんが、ファイルを読み込むなどの非同期処理も、このタ
    // イミングで実行しておきます。
    // ------------------------------------------------------------------------
    // entry point
    window.addEventListener('load', () => {
        // canvas
        canvasWidth  = window.innerWidth;
        canvasHeight = window.innerHeight;
        targetDOM    = document.getElementById('webgl');

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
        scene.add(box);
        // sphere
        geometry = new THREE.SphereGeometry(1.5, 16, 16);
        sphere = new THREE.Line(geometry, material);
        sphere.position.x = 2.0;
        sphere.position.z = -2.0;
        scene.add(sphere);
        // cone
        geometry = new THREE.ConeGeometry(1.0, 1.5, 32);
        cone = new THREE.Mesh(geometry, material);
        cone.position.x = -2.0;
        cone.position.z = 2.0;
        scene.add(cone);
        // torus
        geometry = new THREE.TorusGeometry(1.0, 0.4, 32, 32);
        torus = new THREE.Points(geometry, materialPoint);
        torus.position.x = -2.0;
        torus.position.z = -2.0;
        scene.add(torus);

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

    // - レンダリング処理 -----------------------------------------------------
    // 宣言セクションと初期化セクションで全ての準備が整っていれば、残すはレンダ
    // リングを行うことのみです。
    // このように、各処理を大雑把に「セクションとして分離」しておくことで、設定
    // しなければならない項目が膨大になる 3D プログラミングでも可読性の高い状態
    // を維持することができます。
    // もし、汎用的な処理などが今後追加されるとしても、このような大枠が決まって
    // さえいる状態を維持できていれば、メンテナンスや発展も行いやすくなります。
    // ------------------------------------------------------------------------
    // rendering
    function render(){
        if(run){requestAnimationFrame(render);}

        if(isDown === true){
            box.rotation.y    += 0.02;
            box.rotation.z    += 0.02;
            sphere.rotation.y += 0.02;
            sphere.rotation.z += 0.02;
            cone.rotation.y   += 0.02;
            cone.rotation.z   += 0.02;
            torus.rotation.y  += 0.02;
            torus.rotation.z  += 0.02;
        }

        renderer.render(scene, camera);
    }
})();

