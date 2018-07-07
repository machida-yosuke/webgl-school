attribute vec3 position;　//ローカル座標系なんで平行移動とか回転とか一切していない素の頂点
attribute vec3 normal;
attribute vec4 color;
uniform mat4 mMatrix; //モデル座標
uniform mat4 mvpMatrix; //別次元の値があたくさん入ってる
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main(){
    // モデル変換語の頂点の位置
    // なぜ渡すのか
    // モデル座標変換語の頂点の位置こそがワールド座標系での頂点の位置
    vPosition = (mMatrix * vec4(position, 1.0)).xyz;
    vNormal = normal;
    vColor = color;
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
