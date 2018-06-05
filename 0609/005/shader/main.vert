attribute vec3 position;
attribute vec4 color;
uniform vec4 globalColor;
varying vec4 vColor;
void main(){
    vColor = color * globalColor;
    gl_Position = vec4(position, 1.0);
}

