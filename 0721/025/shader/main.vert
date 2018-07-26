attribute vec3 position;
attribute vec4 color;
uniform mat4  mvpMatrix;
uniform mat4 mMatrix;
uniform float pointSize; // ポイントサイズ @@@
varying vec4 vColor;

void main(){
    vColor = color;
    gl_Position = mvpMatrix * vec4(position, 1.0);
    // vec4 p = mMatrix * vec4(position, 1.0);
    // もでる座標変換はワールド座標変換
    // もでる座標変換の頂点の座標をみて
    // それに応じて大きさをかえる
    // 頂点のポイントサイズを指定 @@@
    // float f =(p.z + 5.0);
    gl_PointSize = pointSize;
}
