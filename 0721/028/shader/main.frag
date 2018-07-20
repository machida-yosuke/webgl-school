precision mediump float;
uniform sampler2D textureUnit;
varying vec4 vColor;

void main(){
    // 点として描かれる矩形のなかの、テクスチャ座標に相当する値を使う @@@
    vec2 texCoord = gl_PointCoord.st;
    // テクスチャを読み出す @@@
    vec4 samplerColor = texture2D(textureUnit, texCoord);
    gl_FragColor = vColor * samplerColor;
}

