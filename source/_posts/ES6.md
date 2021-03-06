---
layout: post
title: ES6学习笔记
date: 2017-05-09 19:14:23
author: Vanny
categories: Note
tags: Web
excerpt: ES6学习笔记，持续整理中
---

- content
  {:toc}

## let 与 var

- 同一个作用域里，如果命名重复的话，var 后者会覆盖掉前者，而 let 会报错

```js
// var直接覆盖
var temp = 1;
console.log(temp); // 1
var temp = 2;
console.log(temp); // 2
// let报错
let temp = 1;
console.log(temp);
let temp = 2;
console.log(temp); // Uncaught SyntaxError: Identifier 'temp' has already been declared
```

- var 只有全局作用域和函数作用域，let 相较于 var 增加了块作用域

```js
var name1 = "aaaaa";
while (true) {
  var name1 = "bbbbb";
  console.log(name1); // bbbbb
  break;
}
console.log(name1); // bbbbb, while里的name1值覆盖了外面所定义的name1值
let name2 = "aaaaa";
while (true) {
  let name2 = "bbbbb";
  console.log(name2); // bbbbb
  break;
}
console.log(name2); // aaaaaa, while里的name2值不会覆盖外面所定义的name2值
```

- let 解决了 var 的变量泄露问题，var 一般使用闭包来解决这个问题

```js
var a1 = [];
for (var i = 0; i < 10; i++) {
  a1[i] = function () {
    console.log(i);
  };
}
a1[6](); // 10
a1[3](); // 10
let a2 = [];
for (let i = 0; i < 10; i++) {
  a2[i] = function () {
    console.log(i);
  };
}
a2[6](); // 6
a2[3](); // 3
```

## const

- 同一个作用域里，如果命名重复的话会报错，不同作用域里会不影响

```js
for (var i = 0; i < 2; i++) {
  const PI = Math.PI;
  console.log(PI); // 3.141592653589793
}
const PI = 3.14;
console.log(PI); // 3.14
```

- const 定义常量，值不能改变

```js
const PI = Math.PI;
PI = 23; // Uncaught SyntaxError: Identifier 'PI' has already been declared
```

- const 允许变量赋值

```js
let te1 = 1;
const text = te1;
console.log(text); // 1
te1 = 2;
console.log(text); // 2
```

- const 的实际用途

```js
// 定义常量
const PI = Math.PI;
// 定义函数
const fun1 = () => {
	...
}
// 命名空间
const GLOBAL = {}
GLOBAL.namespace = function (str) {
        var arr = str.split('.'),
	o = GLOBAL;
	for(let i = (arr[0] === 'GLOBAL') ? 1 : 0; i < arr.length; i++){
	        o[arr[i]] = o[arr[i]] || {};
	        o = o[arr[i]];
	}
};
```

## 面向对象

- class, extends, super

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};
var p = new Point(1, 2);
//定义类
class Point {
  constructor(x, y) {
    //constructor 构造方法
    this.x = x;
    this.y = y;
  }
  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
}
var p = new Point(1, 2);
```

## arrow function 箭头函数

- 简化代码，指向使用时所在的对象。
- 解决了 `this` 指向乱跑的问题。
- 备注
  - 如果只有一个参数时 `()` 可以省略
  - 如果只有一个 return 时 `{}` 和 `return` 可以省略

```js
function test1(x, y) {
	x++;
	y--;
	return x + y;
}
const test2 = (x, y) => {
	x++;
	y--;
	return x+y
}
function test3(x) => {
	return x * 3;
}
const test4 = x => x * 3;
```

- 实例

```html
<div class="red">
  <div class="blue"></div>
</div>
<script type="text/javascript">
  $(".red").on("click", clickEvent);
  function clickEvent() {
    var that = this;
    //$(this).text();
    console.log(this);
    // $(this).text('被点击了');
    setTimeout(function () {
      $(that).text("被点击了");
      console.log(this);
    }, 1000);
    setTimeout(() => {
      $(this).text("被点击了");
      console.log(this);
    }, 1000);
  }
  // function clickEvent(){
  // 	var that = this;
  // 	console.log(this);
  // 	changeEvent();
  // 	function changeEvent(){
  // 		console.log(this);
  // 		$(that).find('.blue').css('background-color', 'yellow');
  // 	}
  // 	const changeEvent = () => {
  // 		$(this).find('.blue').css('background-color', 'yellow');
  // 	}
  // }
