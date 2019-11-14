declare const process: any

let time: number = 0

// 计时开始
export function timeStart () {
  time = Date.now()
}

// 计时结束
export function timeEnd () {
  console.log(Date.now() - time + 'ms')
}

// 空函数
export function noop (...args: any[]) {/* empty */}

// 保证是数组
export function ensureArray<T> (arr: T | T[]): T[] {
  return Array.isArray(arr) ? arr : [arr]
}

// 获取并设置行列样式
export function getStyles (element: HTMLElement, scanStyles: boolean | string[]) {
  const printClass = element.getAttribute('data-print-class')
  if (printClass) element.classList.add(printClass)

  const printStyles = element.getAttribute('data-print-style') || ''

  let styles = ''

  if (scanStyles === true) {
    styles = window.getComputedStyle(element).cssText
  } else if (Array.isArray(scanStyles)) {
    const computed = window.getComputedStyle(element)

    styles = scanStyles
      .map((key) => {
        const value = computed.getPropertyValue(key)
        return value ? `${key}: ${value};` : ''
      })
      .filter(Boolean)
      .join(' ')
  }

  return styles + printStyles
}

const formTags = ['INPUT', 'TEXTAREA', 'SELECT']

function isSelect (el: HTMLElement): el is HTMLSelectElement {
  return el.tagName === 'SELECT'
}

// 循环获取样式
export function loopStyles (el: HTMLElement, scanStyles: boolean | string[], ignoreTags: string[] = []) {
  const style = ignoreTags.includes(el.tagName) ? '' : getStyles(el, scanStyles)

  if (formTags.includes(el.tagName)) {
    const pre = document.createElement('pre')

    pre.innerHTML = isSelect(el) ? el.options[el.selectedIndex].text : (el as HTMLInputElement).value
    pre.className = el.className

    if (style) pre.setAttribute('style', style)

    el.parentNode!.replaceChild(pre, el)
  } else {
    if (style) el.setAttribute('style', style)

    if (el.children && el.children.length) {
      const children = el.children
      const len = children.length

      for (let i = 0; i < len; i++) {
        loopStyles(children[i] as HTMLElement, scanStyles, ignoreTags)
      }
    }
  }
}

export interface Style {
  content: string
  media?: string
}

// 插入样式
export function injectStyles (win: Window, styles: Style[]) {
  const doc = win.document
  const head = doc.head || doc.querySelector('head')

  styles.forEach((style) => {
    const el = doc.createElement('style')
    el.type = 'text/css'
    el.innerHTML = style.content

    if (style.media) el.media = style.media

    head.appendChild(el)
  })
}

// 等待img标签加载
export function resolveImage (img: HTMLImageElement) {
  return new Promise((resolve) => {
    const src = img.getAttribute('src')
    if (!src || src.startsWith('data:image')) {
      resolve()
    } else {
      img.onerror = () => resolve()
      img.onload = () => resolve()
    }
  })
}
