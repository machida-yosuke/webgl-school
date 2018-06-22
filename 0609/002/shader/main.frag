precision mediump float;
varying vec3 vColor; // 頂点シェーダから転送されてきた色
void main(){
    // gl_FragColor に出力する色を指定
    // gl_FragColor = vec4(vColor, 1.0);
    vec3 rgb = vColor * 0.5;
    gl_FragColor = vec4(rgb, 1.0);
}
