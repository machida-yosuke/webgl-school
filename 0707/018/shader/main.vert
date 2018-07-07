attribute vec3 position;
attribute vec4 color;
attribute vec2 texCoord; // テクスチャ座標 @@@
uniform mat4 mvpMatrix;
varying vec4 vColor;
varying vec2 vTexCoord;  // テクスチャ座標用 varying 変数 @@@

void main(){
    vColor = color;
    vTexCoord = texCoord; // フラグメントシェーダにそのまま送る @@@
    gl_Position = mvpMatrix * vec4(position, 1.0);
}

