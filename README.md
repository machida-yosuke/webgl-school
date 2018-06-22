# webgl-school
webglの勉強はここに全部いれる

ローカルサーバーはこちらで起動
```
python3 -m http.server
```

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

## 0512
やったこと
three.js の基本機能を使いこなせるようになることがメインテーマ

回転の概念
時計の回転をオブジェクトのみだと表現できない
アンカーポイント真ん中で固定される
回転が先に起こるか移動が先に起こるかの問題がある
threejsの世界では必ず先に回転が起きる
生webglなら自由に設定できる

つまり、three.js の内部では、移動と回転を行う処理を実行すると以下のような流れで処理が行われています。

・Object3D に属するオブジェクトを世界に ひとつだけ 配置する
・原点を中心に世界全体を回転させる（常に回転が先）
・オブジェクトを移動させる（回転したあと移動）
・次のオブジェクトを世界に ひとつだけ 配置する
・原点を中心に世界全体を回転させる……（以下繰り返し）

group化することで中身のオブジェクを移動してgroupを回すと時計ができる

・回転という処理の原則
・回転とは、世界全体を回転させること
・つまり言い換えると 回転は常に世界の中心（原点）で行われる
・移動してから回転するのと、回転してから移動するのは意味がまったく違う
・3D では一般に、回転を先に行うことが多い
・three.js でも、やはり回転が先に処理される

透視投影と平行投影
フォグ

霧
クリアした背景が見えてしまう場合フォグの色とリセットしたときの色は同じにしないとうまくうまくいかない
sceneにfogプロパティがある
フォグが適用されるのはあくまでも 描画されるオブジェクトに対してのみ

テクスチャ
JPEG や PNG などの画像が用いられる場合が多い
動画データや Canvas2Dからビットマップデータを作ってテクスチャにできる
ローダークラスを使う（非同期）
load('画像のパス', コールバック関数)


パーティクル
素体ジオメトリを作成
let geometry = new THREE.Geometry();
sizeAttenuation: true // 遠近感を出すかどうかの真偽値 @@@

頂点をまとめる
hree.js はオブジェクトをひとつずつ世界に配置して動かしているので毎度addするとかなり重い

マテリアル設定
depthWrite
手前にあるものの後ろ側が隠れる現実世界では当たり前に起きることを再現する
絵の具は黒くなる、デジタルは色を足すごとに白くなる

## 0526
第三回勉強会の内容
基礎的な数学を身に着けよう

数学は反復
触れる数がおおいと理解できる

ラジアン
日本は度数法がメジャー
プログラムは弧度法（ラジアン）
円周の公式
半径 r の円の円周は……
円周 = 2 * PI * r

３６０ ＝ 2π

ベクトル
 向きと大きさを持った量
 意味わからん
ベクトルは複数の要素が組み合わさって定義される
XY なら二次元ベクトル、XYZ で三次元ベクトル
ベクトルには向きがあり……
向きが同じでも大きさが違うことがある
これがベクトルが向きと大きさを持つ量、と呼ばれる理由


単位ベクトル
長さが１のベクトル
向きだけに注目したい場合
単位化 === 正規化という


ベクトル（3, 5）の長さは？
ベクトル（-4, 2）を単位化すると？
ベクトル（3, 5, 8）の長さは？
ではベクトル（3, 5, 8）のを単位化すると？

Math.sqrt(3*3 + 5*5)
Math.sqrt(-4*--4 + 2*2)
Math.sqrt(-4*-4 + 2*2)
cosnt len = Math.sqrt(-4*-4 + 2*2)
console.log(-4 / len, 2 / len)
console.log(-4 / Math.sqrt(-4*-4 + 2*2), 2 / Math.sqrt(-4*-4 + 2*2))
Math.sqrt(3*3 + 5*5 + 8 * 8)

平行移動とは各軸に平行に動かすこと
threejsはメートル単位

クォータニオン
加算減算はある掛け算は
内積と外積がある
割り算に相当するものはベクトルにはありません
ベクトル同士のなす角

