---
layout: post
title: 导出Excel 自定义样式
tags: [XLSX,JS,plugin]
category: Web
description: 日常需求：导出Excel，可以自定义单元格样式、合并单元格，处理单列数据等
---

> 按照特定格式(合并单元格，自定义样式等)导出 Excel

### [Demo](/assets/00exportExcel)
 
## 依赖
```shell
  # 二选一即可
  # JS-XLSX 不支持自定义样式, 没有自定义样式需求可选择
  npm install xlsx
  # 支持自定义样式
  npm install xlsx-style
```

## 思路
  一般情况下，我们获取到的数据会是一个以**行**划分的 `list`，而 `XLSX` 插件的格式按照**单元格**划分的，所以需要同步数组类型。除了个别情况，绝大多数单元格样式是一致的，这样就给了我们可封装的余地。(没有样式需求的话建议直接使用 [json_to_sheet / table_to_sheet](https://github.com/sheetjs/js-xlsx#utilities) )

  传入需要导出的 `list` 和列变量列表 `column`，循环遍历生成 `XLSX` 导出需要的格式，在遍历时可通过函数生成单元格样式和单元格内容。最后整合统一配置(宽高设置、合并单元格设置)，然后通过 `XLSX.write` 生成Excel文件内容，转化为二进制文件后利用 `A标签` 特性下载。

  具体思路可直接参照[源码](/assets/00exportExcel/index.js)

## 用法

### 简单
```js
  var result = excelPreset.init({
    column: ['a', 'b', 'c'],
    source: [
      { a: 232, b: 291, c: 232 },
      { a: 343, b: 862, c: 247 },
      { a: 136, b: 974, c: 124 },
      { a: 212, b: 976, c: 'due' },
    ],
  });
  excelPreset.export({ list: result });
```

### 样式
```js
  var result = excelPreset.init({
    column: ['a', 'b', 'c'],
    source: [
      { a: 232, b: 291, c: 232 },
      { a: 343, b: 862, c: 247 },
      { a: 136, b: 974, c: 124 },
      { a: 212, b: 976, c: 'due' },
    ],
    config: { // 公共配置，即总体配置
      '!merges': [ // 合并单元格
        {
          s: { c: 3, r: 1 }, // 开始：从 D2 开始
          e: { c: 4, r: 2 }, // 结束：到 E3 结束
        },
      ],
      D2: { // D2 样式
        s: {
          font: {
            color: { rgb: 'D37600' }, // 字体颜色 
            sz: 16, // 字体大小
          }
        },
      },
    },
    getCellRender: getCellStyle,
    position: [2, 1], // 偏移量，从 C2 开始
  });
  excelPreset.export({ list: result });

  function getCellStyle(row, col) {
    return {
      s: { 
        // 每个单元格都一样
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
        // 根据行列不同配置不同样式
        fill: { fgColor: { rgb: col > 3 && row > 5 ? 'FFFFCD' : 'FFFFFF' } },
        // 每个单元格都一样
        alignment: { horizontal: 'center', vertical: 'center' },
      },
    }
  }
```

### 多sheet
```js
  var data = {
    column: ['a', ['b', function(v) { return v || parseInt(Math.random() * 100, 10) }], 'c'],
    source: [
      { a: 232, b: 0, c: 232 },
      { a: 343, b: 0, c: 0 },
      { a: 136, b: 0, c: 124 },
      { a: 212, b: 0, c: 'due' },
    ],
  };
  var list = [];
  for (var i = 0; i < 3; i += 1) {
    list.push(excelPreset.init(data));
  }
  excelPreset.export({
    name: '这有Excel有多个Sheet',
    tags: 'hhhhhh',
    list: list,
  });
```

## API

| 参数     | 说明           | 类型      | 默认值  |
|---------|---------------|-----------|--------|
| options | 配置项 和 数据源 | `object`  | {}     |
| init    | 初始化，将`list`转为excel格式 | `function(opts)`  | - |
| export  | 动态加载xlsx    | `function(file)`  | - |
| down    | 导出           | `function(file)`  | - |
| saveAs  | 另存为	        | `function(blob: binary, option)`  | - |
| s2ab    | 转化为二进制     | `function(s: string)` | - |

### excelPreset.init

| 参数           | 说明       | 类型      | 默认值  |
|---------------|------------|----------|--------|
| column        | 列配置项    | `array`  | []     |
| source        | 需要导出数据 | `array`  | []     |
| config        | 公共配置    | `object`  | {}    |
| position      | 偏移量	    | `[x, y]`  | []    |
| getCellRender | 单个配置    | `function(row: number, col: number, val)` | - |

### excelPreset.down/excelPreset.export

| 参数  | 说明     | 类型            | 默认值   |
|------|----------|----------------|---------|
| name | 文件名称  | `string`       | 未命名    |
| type | 文件类型  | `object`        | `xlsx`  |
| tags | sheet名称 | `string|array` | `sheet1` |
| list | sheet数据 | `object|array` | -        |

## 相关资料
1. [xlsx-style 自定义样式说明文档](https://www.npmjs.com/package/xlsx-style#cell-styles)
2. [纯前端利用 js-xlsx 之单元格样式(4)](https://www.jianshu.com/p/869375439fee)

## 修改记录
- 190318