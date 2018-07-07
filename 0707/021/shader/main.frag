precision mediump float;

uniform sampler2D textureUnit;
varying vec4 vColor;
varying vec2 vTexCoord;

void main(){
    // テクスチャオブジェクトから、テクスチャ座標を参照して色を取り出す
    vec4 samplerColor = texture2D(textureUnit, vTexCoord);
    gl_FragColor = vColor * samplerColor;
}

