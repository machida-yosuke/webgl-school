
// = 017 ======================================================================
// ここではサンプル 016 をベースにしつつ、乱数を使った処理を行っています。
// 乱数の概念は、WebGL に限らずグラフィックスプログラミングでは非常に重要なもの
// のひとつです。JavaScript の場合は Math.random を用いれば乱数を簡単に生成する
// ことができますので、ここでその使い方をしっかり覚えておきましょう。
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
    let particle;
    // constant variables
    const RENDERER_PARAM = {
        clearColor: 0
    };
    const MATERIAL_PARAM_POINT = {
        color: 0x3399ff,
        size: 0.1,
        sizeAttenuation: true
    };

    // entry point
    window.addEventListener('load', () => {
        // canvas
        canvasWidth  = window.innerWidth;
        canvasHeight = window.innerHeight;
        targetDOM    = document.getElementById('webgl');

        // camera
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 100.0);
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
        // サンプル 016 のときは、ループ構造を使って点が規則正しく整列するように
        // していましたが、ここでは乱数を使ってバラバラに頂点を配置しています。
        // このようなランダムな頂点の配置は手軽な割に、見た目が非常に美しくなる
        // ので、これをベースにオリジナルの工夫を凝らしてみるのもいいかもしれま
        // せん。
        // --------------------------------------------------------------------
        // particle @@@
        const COUNT = 10000; // パーティクルの純粋な個数
        const SIZE = 20.0;   // どの程度の範囲に配置するかのサイズ
        geometry = new THREE.Geometry();
        for(let i = 0; i <= COUNT; ++i){
            // 乱数を使ってパーティクルをランダムに配置
            let x = (Math.random() - 0.5) * 2.0 * SIZE;
            let y = (Math.random() - 0.5) * 2.0 * SIZE;
            let z = (Math.random() - 0.5) * 2.0 * SIZE;
            let point = new THREE.Vector3(x, y, z);
            geometry.vertices.push(point);
        }
        particle = new THREE.Points(geometry, materialPoint);
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
        particle.rotation.x += 0.00125;
        particle.rotation.y += 0.00375;
        renderer.render(scene, camera);
    }
})();

