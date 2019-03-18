'use strict';
// 兼容 IE 没有 Object.assign 函数
if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    if (target == null || typeof target != 'object' || target instanceof Array) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = new Object(target);
    for (var i = 1; i < arguments.length; i += 1) {
      var source = arguments[i];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}
var excelPreset = {
  version: '1.0',
  options: {
    column: [], // 表格 - 列配置
    source: [], // 需要导出数据
    config: {}, // excel的共有其它配置(合并单元格，宽度设置等)
    position: [], // 开始位置，默认A1[0, 0]
    getCellRender: function(row, col, value) { // 单元格样式
      return {};
    },
    // 类型，参考 https://github.com/sheetjs/js-xlsx#supported-output-formats
    bookType: { bookType: 'xlsx', bookSST: false, type: 'binary' },
  },
  init: function(props) {
    var sheet = new Object(); // 初始化 sheet 对象, 
    // 用于生成列位置，目前最多只支持37 * 36列([A, B, C, ..., Z, AA, AB, ..., AZ, ..., ZZ])
    var sheetColName = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // data 所需要的配置
    var opts = Object.assign({}, this.options, (props || {}));
    // 行遍历
    for (var i = 0; i < opts.source.length; i += 1) {
      // column 遍历(列遍历)
      for (var j = 0; j < opts.column.length; j += 1) {
        var colIndex = j + (opts.position[0] || 0); // 当前列位置(第 colIndex 列)
        // ------- 确定列位置 -----------
        var col1 = sheetColName.slice(colIndex % 26, colIndex % 26 + 1); // 列个位
        var col2 = colIndex < 26 ? '' : sheetColName.slice(colIndex / 26 - 1, colIndex / 26); // 列十位
        var col = col2 + col1; // 列名 index 转化为 A/B/C/.../Z/AA/AB/.../AZ/.../ZZ
        // ------- 确定行位置 -----------
        var row = (opts.position[1] || 0) + i + 1;
        var pos = col + row;
        /**
         * 确定单元格(内容/样式)
         * 
         * 1. 获取单元格的 key 和 格式化函数
         * 2. 根据 key 获取单元格内容
         * 3. 如果存在格式化函数，则格式化单元格内容
         * 4. 整合单元格内容、单元格公共配置、单元格单个配置
         */
        var colKey = opts.column[j];
        var val = opts.source[i][colKey instanceof Array ? colKey[0] : colKey];
        var cellFunc = colKey instanceof Array ? colKey[1] : undefined;
        // 整合公共和单个都有配置的内容
        var target = opts.getCellRender(row, colIndex, val) || {};
        var config = opts.config[pos] || {};
        for (var key in config) {
          if (Object.prototype.hasOwnProperty.call(config, key)) {
            target[key] = Object.assign({}, config[key], target[key]);
          }
        }
        sheet[pos] = Object.assign(
          {
            v: !cellFunc || typeof cellFunc != 'function' ? val : cellFunc(val, row) || '',
            t: typeof val == 'number' ? 'n' : 's',
          },
          target,
        );
      }
    }
    // 获取单元格key数组，确定填充区域
    var keys = Object.keys(sheet);
    return Object.assign({}, { '!ref': keys[0] + ':' + keys[keys.length - 1] }, opts.config, sheet);
  },
  // 如果未导入xlsx.full.min.js，则导入后执行导出XLSX
  export: function(file) {
    if (typeof XLSX !== 'object') {
      var _this = this;
      var script = document.createElement("script");
      script.type = "text/javascript";
      // Firefox, Opera, Chrome, Safari 3+
      script.onload = function() {
        _this.down(file);
      };
      script.src = "./xlsx.full.min.js";
      document.getElementsByTagName("head")[0].appendChild(script);
    } else {
      this.down(file);
    }
  },
  /**
   * 导出 excel
   * 
   * @param {object} file 导出列表
   * @param {string} name Excel名称
   * @param {object} type Output Formats
   * @param {string | array} tags tag 名称，数组
   * @param {object | array} list 导出的列表
   */
  down: function(file) {
    var bt = Object.assign({}, this.options.bookType, (file.type || {}));

    var tags = (typeof file.tags === 'string' ? [file.tags] : file.tags) || [];
    var sheets = (file.list instanceof Array ? file.list : [file.list]) || [];
    var wb = {
      SheetNames: [],
      Sheets: {},
    };
    for (var i = 1; i <= sheets.length; i += 1) {
      var key = tags[i - 1] || ('sheet' + i);
      wb.SheetNames.push(key);
      wb.Sheets[key] = sheets[i - 1];
    }
    var tmpDown = new Blob([this.s2ab(XLSX.write(wb, bt))]);
    this.saveAs(tmpDown, { fileName: (file.name || '未命名') + '.xlsx' });
  },
  saveAs: function(blob, option) {
    var isUrl = option.isUrl;
    var fileName = option.fileName || '未命名';

    // 兼容IE
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      var url = isUrl ? blob : window.URL.createObjectURL(blob);
      var aDom = window.document.createElement('a');
      aDom.setAttribute('download', fileName);
  
      if (typeof aDom.download === 'undefined') aDom.setAttribute('target', '_blank');
  
      aDom.href = url;
      window.document.body.appendChild(aDom);
      aDom.click();
      window.document.body.removeChild(aDom);
      if (!isUrl) {
        window.URL.revokeObjectURL(blob);
      }
    }
  },
  s2ab: function(s) {
    if (typeof ArrayBuffer !== 'undefined') {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    var buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  },
};

window.excelPreset = excelPreset;

