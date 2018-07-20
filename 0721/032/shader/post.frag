precision mediump float;
uniform sampler2D textureUnit; // テクスチャユニット
uniform float     curtain;     // カーテン（0.0 ~ 1.0）
uniform float     mixRatio;    // 線形補間係数（0.0 ~ 1.0）
varying vec2      vTexCoord;
void main(){
    vec4 destColor = texture2D(textureUnit, vTexCoord);

    if(vTexCoord.s <= curtain){
        // curtain の値以下のところはもともとの絵をそのまま出す
        gl_FragColor = destColor;
    }else{
        // ネガティブ反転
        vec4 negaColor = vec4(1.0 - destColor.rgb, destColor.a);
        // mix で結果は線形補間する
        gl_FragColor = mix(destColor, negaColor, mixRatio);
    }
}