</script>
```

## string 字符串

### 新方法

- startsWith
- endsWith

### template string 字符串模板

```html
<div id="result1"></div>
<div id="result2"></div>
```

```js
let basket = {
	count: 5,
	onSale: 4
};
$("#result1").append(
	"There are <b>" + basket.count + "</b> " +
	"items in your basket, " +
	"<em>" + basket.onSale +
	"</em> are on sale!"
);
$("#result2").append(`
	template string:
	There are <b>${basket.count}</b> items
	in your basket, <em>${basket.onSale}</em>
	are on sale!
`);
className="";
className={`class1 clsaa2`};
```

## destructuring 解构赋值

- 简化代码
- 注意
  - 等号两边结构必须一样
  - 声明和赋值不能分开

```js
let cat = "喵喵";
let dog = "旺财";
let zoo1 = { cat: cat, dog: dog };
console.log(zoo1); // {cat: '喵喵', dog: '旺财'}
let zoo2 = { cat, dog };
console.log(zoo2); // {cat: '喵喵', dog: '旺财'}
let { type, many } = { type: "animal", many: 2 };
console.log(type, many); // animal 2
```

## default，rest

- 给参数一个默认值 `type = 'cat'` ，之前都是用 `type = type || 'cat'` 实现
- `rest` 用于收集剩余的参数
- `rest` 也可用于数组展开
- `rest` 必须是最后一个形参

```js
function todo(type = "cat", b, ...arg) {
  console.log(type, b, arg);
}
todo(undefined, "123", [1, 2, 3], 12); // cat 123 [[1, 2, 3], 12]
```

## 数组处理

### map 映射(一对一)

```js
// 统一用 arr 做例子
let arr = [
  { name: "张三", score: 30 },
  { name: "李四", score: 96 },
  { name: "喵喵", score: 59 },
];
const introduce = arr.map(
  (val) => `${val.name}考了${val.score}，${val.score < 60 ? "不" : ""}及格`
);
console.log(introduce.join(";")); // 张三考了30，不及格;李四考了96，及格;喵喵考了59，不及格
```

### reduce 汇总(多对一)

- 形参
  - tmp 中间结果
  - item 本次数据
  - index 下标，从 1 开始

```js
const max = arr.reduce((tmp, item, index) => {
  console.log(tmp, item, index);
  // {name: "张三", score: 30} {name: "李四", score: 96} 1
  //  {name: "李四", score: 96} {name: "喵喵", score: 59} 2
  return tmp.score > item.score ? tmp : item;
});
console.log(`${max.name}考的分数最高，最高分为${max.score}`); // 李四考的分数最高，最高分为96
```

### filter 过滤

```js
const noPass = arr.filter((val) => {
  return val.score < 60;
});
console.log(`${noPass.map((v) => v.name)}未及格，需要请家长`); // 张三,喵喵未及格，需要请家长
```

### forEach 迭代

- 简化代码，但是不能在`forEach`中使用`break`、`continue`、`return`关键字

```js
arr.forEach((val) => {
  console.log(val);
  // { name: '张三', score: 30 },
  // { name: '李四', score: 96 },
  // { name: '喵喵', score: 59 },
});
```

## for-in 与 for-of

`for-in`是为普通对象设计的，适用于遍历得到字符串类型或者对象的键，而不适用于数组遍历。
在使用`for-in`遍历数组时会出现以下问题：

1. `for(let k in arr)` 中`k`的值不是数字而是字符串"0"、"1"、"2"
2. `for-in`循环体除了遍历数组元素外，还会遍历自定义属性，甚至连数组原型链上的属性都能被访问到
3. 在某些情况下，`for-in`可能按照随机顺序遍历数组元素

由于在使用`for-in`遍历数组会出现一些问题，所以`ES6`增加了`for-of`： 语法简洁，修复`for-in`的问题，可以使用`break`、`continue`、`return`关键字(相比于`forEach`)

```js
let arr = ["1", "2", "3"];
for (let i of arr) {
  console.log(i);
}
```

- 支持遍历 DOM NodeList(`for-in`遍历得到的并不是子节点)

```html
<div id="parent">
  <span>1</span>
  <span>2</span>
  <span>3</span>
  <span>4</span>
  <span>5</span>
</div>
<script>
  let parent = document.getElementById("parent");
  let child_nodes = parent.childNodes;
  for (let node of child_nodes) {
    console.log(node);
  }
  // 相当于
  for (let i = 0; i < child_nodes.length; i++) {
    console.log(child_nodes[i]);
  }
</script>
```

- 支持字符串的遍历，会把字符串作为一组 Unicode 的字符进行遍历(`for-in`也可以做到)

```js
for (var ch of "123") {
  console.log(ch);
}
```

- 还支持应用于 Map 和 Set 对象(Map 和 Set 对象还没研究，暂搁)

- **注意：** `for-of`并不适用于处理原有的原生对象(包括`JSON`对象)，处理原有的原生对象时可以使用`for-in`或者内置的`Object.keys()`

```js
let obj = {
  name: "张三",
  age: 12,
};
for (let key in obj) {
  console.log(key, obj[key]);
}
for (var key of Object.keys(obj)) {
  console.log(key, obj[key]);
}
```
