---
layout: post
title: CMD与AMD的区别
date: 2017-04-12 10:00:34
author: Vanny
categories: Web
tags: Module
excerpt: 对AMD规范和CMD规范的理解
---

- content
  {:toc}

> [AMD 规范](https://github.com/amdjs/amdjs-api/wiki/AMD)

> [CMD 规范](https://github.com/seajs/seajs/issues/242)

## AMD 规范和 CMD 规范

AMD(Asynchronous Module Definition), 异步模块定义，是 RequireJS 在推广过程中对模块定义的规范化产出。  
CMD(Common Module Definition)，公共模块定义，是 SeaJS 在推广过程中对模块定义的规范化产出。  
类似的还有 CommonJS Modules/2.0 规范，是 BravoJS 在推广过程中对模块定义的规范化产出。  
这些规范都是为了达成**浏览器模块化开发的目的**

## 区别

1.对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。CMD 推崇 as lazy as possible.  
2.CMD 推崇依赖就近，AMD 推崇依赖前置。另 AMD 也支持 CMD 的写法和将 require 作为依赖项传递，但不推荐。

```javascript
// CMD
define(function (require, exports, module) {
  var a = require("./a");
  a.doSomething();
  // 此处略去 100 行
  var b = require("./b");
  // 依赖可以就近书写
  b.doSomething();
});
// AMD
define(["./a", "./b"], function (a, b) {
  // 依赖必须一开始就写好
  a.doSomething();
  // 此处略去 100 行
  b.doSomething();
});
```

3.AMD API 默认一个当多个用，CMD API 则严格区分，推崇职责单一。比如在 AMD 里，require 分全局 require 和局部 require。CMD 里则没有全局 require，而是根据模块系统的完备性，提供 seaJS.use 来实现模块系统的加载启动。

## 总结

CMD 推崇每个单独的文件就是一个单独的模块。每个模块也就是一个单独的作用域，所以只有加载完成才能执行后面的操作。由于在服务器端，模块文件一般都已经存在于本地硬盘，加载较快，不用考虑非同步加载的方式，所以 CMD 一般适用于服务器端。  
AMD 规范则是非同步加载模块，允许指定回调函数。如果浏览器环境要从服务器端加载模块就必须采用非同步模式，因此浏览器端一般采用 AMD 规范。
