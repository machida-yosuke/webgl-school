attribute vec3 position; //頂点位置
attribute vec3 normal; //頂点の法線
attribute vec4 color; //頂点カラー
uniform mat4 mvpMatrix;
varying vec4 vColor;

// 平行光源（ディレクショナルライト）のライトベクトル @@@
// これはuniformで渡してもいい
// 向きだけに注目したいから正規化
const vec3 light = normalize(vec3(1.0));

void main(){
    // ベクトルの内積を用いて照度を計算する @@@
    // max 大きい方を返す
    // dot　内積
    // ライトベクトも法線も単位ベクトルである（長さ１）
    // dotというのはベクトルの内積を計算にするもの
    // 内積の結果は２つのベクトルのシンクロ率
    // 単位ベクトル同士の内積の結果は　-1.0 ~ 1.0になる
    // シンクロ率が低いほど暗い色になる
    float diffuse = max(dot(normal, light), 0.0);
    // 求めた照度を頂点の色に乗算する @@@
    vColor = color * vec4(vec3(diffuse), 1.0);
    gl_Position = mvpMatrix * vec4(position, 1.0);
}