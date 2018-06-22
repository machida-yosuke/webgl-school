attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
uniform mat4 mvpMatrix;
uniform mat4 normalMatrix; // 法線変換行列 @@@
varying vec4 vColor;

// 平行光源（ディレクショナルライト）のライトベクトル
const vec3 light = normalize(vec3(1.0));

void main(){
    // 法線を行列で変換する @@@
    vec3 n = (normalMatrix * vec4(normal, 0.0)).xyz;
    // ベクトルの内積を用いて照度を計算する
    float diffuse = max(dot(n, light), 0.0);
    // 求めた照度を頂点の色に乗算する
    vColor = color * vec4(vec3(diffuse), 1.0);
    gl_Position = mvpMatrix * vec4(position, 1.0);
}

