
// = 003 ======================================================================
// three.js には、情報を可視化するためのヘルパーと呼ばれる補助機能があります。
// これは主に開発中に、実装を行う上での補助を行ってくれる機能で、リリースする前
// の段階でヘルパーは削除（もしくは非表示に）するのが前提になります。
// サンプルでは、わかりやすさを重視してヘルパーを使っていきましょう。
// ============================================================================

(() => {
    window.addEventListener('load', () => {
        // 汎用変数の宣言
        let width = window.innerWidth;   // ブラウザのクライアント領域の幅
        let height = window.innerHeight; // ブラウザのクライアント領域の高さ
        let targetDOM = document.getElementById('webgl'); // スクリーンとして使う DOM

        let run = true; // 実行フラグ
        let scene;      // シーン
        let camera;     // カメラ
        let controls;   // カメラコントロール
        let renderer;   // レンダラ
        let geometry;   // ジオメトリ
        let material;   // マテリアル
        let box;        // ボックスメッシュ
        let axesHelper; // 軸ヘルパーメッシュ @@@

        const CAMERA_PARAM = { // カメラに関するパラメータ
            fovy: 60,
            aspect: width / height,
            near: 0.1,
            far: 10.0,
            x: 0.0,
            y: 2.0,
            z: 5.0,
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
        };
        const RENDERER_PARAM = { // レンダラに関するパラメータ
            clearColor: 0x333333,
            width: width,
            height: height
        };
        const MATERIAL_PARAM = { // マテリアルに関するパラメータ
            color: 0xff9933
        };

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            CAMERA_PARAM.fovy,
            CAMERA_PARAM.aspect,
            CAMERA_PARAM.near,
            CAMERA_PARAM.far
        );
        camera.position.x = CAMERA_PARAM.x;
        camera.position.y = CAMERA_PARAM.y;
        camera.position.z = CAMERA_PARAM.z;
        camera.lookAt(CAMERA_PARAM.lookAt);

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height);
        targetDOM.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        material = new THREE.MeshBasicMaterial(MATERIAL_PARAM);
        box = new THREE.Mesh(geometry, material);
        scene.add(box);

        // - 軸ヘルパーを追加する ---------------------------------------------
        // axis とは、3D 用語としては軸を表します。
        // X 軸なら、横方向に伸びる軸のこと。同様に Y なら縦方向、Z なら前後に伸
        // びる軸のことをいいます。AxisHelper では、XYZ の各軸を手間なく簡単に、
        // シーンに追加することができます。
        // --------------------------------------------------------------------
        // axesHelper @@@
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);

        // rendering
        render();
        function render(){
            if(run){requestAnimationFrame(render);}
            renderer.render(scene, camera);
        }
    }, false);
})();

