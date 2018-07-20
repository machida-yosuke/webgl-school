precision mediump float;
uniform mat4        normalMatrix; // 法線変換行列
uniform vec3        eyePosition;  // 視点の座標
uniform samplerCube cubeTexture;  // キューブテクスチャのユニット番号
uniform float       refractIndex; // 屈折率 @@@
uniform bool        refraction;   // 法線による屈折を行うかどうか @@@
varying vec3        vPosition;    // モデル座標変換行列後の頂点の位置
varying vec3        vNormal;      // 頂点本来の法線

void main(){
    // 法線の変換
    vec3 n = (normalMatrix * vec4(normalize(vNormal), 0.0)).xyz;

    // 頂点座標とカメラの位置から視線ベクトルを算出（正規化する） @@@
    vec3 eyeDirection = normalize(vPosition - eyePosition);
    // 屈折ベクトルに用いる変数 @@@
    vec3 refractVector = n;
    // もし屈折有効なら refract で屈折ベクトルを求める @@@
    if(refraction == true){
        refractVector = refract(eyeDirection, n, refractIndex);
    }
    // 屈折ベクトルを使ってキューブマップテクスチャからサンプリング @@@
    vec4 envColor = textureCube(cubeTexture, refractVector);
    gl_FragColor = envColor;
}

