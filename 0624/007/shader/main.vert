attribute vec3 position;
attribute vec4 color;
uniform mat4 mvpMatrix;
uniform vec4 globalColor;
varying vec4 vColor;
void main(){
    vColor = color * globalColor;
    gl_Position = mvpMatrix * vec4(position, 1.0);
}

