import * as THREE from 'three';
import dat from 'dat.gui'

export default class Kadai01 {
  constructor (opts = {}) {
    this.canvas = opts.canvas;
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.gui = new dat.GUI();
    this.CAMERA_PARAM = {
      fovy: 60,
      near: 10,
      far: 30.0,
      x: 0.0,
      y: 0.0,
      z: 15.0,
    }
    this.scene = new THREE.Scene()
    this.isRender = true
    this.boxes = []
    this._initHandler()
    this.gui.add(this.CAMERA_PARAM,'z', 5, 10).onChange(()=>{
      this._chageParam();
    })
  }

  _resizeCanvas(){
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect= this.width / this.height
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }

  _initHandler(){
    this.camera = new THREE.PerspectiveCamera(
      this.CAMERA_PARAM.fovy,
      this.width / this.height,
      this.CAMERA_PARAM.near,
      this.CAMERA_PARAM.far
    )

    this.camera.position.x = this.CAMERA_PARAM.x
    this.camera.position.y = this.CAMERA_PARAM.y
    this.camera.position.z = this.CAMERA_PARAM.z
    this.camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0))

    this.renderer = new THREE.WebGLRenderer({ antialias: true});
    this.renderer.setClearColor(new THREE.Color(0xffffff))
    this._resizeCanvas()

    const gridHelper = new THREE.GridHelper(200, 50);
    this.scene.add(gridHelper);
    const AxesHelper = new THREE.AxesHelper(1000);  // 引数は 軸のサイズ
    this.scene.add(AxesHelper);
    for (let i = 0; i < 100; i++) {
      const positionX = i % 10
      const positionY = Math.floor(i / 10)
      const offsetX = 4.5;
      const offsetY = 4.5;
      this._createBox(positionX - offsetX, positionY - offsetY )
    }

    this.canvas.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);

    window.addEventListener('mousedown', (eve) => {
      this.isRender = true;
      this._render()
    }, false);

    window.addEventListener('mouseup', (eve) => {
      this.isRender = false;
    }, false);

    window.addEventListener('resize', () =>{
      this._resizeCanvas()
    }, false)
  }

  _createBox(x,y){
    const geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff9933
    })
    const box = new THREE.Mesh(geometry, material)
    box.position.x = x
    box.position.y = y
    this.boxes.push(box)
    this.scene.add(box)
  }

  _render(){
    if (this.isRender === false) return
    this.boxes.forEach((box) => {
      console.log(box.position.y);
      box.rotation.x += 0.01
      box.rotation.y += 0.01
      box.rotation.z += 0.01
    })
    requestAnimationFrame(()=>{
      this._render()
    })
    this.renderer.render(this.scene, this.camera);
  }

  _chageParam(){
    this.camera.position.z = this.CAMERA_PARAM.z
  }
};
