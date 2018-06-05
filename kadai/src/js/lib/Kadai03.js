import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import GLTFLoader from 'three-gltf-loader';

// 参考　https://ryo620.org/blog/2018/02/threejs-animation/

export default class Kadai03 {
  constructor(opts) {
    this.canvas = opts.canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this._initHandler();
  }

  _createThree(){
    this._setCamera();
    this._setScene();
    this._setRender();
    this._setLight();
    this._setHelper();
    this._setOrbitcontrol();
  }

  _setCamera(){
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.width / this.height,
      0.1,
      100
    );

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 50;
    this.camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
  }

  _setScene(){
    this.scene = new THREE.Scene()
  }

  _setRender(){
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setClearColor(new THREE.Color(0x000000));
    this.canvas.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
    // gltfが初期でくらい
    this.renderer.gammaOutput = true;
  }

  _setLight(){
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
    this.directionalLight.position.x = 1.0
    this.directionalLight.position.y = 1.0
    this.directionalLight.position.z = 1.0
    this.scene.add(this.directionalLight)
  }

  _setHelper(){
    this.gridHelper = new THREE.GridHelper(200, 50);
    this.scene.add(this.gridHelper);

    this.axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(this.axesHelper);
  }

  _setOrbitcontrol(){
    const controlle = new OrbitControls(this.camera, this.renderer.domElement)
  }

  _setContents(){
    this._setLoader();
    this._createEarth();
    // this._createEarthMoon();
  }

  _setLoader(){
    const gltfLoader = new GLTFLoader();
    const url = '../model/untitled.gltf'
    gltfLoader.load(url, (data) => {
      const gltf = data;
      this.satellite = gltf.scene;
      this.scene.add(this.satellite);
      this._render()
    });

    const earthLoader = new THREE.TextureLoader()
    const moonLoader = new THREE.TextureLoader()
    this.earthTexture = earthLoader.load('../img/earth.jpg', ()=>{
      this.moonTexture = moonLoader.load('../img/moon.jpg', ()=>{
        console.log(earthLoader, moonLoader);
      });
    })

  }

  _createEarth(){
    const geometry = new THREE.SphereGeometry(10, 50, 50);
    const material = new THREE.MeshLambertMaterial()
    material.map = this.earthTexture
    this.earth = new THREE.Mesh(geometry, material)
    this.scene.add(this.earth)
  }

  _render(){
    requestAnimationFrame(() => {
      this._render()
    });
    this.satellite.rotation.z += 0.01
    this.renderer.render(this.scene, this.camera);
  }

  _windowResize(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.renderer.render(this.scene, this.camera)
  }

  _initHandler(){
    this._createThree();
    this._windowResize();
    this._setContents()
    window.addEventListener('resize', ()=>{
      this._windowResize();
    })
  }
}
