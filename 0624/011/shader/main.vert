attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
uniform mat4 mvpMatrix;
varying vec4 vColor;

// 平行光源（ディレクショナルライト）のライトベクトル @@@
const vec3 light = normalize(vec3(1.0));

void main(){
    // ベクトルの内積を用いて照度を計算する @@@
    float diffuse = max(dot(normal, light), 0.0);
    // 求めた照度を頂点の色に乗算する @@@
    vColor = color * vec4(vec3(diffuse), 1.0);
    gl_Position = mvpMatrix * vec4(position, 1.0);
}

