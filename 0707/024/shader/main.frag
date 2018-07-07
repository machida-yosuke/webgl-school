precision mediump float;
uniform mat4  normalMatrix; // 法線変換行列
uniform vec3  eyePosition;  // 視点の座標
uniform float fogStart;     // フォグ開始位置 @@@
uniform float fogEnd;       // フォグ終了位置 @@@
varying vec3  vPosition;    // モデル座標変換行列後の頂点の位置
varying vec3  vNormal;      // 頂点本来の法線
varying vec4  vColor;       // 頂点本来の色

const vec3 fogColor = vec3(0.7);         // フォグの色 @@@
const vec3 light = normalize(vec3(1.0)); // ライトベクトル

void main(){
    // 法線の変換とライトの計算を行う
    vec3 n = (normalMatrix * vec4(normalize(vNormal), 0.0)).xyz;
    // 反射光
    vec3 eye = normalize(vPosition - eyePosition);
    vec3 ref = reflect(eye, n);
    vec3 v = normalize(ref);
    float specular = max(dot(v, light), 0.0);
    specular = pow(specular, 5.0);
    // 拡散光
    float diffuse = max(dot(n, light), 0.0);
    // 本来出力するフラグメントの色を求める
    vec4 destColor = vColor * vec4(vec3(diffuse), 1.0);
    destColor.rgb += specular;
    destColor.rgb += vColor.rgb * 0.2;

    // フォグの計算 @@@
    // カメラと頂点の間の距離をはかる
    float eyeDistance = length(vPosition - eyePosition);
    // 計測した距離からフォグの影響度を示す係数を求める @@@
    //clamp(対象となるあたい, 最小値, 最大値)　最小以下にならないし、最大以上にもならない
    float fog = clamp((eyeDistance - fogStart) / (fogEnd - fogStart), 0.0, 1.0);
    // フォグの影響を考慮した色を求める @@@
    // mix(対象１, 対象２, 補完係数) == 線形補間
    // 補完係数が0なら戻り値は対象１
    // 補完係数が1なら戻り値は対象2
    // 補完係数が0.5なら戻り値は対象１と対象２を１：１で線形補間
    destColor.rgb = mix(destColor.rgb, fogColor, fog);

    gl_FragColor = destColor;
}
