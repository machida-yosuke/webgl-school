attribute vec3 position;
attribute vec3 normal; // 頂点法線 @@@
attribute vec4 color;
uniform mat4 mvpMatrix;
varying vec4 vColor;
void main(){
    // ここでは理解のために法線を色として出力してみる @@@
    vColor = color * vec4(normal, 1.0);
    gl_Position = mvpMatrix * vec4(position, 1.0);
}

