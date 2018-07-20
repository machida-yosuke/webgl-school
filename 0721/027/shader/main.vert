attribute vec3 position;
attribute vec4 color;
attribute vec2 texCoord;
attribute vec4 randomValue;
uniform mat4      mvpMatrix;
uniform float     pointSize;
uniform float     timeScale;
uniform float     time;
uniform float     offsetScale; // オフセット係数 @@@
uniform sampler2D textureUnit; // テクスチャユニット @@@
varying vec4 vColor;

void main(){
    // テクスチャから色を読み出して、輝度を算出 @@@
    vec4 samplerColor = texture2D(textureUnit, texCoord);
    float luminance = (samplerColor.r + samplerColor.g + samplerColor.b) / 3.0;

    // ランダムな値を使って頂点を動かす
    float t = time * timeScale;
    float r = randomValue.x * 0.025;
    float s = sin(randomValue.y * t) * r;
    float c = cos(randomValue.z * t) * r;

    // 頂点を輝度に応じてオフセットする量を決める @@@
    float z = offsetScale * luminance;

    // XY 座標は乱数由来で、Z 座標は輝度由来で影響を受けるようにする @@@
    gl_Position = mvpMatrix * vec4(position + vec3(c, s, -z), 1.0);
    gl_PointSize = pointSize * (randomValue.w + 0.1);

    // 色も、若干輝度から影響を受けるようにする @@@
    vColor = color * vec4(vec3(1.0), 0.25 + luminance * 0.75);
}

