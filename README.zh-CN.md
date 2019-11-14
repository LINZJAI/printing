# printing

网页局部打印。

## 安装

```bash
# npm
npm install printing --save

# yarn
yarn add printing
```

## 使用

```js
import print from 'printing'

const target document.getElementById('target')

const options = {
  // 在打印之前修改DOM
  beforePrint (el, index) {},
  // 纸张方向，默认是'vertical'
  direction: 'vertical',
  // 指定扫描样式，默认是true（全部）
  scanStyles: true,
  // 注入css样式，默认是''
  css: '',
  // 插入所有link和style标签到打印，默认是false
  injectGlobalCss: false,
}

// 预览（用于调试）
print.preview(target, options)

// 打印
print(target, options).then(() => {
  // 打印完成
})
```

## API

- TypeScript部分声明:

```typescript
interface Options {
  beforePrint?: (window: Window) => void
  direction?: 'vertical' | 'horizontal'
  scanStyles?: boolean | string[] | 'common'
  css?: string
  injectGlobalCss?: boolean
}

function print (source: HTMLElement | HTMLElement[], options: Options = {}): Promise<void>

function preview (source: HTMLElement | HTMLElement[], options: Options = {}): Promise<void>
```

- DOM属性:
  - `data-print-style`: add styles to DOM when printing
  - `data-print-class`: add class names to DOM when printing

```html
<div
  style="border: 1px solid blue;"
  data-print-style="border-color: red;"
  data-print-class="my-div"
>
  ...
</div>
```

## 注意事项

- 所有百分比样式（如`width: 100%`），打印时将会失效（原因是使用`getComputedStyle`），但是你可以使用`data-print-style`来覆盖打印样式。
