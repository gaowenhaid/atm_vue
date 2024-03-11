"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/** TxOpenPrinter的第一个参数 */
/**@{*/
var TX_TYPE_NONE = 0;
var TX_TYPE_USB = 1;
var TX_TYPE_LPT = 2;
var TX_TYPE_COM = 3;
var TX_TYPE_MEM = 4;
var TX_TYPE_FD = 5;
var TX_TYPE_NET = 6;
/**@}*/

/** 打印机状态 */
/**@{*/
var TX_STAT_NOERROR = 0x0008; /*无故障*/
var TX_STAT_SELECT = 0x0010; /*处于联机状态*/
var TX_STAT_PAPEREND = 0x0020; /*缺纸*/
var TX_STAT_BUSY = 0x0080; /*繁忙*/
var TX_STAT_DRAW_HIGH = 0x0100;
var TX_STAT_COVER = 0x0200;
var TX_STAT_ERROR = 0x0400;
var TX_STAT_RCV_ERR = 0x0800; /* Recoverable error */
var TX_STAT_CUT_ERR = 0x1000; /* Autocutter error */
var TX_STAT_URCV_ERR = 0x2000; /* Unrecoverable error */
var TX_STAT_ARCV_ERR = 0x4000; /* Auto-recoverable error */
var TX_STAT_PAPER_NE = 0x8000; /* paper near-end */
/**@}*/

/** TxDoFunction的func参数 */
/**@{*/
var TX_FONT_SIZE = 1; /*放大系数，0为原始大小，1为增大1倍，如此类推，最大为7；参数1为宽，参数2为高*/
var TX_FONT_ULINE = 2; /*下划线*/
var TX_FONT_BOLD = 3; /*粗体*/
var TX_SEL_FONT = 4; /*选择英文字体*/
var TX_FONT_ROTATE = 5; /*旋转90度*/
var TX_ALIGN = 6; /*参数为TX_ALIGN_XXX*/
var TX_CHINESE_MODE = 7; /*开关中文模式*/
var TX_FEED = 10; /*执行走纸*/
var TX_UNIT_TYPE = 11; /*设置动作单位*/
var TX_CUT = 12; /*执行切纸，第一参数指明类型，第二参数指明切纸前的走纸距离*/
var TX_HOR_POS = 13; /*绝对水平定位*/
var TX_LINE_SP = 14; /*设置行间距*/
var TX_BW_REVERSE = 15; /*设置字体黑白翻转*/
var TX_UPSIDE_DOWN = 16; /*设置倒置打印*/
var TX_INET_CHARS = 17; /*选择国际字符集*/
var TX_CODE_PAGE = 18; /*选择字符代码表*/
var TX_CH_ROTATE = 19; /*设定汉字旋转*/
var TX_CHK_BMARK = 20; /*寻找黑标*/
var TX_SET_BMARK = 21; /*设置黑标相关偏移量*/
var TX_PRINT_LOGO = 22; /*打印已下载好的LOGO*/
var TX_BARCODE_HEIGHT = 23; /*设定条码高度*/
var TX_BARCODE_WIDTH = 24; /*设定条码宽度*/
var TX_BARCODE_FONT = 25; /*选择HRI字符的打印位置*/
var TX_FEED_REV = 26; /*执行逆向走纸*/
var TX_QR_DOTSIZE = 27; /*设置QR码的点大小，2<param1<10*/
var TX_QR_ERRLEVEL = 28; /*设置QR码的交错等级*/
var TX_HOR_POS_REL = 29; /*相对水平定位*/
var TX_DIRECTION = 40; /*在页模式下选择打印方向*/
var TX_VERT_POS = 41; /*页模式下设置垂直打印位置*/
/**@}*/

/** TxDoFunction的参数（需对应功能） */
/**@{*/
var TX_ON = 1;
var TX_OFF = 0;
var TX_CUT_FULL = 0; /*对应TX_CUT*/
var TX_CUT_PARTIAL = 1;
var TX_PURECUT_FULL = 2; /*与黑标无关的切纸*/
var TX_PURECUT_PARTIAL = 3;
var TX_FONT_A = 0; /*对应TX_SEL_FONT*/
var TX_FONT_B = 1;
var TX_ALIGN_LEFT = 0; /*对应TX_ALIGN*/
var TX_ALIGN_CENTER = 1;
var TX_ALIGN_RIGHT = 2;
var TX_SIZE_1X = 0; /*对应TX_FONT_SIZE*/
var TX_SIZE_2X = 1;
var TX_SIZE_3X = 2;
var TX_SIZE_4X = 3;
var TX_SIZE_5X = 4;
var TX_SIZE_6X = 5;
var TX_SIZE_7X = 6;
var TX_SIZE_8X = 7;
var TX_UNIT_PIXEL = 0; /*对应TX_UNIT_TYPE*/
var TX_UNIT_MM = 1;
var TX_CH_ROTATE_NONE = 0; /*对应TX_CH_ROTATE*/
var TX_CH_ROTATE_LEFT = 1;
var TX_CH_ROTATE_RIGHT = 2;
var TX_BM_START = 1; /*起始打印位置相对于黑标检测位置的偏移量*/
var TX_BM_TEAR = 2; /*切/撕纸位置相对于黑标检测位置的偏移量*/
var TX_LOGO_1X1 = 0; /*对应TX_PRINT_LOGO*/
var TX_LOGO_1X2 = 1; /*203x101*/
var TX_LOGO_2X1 = 2; /*101x203*/
var TX_LOGO_2X2 = 3; /*101x101*/
var TX_BAR_FONT_NONE = 0; /*对应TX_BARCODE_FONT*/
var TX_BAR_FONT_UP = 1;
var TX_BAR_FONT_DOWN = 2;
var TX_BAR_FONT_BOTH = 3;
/**@}*/

