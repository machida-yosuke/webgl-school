precision mediump float;
uniform sampler2D textureUnit;
uniform float     dark;
varying vec2 vTexCoord;
void main(){
    vec4 destColor = texture2D(textureUnit, vTexCoord);
    // 暗さ係数を RGB に対してのみ乗算
    gl_FragColor = destColor * vec4(vec3(dark), 1.0);
}
