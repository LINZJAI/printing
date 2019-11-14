"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var time = 0;
// 计时开始
function timeStart() {
    time = Date.now();
}
exports.timeStart = timeStart;
// 计时结束
function timeEnd() {
    console.log(Date.now() - time + 'ms');
}
exports.timeEnd = timeEnd;
// 空函数
function noop() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
}
exports.noop = noop;
// 保证是数组
function ensureArray(arr) {
    return Array.isArray(arr) ? arr : [arr];
}
exports.ensureArray = ensureArray;
// 获取并设置行列样式
function getStyles(element, scanStyles) {
    var printClass = element.getAttribute('data-print-class');
    if (printClass)
        element.classList.add(printClass);
    var printStyles = element.getAttribute('data-print-style') || '';
    var styles = '';
    if (scanStyles === true) {
        styles = window.getComputedStyle(element).cssText;
    }
    else if (Array.isArray(scanStyles)) {
        var computed_1 = window.getComputedStyle(element);
        styles = scanStyles
            .map(function (key) {
            var value = computed_1.getPropertyValue(key);
            return value ? key + ": " + value + ";" : '';
        })
            .filter(Boolean)
            .join(' ');
    }
    return styles + printStyles;
}
exports.getStyles = getStyles;
var formTags = ['INPUT', 'TEXTAREA', 'SELECT'];
function isSelect(el) {
    return el.tagName === 'SELECT';
}
// 循环获取样式
function loopStyles(el, scanStyles, ignoreTags) {
    if (ignoreTags === void 0) { ignoreTags = []; }
    var style = ignoreTags.includes(el.tagName) ? '' : getStyles(el, scanStyles);
    if (formTags.includes(el.tagName)) {
        var pre = document.createElement('pre');
        pre.innerHTML = isSelect(el) ? el.options[el.selectedIndex].text : el.value;
        pre.className = el.className;
        if (style)
            pre.setAttribute('style', style);
        el.parentNode.replaceChild(pre, el);
    }
    else {
        if (style)
            el.setAttribute('style', style);
        if (el.children && el.children.length) {
            var children = el.children;
            var len = children.length;
            for (var i = 0; i < len; i++) {
                loopStyles(children[i], scanStyles, ignoreTags);
            }
        }
    }
}
exports.loopStyles = loopStyles;
// 插入样式
function injectStyles(win, styles) {
    var doc = win.document;
    var head = doc.head || doc.querySelector('head');
    styles.forEach(function (style) {
        var el = doc.createElement('style');
        el.type = 'text/css';
        el.innerHTML = style.content;
        if (style.media)
            el.media = style.media;
        head.appendChild(el);
    });
}
exports.injectStyles = injectStyles;
// 等待img标签加载
function resolveImage(img) {
    return new Promise(function (resolve) {
        var src = img.getAttribute('src');
        if (!src || src.startsWith('data:image')) {
            resolve();
        }
        else {
            img.onerror = function () { return resolve(); };
            img.onload = function () { return resolve(); };
        }
    });
}
exports.resolveImage = resolveImage;
//# sourceMappingURL=utils.js.map