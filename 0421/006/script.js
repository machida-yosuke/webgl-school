
// = 006 ======================================================================
// 005 でディレクショナルライトを用いて、平行光源でライティングを行いました。
// しかしこのときの描画結果を見てみると、暗い場所（光の当たりにくい箇所）が、異
// 様なくらい真っ黒になっています。
// これは現実世界とは違い、あくまでもロジカルに光を再現する 3DCG ならではの現象
// と言えます。光が一切当たらないのだから計算上は真っ黒になってしまう、というこ
// とですね。
// これを解消するには、やはりロジカルに、それっぽく見えるように（黒くならないよ
// うに）処理を行なってやることになります。
// 今回は、異なるライトの種類としてアンビエントライトを追加し、質感向上に挑戦し
// てみましょう。
// ============================================================================

(() => {
    window.addEventListener('load', () => {
        // 汎用変数の宣言
        let width = window.innerWidth;
        let height = window.innerHeight;
        let targetDOM = document.getElementById('webgl');

        let run = true;       // 実行フラグ
        let scene;            // シーン
        let camera;           // カメラ
        let controls;         // カメラコントロール
        let renderer;         // レンダラ
        let geometry;         // ジオメトリ
        let material;         // マテリアル
        let box;              // ボックスメッシュ
        let directionalLight; // ディレクショナルライト（平行光源）
        let ambientLight;     // アンビエントライト（環境光） @@@
        let axesHelper;       // 軸ヘルパーメッシュ
        let isDown = false;   // マウスボタンが押されているかどうか

        const CAMERA_PARAM = {
            fovy: 60,
            aspect: width / height,
            near: 0.1,
            far: 10.0,
            x: 0.0,
            y: 2.0,
            z: 5.0,
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
        };
        const RENDERER_PARAM = {
            clearColor: 0x333333,
            width: width,
            height: height
        };
        const MATERIAL_PARAM = {
            color: 0xff9933
        };
        const DIRECTIONAL_LIGHT_PARAM = {
            color: 0xffffff,
            intensity: 1.0,
            x: 1.0,
            y: 1.0,
            z: 1.0
        };
        // アンビエントライトに関するパラメータの定義 @@@
        const AMBIENT_LIGHT_PARAM = {
            color: 0xffffff,
            intensity: 0.2
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
        material = new THREE.MeshLambertMaterial(MATERIAL_PARAM);
        box = new THREE.Mesh(geometry, material);
        scene.add(box);

        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);

        // - 環境光、つまりアンビエントライトを追加する -----------------------
        // アンビエントライトは日本語ではよく環境光という言い方をされます。
        // その名前からもわかるとおり、このライトは環境全体が持つ複雑な光の反射
        // や屈折を再現するためのライトです。
        // 初期化の方法は基本的にディレクショナルライトのときと同じです。
        // 第二引数には強さを指定することができますが、まず最初は小さめの値で試
        // してみましょう。
        // --------------------------------------------------------------------
        // initialize light @@@
        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);

        window.addEventListener('mousemove', (eve) => {
            let horizontal = (eve.clientX / width - 0.5) * 2.0;
            let vertical   = -(eve.clientY / height - 0.5) * 2.0;
            box.position.x = horizontal;
            box.position.y = vertical;
        }, false);
        window.addEventListener('mousedown', () => {
            isDown = true;
        }, false);
        window.addEventListener('mouseup', () => {
            isDown = false;
        }, false);

        render();
        function render(){
            if(run){requestAnimationFrame(render);}

            if(isDown === true){
                box.rotation.y += 0.02;
            }

            renderer.render(scene, camera);
        }
    }, false);
})();

