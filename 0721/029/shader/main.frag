precision mediump float;
uniform mat4        normalMatrix; // 法線変換行列
uniform vec3        eyePosition;  // 視点の座標
uniform samplerCube cubeTexture;  // キューブテクスチャのユニット番号 @@@
uniform bool        reflection;   // 法線による反射を行うかどうか @@@
varying vec3        vPosition;    // モデル座標変換行列後の頂点の位置
varying vec3        vNormal;      // 頂点本来の法線

void main(){
    // 法線の変換
    vec3 n = (normalMatrix * vec4(normalize(vNormal), 0.0)).xyz;
    // 頂点座標とカメラの位置から視線ベクトルを算出
    vec3 eyeDirection = vPosition - eyePosition;

    // 反射ベクトルに用いる変数 @@@
    vec3 reflectVector = n;
    // もし反射有効なら reflect で反射ベクトルを求める @@@
    if(reflection == true){
        reflectVector = reflect(eyeDirection, n);
    }
    // 反射ベクトルを使ってキューブマップテクスチャからサンプリング @@@
    vec4 envColor = textureCube(cubeTexture, reflectVector);
    gl_FragColor = envColor;
}