/** 条码类型 */
/**@{*/
var TX_BAR_UPCA = 65;
var TX_BAR_UPCE = 66;
var TX_BAR_EAN13 = 67;
var TX_BAR_EAN8 = 68;
var TX_BAR_CODE39 = 69;
var TX_BAR_ITF = 70;
var TX_BAR_CODABAR = 71;
var TX_BAR_CODE93 = 72;
var TX_BAR_CODE128 = 73;
/**@}*/

/** 串口设置 */
/**@{*/
var TX_SER_BAUD_MASK = 0xFF000000; /* 波特率 */
var TX_SER_BAUD9600 = 0x00000000;
var TX_SER_BAUD19200 = 0x01000000;
var TX_SER_BAUD38400 = 0x02000000;
var TX_SER_BAUD57600 = 0x03000000;
var TX_SER_BAUD115200 = 0x04000000;
var TX_SER_BAUD230400 = 0x05000000;
var TX_SER_BAUD460800 = 0x06000000;
var TX_SER_BAUD921600 = 0x07000000;
var TX_SER_DATA_MASK = 0x00FF0000; /* 数据位 */
var TX_SER_DATA_8BITS = 0x00000000;
var TX_SER_DATA_7BITS = 0x00010000;
var TX_SER_PARITY_MASK = 0x0000FF00; /* 校验 */
var TX_SER_PARITY_NONE = 0x00000000;
var TX_SER_PARITY_EVEN = 0x00000100;
var TX_SER_PARITY_ODD = 0x00000200;
var TX_SER_STOP_MASK = 0x000000F0; /* 停止位 */
var TX_SER_STOP_1BITS = 0x00000000;
var TX_SER_STOP_15BITS = 0x00000010;
var TX_SER_STOP_2BITS = 0x00000020;
var TX_SER_FLOW_MASK = 0x0000000F; /* 流控制 */
var TX_SER_FLOW_NONE = 0x00000000;
var TX_SER_FLOW_HARD = 0x00000001;
var TX_SER_FLOW_SOFT = 0x00000002;
/**@}*/

/** QR码纠错等级 */
/**@{*/
var TX_QR_ERRLEVEL_L = 0x31;
var TX_QR_ERRLEVEL_M = 0x32;
var TX_QR_ERRLEVEL_Q = 0x33;
var TX_QR_ERRLEVEL_H = 0x34;
/**@}*/
var PrintHelper = /*#__PURE__*/function () {
  function PrintHelper() {
    _classCallCheck(this, PrintHelper);
    _defineProperty(this, "lines", void 0);
    this.lines = [];
  }

  /**
   * 连接打印机。需在所有函数前执行。
   */
  _createClass(PrintHelper, [{
    key: "open",
    value: function open(type, opts) {
      this.lines.push("Open:".concat(type, ",").concat(opts));
    }

    /**
     * 关闭连接
     */
  }, {
    key: "close",
    value: function close() {
      this.lines.push('Close');
    }

    /**
     * 初始化
     */
  }, {
    key: "init",
    value: function init() {
      this.lines.push('Init');
    }
    /**
     * 输出字符串
     */
  }, {
    key: "addString",
    value: function addString(txt) {
      this.lines.push("String:".concat(txt));
    }

    /**
     * 输出字符串，并自动添加回车、换行
     */
  }, {
    key: "addStringLn",
    value: function addStringLn(txt) {
      this.lines.push("StringLn:".concat(txt));
    }

    /**
     * 执行特殊功能
     */
  }, {
    key: "doFunction",
    value: function doFunction(fn, param1, param2, contentType = 'noCut') {
      var arr = [];
      arr.push(fn.toString());
      arr.push(param1.toString());
      arr.push(param2.toString());
      this.lines.push('Function:' + arr.join(','));
      if (contentType === 'cut') return 'end'
    }

    /**
     * 恢复字体效果（大小、粗体等）为原始状态。
     */
  }, {
    key: "resetFont",
    value: function resetFont() {
      this.lines.push('ResetFont');
    }

    /**
     * 打印条码
     */
  }, {
    key: "printBarcode",
    value: function printBarcode(ty, txt) {
      this.lines.push("Barcode:".concat(ty, ",").concat(txt));
    }

    /**
     * 打印QR码
     */
  }, {
    key: "printQRcode",
    value: function printQRcode(txt) {
      this.lines.push('QRcode:' + txt);
    }
  }, {
    key: "printImage",
    value: function printImage(url) {
      this.lines.push("Image:" + url);
    }

    /**
     * 收集所有内容
     */
  }, {
    key: "getAllContent",
    value: function getAllContent() {
      return this.lines.join('\n');
    }
  }]);
  return PrintHelper;
}();