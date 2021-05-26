# js-device-orientation

DeviceOrientation を使いやすくしたライブラリ

## setup

#### install

```
cd path/to/js-device-orientation
npm install
```

#### package build

```
npm run package
```

`dist`および`package`フォルダが作成される。

#### import

```ts
import { DeviceOrientation } from "path/to/package"
```

or

```
npm install path/to/package
```

```ts
import { DeviceOrientation } from "js-device-orientation/dist"
```

#### script

```ts
function onClick() {
  DeviceOrientation.useDeviceOrientation()
    .requestPermission()
    .then((permitted) => {
      permitted.bind((e) => {
        console.log(`alpha : ${e.alpha}, beta : ${e.beta}, gamma : ${e.gamma}`)
      })
    })
    .catch((reason) => {
      console.warn(`error : ${reason}`)
    })
}
```

※クリックなどのユーザーアクション時に許可を取る必要があります

## [demo](demo/README.md)
