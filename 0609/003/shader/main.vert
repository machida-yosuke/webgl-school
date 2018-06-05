attribute vec3 position;
attribute vec4 color;
uniform vec4 globalColor; // uniform 変数 @@@
varying vec4 vColor;
void main(){
    // varying には頂点カラーとグローバルカラーを乗算した結果を格納
    vColor = color * globalColor;
    gl_Position = vec4(position, 1.0);
}

