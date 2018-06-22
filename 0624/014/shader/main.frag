precision mediump float;
uniform mat4 normalMatrix;
varying vec3 vNormal;
varying vec4 vColor;

// 平行光源（ディレクショナルライト）のライトベクトル
const vec3 light = normalize(vec3(1.0));

void main(){
    // フラグメントシェーダ側で法線の変換とライトの計算を行う @@@
    vec3 n = (normalMatrix * vec4(normalize(vNormal), 0.0)).xyz;
    float diffuse = max(dot(n, light), 0.0);
    gl_FragColor = vColor * vec4(vec3(diffuse), 1.0);
}

