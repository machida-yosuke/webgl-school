import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import GLTFLoader from 'three-gltf-loader';
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'


// 参考　https://ryo620.org/blog/2018/02/threejs-animation/

export default class Kadai03 {
  constructor(opts) {
    this.canvas = opts.canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.renderFlag = false;
    this.moonGroup = new THREE.Group()
    this.satelliteGrop = new THREE.Group()
    this._initHandler();
  }

  _createThree(){
    this._setCamera();
    this._setScene();
    this._setRender();
    this._setLight();
    this._setHelper();
    this._setOrbitcontrol();
    this._setLoader();
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
    this.scene.fog = new THREE.Fog(0x000000, 0.1, 80)
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
    this._createEarth();
    this._createMoon();
    this.startTime = Date.now()
    this._render()
  }

  _setLoader(){
    const gltfLoader = new GLTFLoader();
    const url = '../model/untitled.gltf'
    gltfLoader.load(url, (data) => {
      const gltf = data;
      this.satellite = gltf.scene;
      this.satelliteGrop.add(this.satellite);
      this.satellite.scale.set(0.1,0.1,0.1);
      this.moonGroup.add(this.satelliteGrop)
      this._setContents()
    });

    const earthLoader = new THREE.TextureLoader()
    const moonLoader = new THREE.TextureLoader()
    this.earthTexture = earthLoader.load('../img/earth.jpg', ()=>{
      this.moonTexture = moonLoader.load('../img/moon2.jpg', ()=>{
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

  _createMoon(){
    const geometry = new THREE.SphereGeometry(10, 50, 50)
    const material = new THREE.MeshLambertMaterial()
    material.map = this.moonTexture;
    this.moon = new THREE.Mesh(geometry, material)
    this.moonGroup.add(this.moon)
    this.moon.scale.set(0.25, 0.25, 0.25)
    this.scene.add(this.moonGroup);
  }

  _render(){
    requestAnimationFrame(() => {
      this._render()
    });
    if (!this.renderFlag) return;
    this.nowTime = Date.now() - this.startTime;
    this.nowTime /= 2000;
    this.rad = this.nowTime % (Math.PI * 2.0);
    this.sin = Math.sin(this.rad)
    this.cos = Math.cos(this.rad)

    // this.moon.position.x = this.sin * 20;
    // this.moon.position.z = this.cos * 20;
    // this.moon.rotation.y = this.rad;
    this.moon.position.set(this.nVector[0] * 10, 0.0, this.nVector[1] * 10)

    // this.moonGroup.position.x = 20;

    this.satelliteGrop.position.x = this.moon.position.x;
    this.satelliteGrop.position.y = this.moon.position.y;
    this.satelliteGrop.position.z = this.moon.position.z;

    this.satellite.position.x = -this.sin * 5;
    this.satellite.position.z = this.cos * 5;
    this.satellite.position.y = this.cos * 5;
    this.satellite.rotation.z += 0.001

    this.earth.rotation.y += 0.001
    this.moon.rotation.y += 0.001

    // this.camera.position.z = this.moon.position.z + 50
    // this.camera.position.x = this.moon.position.x
    this.renderer.render(this.scene, this.camera);
  }

  _windowResize(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
  }

  _normalize2D(vec){
    const len = this._calcLength2D(vec)
    this.renderFlag = true;
    return [vec[0] / len, vec[1] / len,]
  }

  _calcLength2D(vec){
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1])
  }

  _initHandler(){
    this._createThree();
    this._windowResize();
    window.addEventListener('resize', ()=>{
      this._windowResize();
    })
    window.addEventListener('mousemove', (e)=>{
      this.screenX = e.clientX - this.width / 2;
      this.screenY = e.clientY - this.height / 2;
      this.nVector = this._normalize2D([this.screenX, this.screenY])
    })
  }
}
