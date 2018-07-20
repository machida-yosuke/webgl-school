precision mediump float;
uniform mat4      normalMatrix;
uniform vec3      eyePosition;
uniform sampler2D textureUnit;
varying vec3      vPosition;
varying vec3      vNormal;
varying vec2      vTexCoord;

const vec3 light = normalize(vec3(1.0)); // ライトベクトル

void main(){
    vec3 n = (normalMatrix * vec4(normalize(vNormal), 0.0)).xyz; // 法線変換
    vec3 eye = normalize(vPosition - eyePosition);               // 視点 → 頂点
    vec3 ref = reflect(eye, n);                                  // 反射ベクトル
    vec3 v = normalize(ref);                                     // 正規化
    float diffuse = (dot(n, light) + 1.0) * 0.5 * 0.8 + 0.2;     // 拡散光＆環境光
    float specular = pow(max(dot(v, light), 0.0), 8.0);          // 反射光
    vec4 samplerColor = texture2D(textureUnit, vTexCoord);       // テクスチャ
    vec4 destColor = samplerColor * vec4(vec3(diffuse), 1.0);    // 出力カラー
    gl_FragColor = destColor + vec4(vec3(specular), 0.0);
}

