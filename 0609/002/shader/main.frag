precision mediump float;
varying vec4 vColor; // 頂点シェーダから転送されてきた色
void main(){
    // gl_FragColor に出力する色を指定
    gl_FragColor = vColor;
}

