export default class Kadai04 {
  constructor(opts) {
    this.position = [
      0.0,  0.5,  0.0,
      0.5,  0.1,  0.0,
     -0.5,  0.1,  0.0,
      0.3, -0.5,  0.0,
     -0.3, -0.5,  0.0
    ];
    // 頂点の色データ
    this.color = [
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      0.0, 0.0, 0.0, 1.0
    ];
    this.index = [
      0, 1, 2,
      2, 1, 3,
      2, 3, 4
    ];

    this.canvas = opts.canvas;
    gl3.init(this.canvas);
    if(!gl3.ready){
      console.log('initialize error');
      return;
    }
    this.canvasSize = Math.min(window.innerWidth, window.innerHeight);
    this.canvas.width  = this.canvasSize;
    this.canvas.height = this.canvasSize;
    this.loadShader();
  }

  loadShader(){
    this.prg = gl3.createProgramFromFile(
      './js/shader/kadai04.vert',
      './js/shader/kadai04.frag',
      ['position', 'color'],
      [3, 4],
      ['globalColor'],
      ['4fv'],
      () => {this.initialize()}
    )
  }

  initialize () {
    console.log('this.prg', this.prg);
    this.VBO = [
      gl3.createVbo(this.position),
      gl3.createVbo(this.color)
    ]

    this.IBO = [
      gl3.createIbo(this.index)
    ]
    this.render()
  }

  render () {
    gl3.sceneView(0, 0, this.canvasSize, this.canvasSize);
    gl3.sceneClear([0.7, 0.7, 0.7, 1.0]);
    this.prg.useProgram();
    console.log(this.VBO, this.IBO);
    this.prg.setAttribute(this.VBO, this.IBO)

    this.prg.pushShader([
      [1.0, 1.0, 1.0, 1.0]
    ])
    gl3.drawElements(gl3.gl.TRIANGLES, this.index.length)
  }
}
