import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

const CAMERA_PARAM ={
  fovy: 60,
  naer: 0.1,
  far: 1000,
}

export default class Kadai02 {
  constructor(opts = {}) {
    this.canvas = opts.canvas
    this.width = this.canvas.offsetWidth
    this.height = this.canvas.offsetHeight
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.time = new Date();
    this._initHandler()
  }

  _createThree(){
    this._createCamera()
    this._createScene()
    this._createRender()
    this._createLight()
    this._createHelper()
    this._createOrbitcontrol()
  }

  _createCamera(){
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_PARAM.fovy,
      this.width / this.height,
      CAMERA_PARAM.near,
      CAMERA_PARAM.far
    )
    this.camera.position.x = 0
    this.camera.position.y = 50
    this.camera.position.z = 0
    this.camera.rotation.z = 90
    this.camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0))
  }

  _createScene(){
    this.scene = new THREE.Scene()
  }

  _createRender(){
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setClearColor(new THREE.Color(0xffffff))
    this.canvas.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
  }

  _createLight(){
    this.directionalLight = new THREE.DirectionalLight(
      0xffffff,
      1.0
    )
    this.directionalLight.position.x = 1.0
    this.directionalLight.position.y = 1.0
    this.directionalLight.position.z = 1.0
    this.scene.add(this.directionalLight)
  }

  _createHelper(){
    const gridHelper = new THREE.GridHelper(200, 50);
    this.scene.add(gridHelper)
    const AxesHelper = new THREE.AxesHelper(1000)
    this.scene.add(AxesHelper)
  }

  _createOrbitcontrol(){
    const control = new OrbitControls(this.camera, this.renderer.domElement)
  }

  _render(){
    requestAnimationFrame(()=>{
      this._render()
    })
    this.time = new Date();
    this.hour.rotation.y = this._calcDo(-30 * this.time.getHours())
    this.minute.rotation.y = this._calcDo(-6 * this.time.getMinutes())
    this.seconds.rotation.y = this._calcDo(-6 * this.time.getSeconds())
    this.renderer.render(this.scene, this.camera);
  }

  _calcDo(angle){
    return Math.PI * angle / 180;
  }

  _createClock(){
    this.hour = new THREE.Group()
    const hourGeometry = new THREE.BoxGeometry(1.0, 1.0, 10.0)
    const hourMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff})
    const hour = new THREE.Mesh(hourGeometry, hourMaterial)
    hour.position.z = -10.0 * 0.5
    this.hour.add(hour)
    this.scene.add(this.hour)

    this.minute = new THREE.Group()
    const minuteGeometry = new THREE.BoxGeometry(1.0, 1.0, 15.0)
    const minuteMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff})
    const minute = new THREE.Mesh(minuteGeometry, minuteMaterial)
    minute.position.z = -15.0 * 0.5
    this.minute.add(minute)
    this.scene.add(this.minute)

    this.seconds = new THREE.Group()
    const secondsGeometry = new THREE.BoxGeometry(1.0, 1.0, 20.0)
    const secondsMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff})
    const seconds = new THREE.Mesh(secondsGeometry, secondsMaterial)
    seconds.position.z = -20.0 * 0.5
    this.seconds.add(seconds)
    this.scene.add(this.seconds)
  }

  _generateCmaraParam(scale){
    const aspect = this.width / this.height
    return {
      aspect : aspect,
      left : -aspect * scale,
      right : aspect * scale,
      top : scale,
      bottom : -scale
    }
  }

  _resizeCanvas(){
    this.width = this.canvas.offsetWidth
    this.height = this.canvas.offsetHeight
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect= this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
  }

  _initHandler () {
    this._createThree()
    this._resizeCanvas()
    this._createClock()
    this._render()
    window.addEventListener('resize', () => {
      this._resizeCanvas()
    })
  }
}
