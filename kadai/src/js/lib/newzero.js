import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'
import dat from 'dat.gui';

const GREEN = '#caea77';
const BLACK = '#656b69';
const WHITE = '#ecece9';

export default class NewZero {
  constructor (opts = {}) {
    this.canvas = opts.canvas;
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.gui = new dat.GUI();
    this.CAMERA_PARAM = {
      fovy: 60,
      near: 0.1,
      far: 100.0,
      x: 0.0,
      y: 0.0,
      z: 5.0,
    }
    this.scene = new THREE.Scene()
    this.isRender = false
    this.circles = []
    this._initHandler()
    // this.gui.add(this.CAMERA_PARAM,'z', 10, 30).onChange(()=>{
    //   this._chageParam();
    // })
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
    const AxesHelper = new THREE.AxesHelper(1000);
    this.scene.add(AxesHelper);

    for (let i = 0; i < 30; i++) {
      const offset = i / 50
      console.log(offset);
      let color = GREEN;
      if (i === 25) color = BLACK
      if (i === 24) color = WHITE
      if (i === 23) color = WHITE
      // this._createCircle(0.5 + (offset * 2), 0.52 + (offset * 2), 0, 360, 360, 0.1, color)
      this._createCircle(0.5 + (offset * 2), 0.52 + (offset * 2), 0, 360, 10, 0.1, color)
    }

    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        1.0
    );
    directionalLight.position.set(100, 100, 100);
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xa0a0a0);
    this.scene.add(ambientLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.canvas.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);

    window.addEventListener('click', (eve) => {
      if (this.isRender) return ;
      this.isRender = true;
      this._render()
    }, false);

    window.addEventListener('keydown', (eve) => {
      if (eve.key === 'Escape') {
        this.isRender = false;
      }
    }, false);

    window.addEventListener('resize', () =>{
      this._resizeCanvas()
    }, false)
  }

  _render(){
    if (this.isRender === false) return
    this.circles.forEach((circle, index) => {
      const speedOffset = index / 10000
      circle.rotation.x += 0.05 + speedOffset
      circle.rotation.y += 0.05 + speedOffset
    })
    requestAnimationFrame(()=>{
      this._render()
    })
    this.renderer.render(this.scene, this.camera);
  }

  _createCircle(innerRadius, outerRadius, startAngle, endAngle, segments, thickness, color) {
    var shape = new THREE.Shape();
    let i, x, y;
    if ( outerRadius > 0 ) {
      for(i = startAngle; i <= endAngle; i += (360/segments)) {
        x = outerRadius * Math.sin(2*Math.PI*i/360);
        y = outerRadius * Math.cos(2*Math.PI*i/360);
        if ( i === startAngle) {
          shape.moveTo(x, y);
        }
        shape.lineTo(x, y);
      }
    }
    if ( innerRadius > 0 ) {
      for(i = endAngle; i >= startAngle; i -= (360/segments)) {
        x = innerRadius * Math.sin(2*Math.PI*i/360);
        y = innerRadius * Math.cos(2*Math.PI*i/360);
        shape.lineTo(x, y);
      }
    }

    const parameters = {
      amount: thickness,
      bevelEnabled: false,
      bevelSegments: 10,
      bevelThickness: 5,
      bevelSize: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, parameters);
    const material = new THREE.MeshLambertMaterial({
      color: color
    });
    const cylinder = new THREE.Mesh(geometry, material);
    this.circles.push(cylinder)
    this.scene.add(cylinder)
  }
};
