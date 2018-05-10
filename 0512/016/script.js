
// = 016 ======================================================================
// これまで、three.js のビルトインのジオメトリを使ってボックスや球体を描いていま
// したが、three.js では既定の形をなにも持たない、素体のジオメトリを定義すること
// もできます。
// この素体のジオメトリには、任意の頂点を追加することができますので、その仕組み
// を利用してここではパーティクルをたくさん描く実装を作ってみましょう。
// ※ここまでのサンプルをベースに不要なオブジェクトは削除した形になっています
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
    let geometry;
    let materialPoint;
    let axesHelper;
    // constant variables
    const RENDERER_PARAM = {
        clearColor: 0
    };
    const MATERIAL_PARAM_POINT = {
        color: 0xffffff,      // 頂点の色
        size: 0.1,            // 頂点の基本となるサイズ
        sizeAttenuation: true // 遠近感を出すかどうかの真偽値 @@@
    };

    // entry point
    window.addEventListener('load', () => {
        // canvas
        canvasWidth  = window.innerWidth;
        canvasHeight = window.innerHeight;
        targetDOM    = document.getElementById('webgl');

        // camera
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0.0;
        camera.position.y = 3.0;
        camera.position.z = 10.0;
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        // scene
        scene = new THREE.Scene();

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(canvasWidth, canvasHeight);
        targetDOM.appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // material
        materialPoint = new THREE.PointsMaterial(MATERIAL_PARAM_POINT);

        // - パーティクルを定義する -------------------------------------------
        // ここで素体のジオメトリオブジェクトに対して、頂点を次々と定義して設定
        // しています。
        // ループ構造は一見複雑に見えるかもしれませんが、X と Y のふたつの要素を
        // 一気に繰り返し処理で定義しているだけで、均等間隔で頂点が並ぶようにし
        // ているだけですので、落ち着いてコードを読み解きましょう。
        // --------------------------------------------------------------------
        // particle @@@
        const COUNT = 10;  // パーティクルの行と列のカウント数
        const SIZE = 10.0; // どの程度の範囲に配置するかのサイズ
        geometry = new THREE.Geometry(); // 特定の形状を持たない素体ジオメトリ
        for(let i = 0; i <= COUNT; ++i){
            // カウンタ変数 i から X 座標を算出
            let x = (i / COUNT - 0.5) * SIZE;
            for(let j = 0; j <= COUNT; ++j){
                // カウンタ変数 j から Y 座標を算出
                let y = (j / COUNT - 0.5) * SIZE;
                // 求めた XY 座標をパーティクル（頂点）の位置を定義
                let point = new THREE.Vector3(x, y, 0.0);
                // 素体ジオメトリに頂点を加える
                geometry.vertices.push(point);
            }
        }
        // パーティクルを格納したジオメトリとマテリアルからポイントオブジェクトを生成
        let particle = new THREE.Points(geometry, materialPoint);
        // シーンにパーティクルを追加
        scene.add(particle);

        // helper
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        // events
        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        // rendering
        render();
    }, false);

    // rendering
    function render(){
        if(run){requestAnimationFrame(render);}
        renderer.render(scene, camera);
    }
})();

