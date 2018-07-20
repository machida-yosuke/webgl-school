attribute vec3 position;
attribute vec4 color;
attribute vec4 randomValue;
uniform mat4  mvpMatrix;
uniform float pointSize;
uniform float timeScale; // 時間の経過速度 @@@
uniform float time;      // 時間の経過（秒）
varying vec4 vColor;

void main(){
    vColor = color;

    // ランダムな値を使って頂点を動かす @@@
    float t = time * timeScale;
    float r = randomValue.x * 0.025;
    float s = sin(randomValue.y * t) * r;
    float c = cos(randomValue.z * t) * r;

    // 乱数から求めた値を頂点に加算してから座標変換する @@@
    gl_Position = mvpMatrix * vec4(position + vec3(c, s, 0.0), 1.0);

    // 頂点のポイントサイズを指定（乱数の影響を受けるように） @@@
    gl_PointSize = pointSize * (randomValue.w + 0.1);
}

