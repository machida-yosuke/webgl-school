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
