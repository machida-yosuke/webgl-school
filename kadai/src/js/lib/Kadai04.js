export default class Kadai04 {
    constructor(opts) {
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
        gl3.sceneView(0, 0, this.canvasSize, this.canvasSize);
        gl3.sceneClear([0.7, 0.7, 0.7, 1.0]);
    }
}
