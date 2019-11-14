# printing

Help to print specified DOMs instead of whole page.

- [中文说明](./README.zh-CN.md)

## Installation

```bash
# npm
npm install printing --save

# yarn
yarn add printing
```

## Usage

```js
import print from 'printing'

const target document.getElementById('target')

const options = {
  // modify DOM before print
  beforePrint (window) {},
  // paper direction, default is 'vertical'
  direction: 'vertical',
  // scan and apply specified styles, default is true (all styles)
  scanStyles: true,
  // inject css, default is ''
  css: '',
  // inject all links and styles from source page, default is false
  injectGlobalCss: false,
}

// preview without print (for debug)
print.preview(target, options)

// print
print(target, options).then(() => {
  // after print
})
```

## API

- TypeScript declarations:

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

- DOM attributes:
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

## Notes

- All style with percentage (such as `width: 100%`) will be invalid while printing (due to `getComputedStyle`), and you can use `data-print-style` to fix it.
