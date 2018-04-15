
// = 004 ======================================================================
// JavaScript では、キーの入力やマウスからの入力を、イベントという形で検出するこ
// とができます。
// ここでは、それらのいくつかのイベントを使って、シーンに干渉できるようにします。
// three.js では、オブジェクトが自身の position や rotation をプロパティ（属性）
// として持っており、それに値を設定することで干渉可能であることもポイントです。
// ============================================================================

(() => {
    window.addEventListener('load', () => {
        // 汎用変数の宣言
        let width = window.innerWidth;
        let height = window.innerHeight;
        let targetDOM = document.getElementById('webgl');

        let run = true; // 実行フラグ
        let scene;      // シーン
        let camera;     // カメラ
        let controls;   // カメラコントロール
        let renderer;   // レンダラ
        let geometry;   // ジオメトリ
        let material;   // マテリアル
        let box;        // ボックスメッシュ
        let axesHelper; // 軸ヘルパーメッシュ

        let isDown = false; // マウスボタンが押されているかどうか @@@

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

        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
        }, false);

        // - マウス関連イベントを追加する -------------------------------------
        // ここではマウスが動いたときに発火する mousemove と、マウスボタンが押下
        // されたとき、及びそれが離されたときに発火する mousedown, mouseup のそ
        // れぞれにイベントを登録しています。
        // ボタンの押下状態は、広いスコープで宣言した変数を参照することで、レン
        // ダリングに正しくその影響を反映させることができます。
        // --------------------------------------------------------------------
        // mousemove イベント @@@
        window.addEventListener('mousemove', (eve) => {
            // マウスカーソルの位置を元に横方向と縦方向の移動量を計算
            let horizontal = (eve.clientX / width - 0.5) * 2.0;
            let vertical   = -(eve.clientY / height - 0.5) * 2.0;
            // 求めた移動量をボックスの座標に反映
            box.position.x = horizontal;
            box.position.y = vertical;
        }, false);
        // mousedown イベント @@@
        window.addEventListener('mousedown', () => {
            // ボタンダウンでフラグを立てる
            isDown = true;
        }, false);
        // mouseup イベント @@@
        window.addEventListener('mouseup', () => {
            // ボタンを離したときにフラグを降ろす
            isDown = false;
        }, false);

        render();
        function render(){
            if(run){requestAnimationFrame(render);}

            // レンダリングループのなかではフラグに応じてボックスに回転を適用 @@@
            if(isDown === true){
                // Y 軸回転
                box.rotation.y += 0.02;
            }

            renderer.render(scene, camera);
        }
    }, false);
})();

