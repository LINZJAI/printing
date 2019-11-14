import { ensureArray, injectStyles, loopStyles, noop, resolveImage, Style, timeEnd, timeStart } from './utils'

const ignoreTags = ['COLGROUP', 'COL']

const commonStyles = [
  'align-items', 'border', 'border-collapse', 'bottom', 'box-sizing', 'display', 'flex', 'float', 'font-family',
  'font-size', 'font-weight', 'height', 'justify-content', 'left', 'line-height', 'margin', 'min-height', 'min-width',
  'overflow', 'padding', 'position', 'right', 'text-align', 'text-overflow', 'top', 'vertical-align', 'white-space',
  'width', 'word-break', 'word-wrap',
]

export interface Options {
  beforePrint?: (window: Window) => void
  direction?: 'vertical' | 'horizontal'
  scanStyles?: boolean | string[] | 'common'
  css?: string
  injectGlobalCss?: boolean
  log?: boolean
}

export interface PrintFn {
  (source: HTMLElement | HTMLElement[], options?: Options): Promise<void>
  preview: (source: HTMLElement | HTMLElement[], options: Options) => Promise<void>
}

// 生成html
export function generate (source: HTMLElement | HTMLElement[], options: Options = {}) {
  if (options.log) timeStart()

  const sources = ensureArray(source).filter((s) => s && s.parentNode)
  const clones = sources.map((s) => s.cloneNode(true) as HTMLElement)

  const direction = options.direction || 'vertical'
  const scanStyles = options.scanStyles === undefined
    ? true
    : options.scanStyles === 'common'
    ? commonStyles
    : options.scanStyles

  const pages = sources.map((s, i) => {
    const clone = clones[i]

    // 临时插入克隆的dom到相同位置，用于获取样式
    s.parentNode!.appendChild(clone)

    // 获取样式到clone
    loopStyles(clone, scanStyles, ignoreTags)

    // 移除克隆dom
    s.parentNode!.removeChild(clone)

    return clone.outerHTML
  })

  let styles: Style[] = []

  // 全局css
  if (options.injectGlobalCss) {
    const styleSheets = Array.from(document.styleSheets)

    const content = styleSheets.map((sheet: any) => {
      const title = `\n/* ${sheet.href || 'anonymous'} */\n`
      const rules: CSSRule[] = Array.from(sheet.cssRules || sheet.rules || [])

      return title + rules.map((rule) => rule.cssText).join('\n')
    }).join('\n')

    styles.push({ content })
  }

  // 纸张方向
  if (direction === 'horizontal') {
    styles.push({ content: '@page { size: landscape; }', media: 'print' })
  }

  // 注入css
  if (options.css) {
    styles.push({ content: options.css })
  }

  // 连接分页符
  const pageBreak = '<div style="page-break-after: always;"></div>'
  const body = pages.join(pageBreak)

  if (options.log) timeEnd()

  return { styles, body }
}

// 预览
export async function preview (source: HTMLElement | HTMLElement[], options: Options = {}) {
  const win = window.open()!
  const { styles, body } = generate(source, options)

  injectStyles(win, styles)
  win.document.body.innerHTML = body

  // 打印前处理
  const beforePrint = options.beforePrint || noop
  beforePrint(win)
}

// 打印
export async function print (source: HTMLElement | HTMLElement[], options: Options = {}) {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'block'
  iframe.style.height = '0'
  iframe.style.width = '0'
  iframe.style.overflow = 'hidden'
  document.body.appendChild(iframe)

  const iframeWindow = iframe.contentWindow!
  const iframeDocument = iframe.contentDocument!
  const { styles, body } = generate(source, options)

  injectStyles(iframeWindow, styles)
  iframeDocument.body.innerHTML = body

  // 打印前处理
  const beforePrint = options.beforePrint || noop
  beforePrint(iframeWindow)

  // 等待图片加载完成
  const images: HTMLImageElement[] = Array.from(iframeDocument.querySelectorAll('img[src]'))
  await Promise.all(images.map((img) => resolveImage(img)))

  iframeWindow.print()
  document.body.removeChild(iframe)
}

const printFn: PrintFn = print as any
printFn.preview = preview

export default printFn
