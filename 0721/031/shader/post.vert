attribute vec3 position;
varying vec2 vTexCoord;
void main(){
    // テクスチャ座標は頂点シェーダで動的に求めてしまう
    vTexCoord = (position.xy + 1.0) / 2.0;
    gl_Position = vec4(position, 1.0);
}

