
// = 018 ======================================================================
// パーティクルを飛ばしていると、もっと半透明にしたり加算合成でキラキラさせたい
// と考えるが人のサガです。
// ここでは、よくパーティクル演出で用いられる設定項目について確認しておきましょ
// う。基本になっているコードは同じですが、パラメータの設定や、その値が少しだけ
// サンプル 017 とは異なっています。
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
    // マテリアルに設定項目を追加する @@@
    const MATERIAL_PARAM_POINT = {
        color: 0x66ffcc,                  // 色
        opacity: 0.5,                     // 不透明度
        transparent: true,                // 透明度を有効化するかどうか
        blending: THREE.AdditiveBlending, // 加算合成モードで色を混ぜる
        size: 1,                       // パーティクルの大きさ
        sizeAttenuation: true,            // 遠近感を持たせるかどうか
        depthWrite: true                 // 深度テストを行うかどうか
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

        // particle
        const COUNT = 10000;
        const SIZE = 20.0;
        geometry = new THREE.Geometry();
        for(let i = 0; i <= COUNT; ++i){
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
        particle.rotation.x += 0.00025;
        particle.rotation.y += 0.00075;
        renderer.render(scene, camera);
    }
})();
