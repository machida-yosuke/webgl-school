precision mediump float;
uniform mat4  normalMatrix; // 法線変換行列
uniform vec3  eyePosition;  // 視点の座標
uniform bool  isSpecular;   // 反射光を描画するかどうか
uniform float exponent;     // 反射光の強調度合い
varying vec3  vPosition;    // モデル座標変換行列後の頂点の位置
varying vec3  vNormal;      // 頂点本来の法線
varying vec4  vColor;       // 頂点本来の色

// ※今回変更点多いので、最初は面食らってしまうかもしれませんが
//   すぐに全てを理解できなくても、過剰に心配しなくても大丈夫。
//   諦めずに少しずつ、理解を広げていきましょう。

// 平行光源（ディレクショナルライト）のライトベクトル
const vec3 light = normalize(vec3(1.0));

void main(){
    // フラグメントシェーダ側で法線の変換とライトの計算を行う
    vec3 n = (normalMatrix * vec4(normalize(vNormal), 0.0)).xyz;

    // 頂点の位置と視点の位置からベクトルを生成して正規化
    vec3 eye = normalize(vPosition - eyePosition);
    // 視線ベクトルを反射させる
    vec3 ref = reflect(eye, n);
    // 得られたベクトルを正規化
    vec3 v = normalize(ref);
    // 反射光を求める
    float specular = max(dot(v, light), 0.0);
    // 反射光は、べき算を使って強調する
    specular = pow(specular, exponent);

    // 拡散光
    float diffuse = max(dot(n, light), 0.0);

    // 出力する色
    vec4 destColor = vColor * vec4(vec3(diffuse), 1.0); // 拡散光は乗算
    if(isSpecular == true){
        destColor.rgb += specular; // 反射光は加算するのがポイント
    }
    gl_FragColor = destColor;
}

