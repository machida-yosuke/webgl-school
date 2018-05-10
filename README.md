# webgl-school
webglの勉強はここに全部いれる

## 0421やったこと
webglは
openglファミリーに属する
opengl es 2.0

chormeはなかみでアングルが入っているので、見た目が変わる
openglをdiretXに変換しているから
結界GPU、ブラウザ、OSによって見た目が変わるのは当然
https://en.wikipedia.org/wiki/ANGLE_(software)

chormeはGPUのブラックリストをもっている
古いGPUはサポート外 intel HD 3000とか
webglはjsのAPIなので、いくらすごいGPUでも、APIに対応したブラウザでしか動かんよ

iOS８以上ならうごく
Androidは５系以降なら動く

webglの対応状態など
https://webglstats.com/

webgl1.0は2011年
webgl2.0はopengl es 3.0をベースにしている

threejs
https://threejs.org/

デメリット
使ったものが似通う

threejsの隠蔽している部分を少しづつ解説していくスタイル

アンビエントライトは環境光
かなり重い

MeshPhongMaterial
Phongさんが考えた照明
反射光を再現できるモデリングはフォンシェーディングという
反射光は視線を考慮していいる
specularが反射の色

```
const CAMERA_PARAM = {
    // ズームインズームアウト
    fovy: 60,               // field of view Y の略
    aspect: width / height, // カメラが撮影する空間のアスペクト比
    near: 0.1,              // カメラからニアクリップ面までの距離
    far: 10.0,              // カメラからファークリップ面までの距離
    x: 0.0,                 // カメラの X 座標
    y: 2.0,                 // カメラの Y 座標
    z: 5.0,                 // カメラの Z 座標
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0) // カメラの注視する座標
};
```

第一回課題　作品作成
