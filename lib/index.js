"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var ignoreTags = ['COLGROUP', 'COL'];
var commonStyles = [
    'align-items', 'border', 'border-collapse', 'bottom', 'box-sizing', 'display', 'flex', 'float', 'font-family',
    'font-size', 'font-weight', 'height', 'justify-content', 'left', 'line-height', 'margin', 'min-height', 'min-width',
    'overflow', 'padding', 'position', 'right', 'text-align', 'text-overflow', 'top', 'vertical-align', 'white-space',
    'width', 'word-break', 'word-wrap',
];
// 生成html
function generate(source, options) {
    if (options === void 0) { options = {}; }
    if (options.log)
        utils_1.timeStart();
    var sources = utils_1.ensureArray(source).filter(function (s) { return s && s.parentNode; });
    var clones = sources.map(function (s) { return s.cloneNode(true); });
    var direction = options.direction || 'vertical';
    var scanStyles = options.scanStyles === undefined
        ? true
        : options.scanStyles === 'common'
            ? commonStyles
            : options.scanStyles;
    var pages = sources.map(function (s, i) {
        var clone = clones[i];
        // 临时插入克隆的dom到相同位置，用于获取样式
        s.parentNode.appendChild(clone);
        // 获取样式到clone
        utils_1.loopStyles(clone, scanStyles, ignoreTags);
        // 移除克隆dom
        s.parentNode.removeChild(clone);
        return clone.outerHTML;
    });
    var styles = [];
    // 全局css
    if (options.injectGlobalCss) {
        var styleSheets = Array.from(document.styleSheets);
        var content = styleSheets.map(function (sheet) {
            var title = "\n/* " + (sheet.href || 'anonymous') + " */\n";
            var rules = Array.from(sheet.cssRules || sheet.rules || []);
            return title + rules.map(function (rule) { return rule.cssText; }).join('\n');
        }).join('\n');
        styles.push({ content: content });
    }
    // 纸张方向
    if (direction === 'horizontal') {
        styles.push({ content: '@page { size: landscape; }', media: 'print' });
    }
    // 注入css
    if (options.css) {
        styles.push({ content: options.css });
    }
    // 连接分页符
    var pageBreak = '<div style="page-break-after: always;"></div>';
    var body = pages.join(pageBreak);
    if (options.log)
        utils_1.timeEnd();
    return { styles: styles, body: body };
}
exports.generate = generate;
// 预览
function preview(source, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var win, _a, styles, body, beforePrint;
        return __generator(this, function (_b) {
            win = window.open();
            _a = generate(source, options), styles = _a.styles, body = _a.body;
            utils_1.injectStyles(win, styles);
            win.document.body.innerHTML = body;
            beforePrint = options.beforePrint || utils_1.noop;
            beforePrint(win);
            return [2 /*return*/];
        });
    });
}
exports.preview = preview;
// 打印
function print(source, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var iframe, iframeWindow, iframeDocument, _a, styles, body, beforePrint, images;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    iframe = document.createElement('iframe');
                    iframe.style.display = 'block';
                    iframe.style.height = '0';
                    iframe.style.width = '0';
                    iframe.style.overflow = 'hidden';
                    document.body.appendChild(iframe);
                    iframeWindow = iframe.contentWindow;
                    iframeDocument = iframe.contentDocument;
                    _a = generate(source, options), styles = _a.styles, body = _a.body;
                    utils_1.injectStyles(iframeWindow, styles);
                    iframeDocument.body.innerHTML = body;
                    beforePrint = options.beforePrint || utils_1.noop;
                    beforePrint(iframeWindow);
                    images = Array.from(iframeDocument.querySelectorAll('img[src]'));
                    return [4 /*yield*/, Promise.all(images.map(function (img) { return utils_1.resolveImage(img); }))];
                case 1:
                    _b.sent();
                    iframeWindow.print();
                    document.body.removeChild(iframe);
                    return [2 /*return*/];
            }
        });
    });
}
exports.print = print;
var printFn = print;
printFn.preview = preview;
exports.default = printFn;
//# sourceMappingURL=index.js.map