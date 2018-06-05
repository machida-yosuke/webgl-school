attribute vec3 position; // 頂点座標（要素数 3、つまりストライドが 3）
attribute vec4 color;    // 頂点カラー（要素数 4、つまりストライドが 4）
varying vec4 vColor;     // フラグメントシェーダへの転送用
void main(){
    // 頂点の色を varying 変数に格納
    // スクリーンを塗る（ピクセルを塗る）のはフラグメントシェーダなので
    // 頂点シェーダから値を渡してやらないと着色ができないため
    vColor = color;
    // gl_Position に頂点の座標を格納
    gl_Position = vec4(position, 1.0);
}

