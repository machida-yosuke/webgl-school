attribute vec3 position;
attribute vec3 normal;
uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
varying vec3 vPosition;
varying vec3 vNormal;

void main(){
   //モデル座標変換後のワールド空間場での頂点の位置 
    vPosition = (mMatrix * vec4(position, 1.0)).xyz;
    vNormal = normal;
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
