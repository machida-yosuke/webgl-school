attribute vec3 position;
attribute vec4 color;
attribute vec4 randomValue;
uniform mat4  mvpMatrix;
uniform float pointSize;
uniform float timeScale;
uniform float time;
uniform float offsetScale;
varying vec4 vColor;

void main(){
    // ランダムな値を使って頂点を XY 平面上で動かす
    float t = time * timeScale;
    float r = randomValue.x * 0.025;
    float s = sin(randomValue.y * t) * r;
    float c = cos(randomValue.z * t) * r;
    gl_Position = mvpMatrix * vec4(position + vec3(c, s, 0.0), 1.0);
    gl_PointSize = pointSize * (randomValue.w + 0.1);
    vColor = color;
}

