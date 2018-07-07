attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec3 randomValue; // ランダム座標 @@@
uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform float time; // 時間の経過を追加 @@@
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main(){
    // 奥行きと時間に応じたサイン波を作る @@@
    float s = sin(randomValue.z + time * 0.5) * 0.5;
    // ランダム座標を頂点に足し込む @@@
    vec3 p = position + randomValue + vec3(0.0, s, 0.0);
    vPosition = (mMatrix * vec4(p, 1.0)).xyz;
    vNormal = normal;
    vColor = color;
    gl_Position = mvpMatrix * vec4(p, 1.0);
}

