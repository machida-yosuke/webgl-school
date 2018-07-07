attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;
uniform bool edge; // エッジフラグ @@@
varying vec3 vNormal;
varying vec4 vColor;

void main(){
    vColor = color;
    vNormal = (normalMatrix * vec4(normal, 0.0)).xyz;
    // 頂点の座標
    vec3 p = position;
    if(edge == true){
        // エッジフラグが true の場合は法線方向に頂点をふくらませる @@@
        // 法線ベクトルの長さは常に１なので　* 0.01する;
        // 裏面が見えてるので若干破綻してる
        // 太くぎすぎないほうがいい
        p += normal * 0.01;
    }
    gl_Position = mvpMatrix * vec4(p, 1.0);
}
