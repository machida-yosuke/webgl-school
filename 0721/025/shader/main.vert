attribute vec3 position;
attribute vec4 color;
uniform mat4  mvpMatrix;
uniform float pointSize; // ポイントサイズ @@@
varying vec4 vColor;

void main(){
    vColor = color;
    gl_Position = mvpMatrix * vec4(position, 1.0);

    // 頂点のポイントサイズを指定 @@@
    gl_PointSize = pointSize;
}