内積や外積はベクトルの積を表すふたつの形
内積は、ふたつのベクトルのなす角を求めることなどに使う
外積は、ふたつのベクトルに直行するベクトルを求めることなどに使う
内積は dot 積とも呼ばれ、数式では文字通り・（ドット）で表す
外積は cross 積とも呼ばれ、同文字通り ✕（クロス）で表す

クォータニオンは軸がない
acosはコサインをラジアンに戻す

ポストプロセス
めっちゃ簡単にできる

## 0609
レンダリングパイプライン
OpenGL を直接叩くのはやめなさい
固定機能パイプラインはない
プログラマブルなパイプラインを使う
シェーダーの出番
固定機能パイプラインを使う人はあまりいないらしい（機能固定により同じような絵作りになる）
WebGLは頂点以外描画できない
頂点とは点
頂点属性を持っている
htmlでいうidとかclass
頂点ひとつひとつ、それぞれに違った情報を持たせる
頂点情報をいれるバッファ　VBO
VBO が出てきたら頂点属性が関係しているな！ と考えて OK
バインドとはCPUからGPUに橋渡しする
ArrayBuffer クラスを使用すると、バイナリデータを取り扱う事ができます。
argumentsは引数を見れる
フラグメントシェーダー１ピクセルずつレンダリングするすごいやつ
シェーダを記述するための専用言語こそが GLSL
シェーダオブジェクトを紐付けてワンセットにするプログラムオブジェクトが必要
シェーダーの紐づけ
ストレージ修飾子
attribute 頂点属性
uniform   バッファのバインドなどをせずに、直接 JavaScript から値を送ることができる唯一の手段です。
varying   vertexからfragmentへの橋渡し　

```
attribute → 頂点属性、つまり VBO の中身
uniform → 直接 JavaScript から値が送れる
varying → 頂点シェーダとフラグメントシェーダをつなぐ
```
頂点シェーダーは頂点の個数分実行される
フラグメントシェーダーは頂点シェーダーによって頂点によって塗りつぶされる
ピクセルで実行される
フラグメントシェーダーのほうが重い

uniform のタイプ指定
4fv

```
4 =　vec4（ストライド）
f = float（浮動小数点）
v = vec(配列)

GLSL で int → 1i
GLSL で float → 1f
GLSL で float の配列 → 1fv
GLSL で vec2 ~ vec4 → 2fv ~ 4fv
GLSL で mat2 ~ mat4 → matrix2fv ~ matrix4fv
```
// それぞれのプリミティブタイプの違いについて理解を深めておきましょう。
// * gl.POINTS //1pxの点
// * gl.LINES　//２つの頂点を１セットとして一本の線ｗｐ引く
// * gl.LINE_STRIP　//頂点をつないでいく
// * gl.TRIANGLES　//３つで1セット　三角形をつくる
// * gl.TRIANGLE_STRIP // 頂点をつないでいきポリゴンを描く

Index Buffer Object（IBO）
課題　五芒星

glTFはjson形式
1.0は汎用性がなかった
用語：Draco
Draco はGoogle が開発した、オープンライセンスの3D モデル専用の超強力な圧縮方式です。3D モデルのデー
タ容量を1/10 程度にまで圧縮することが可能です。
Facebookに対応してる（すごい　glTF-Binary形式のみ）
テクスチャー画像は2 のべき乗サイズを保つように注意しましょう。2
のべき乗サイズでない場合、浮動小数点（float 型）として処理がしづらく、パフォーマンス
が落ちたり画像の縮小がうまくできなくなってしまいます。
そのため、これらを一つのファイルにまとめることができる仕組みがあります。この単一ファ
イルはglb（glTF-Binary）と呼ばれています。
gltf Converter全部一つにする
「glTF ビューアー（ https://gltf-viewer.donmccurdy.com/ ）
GLTFLoader はglTF のDraco 圧縮拡張にも対応
アニメーションは一つしか出せない　いまのところ

頂点情報はどうする？
普通に入ってる　gltf.scene

アニメーションは複数やる場合自力で追加すればいいじゃない
できそう。gltfじゃないほうがいいかも
最初の女の子はブレンダーエクスポーターだからできた

draco圧縮レンダリングせいどは同じ
展開時が一番重い
でかいファイルのみdraco圧縮しよう
