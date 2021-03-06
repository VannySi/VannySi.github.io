---
layout: post
title: 前端路由系统
date: 2017-05-17 18:41:32
author: Vanny
categories: Web
tags: Web
excerpt: 前端路由的实现原理
---

- content
  {:toc}

> 参考：[(译)Web 开发中前端路由实现的几种方式和适用场景](http://blog.csdn.net/xllily_11/article/details/51820909)

## 路由

百度解释：路由（routing）是指分组从源到目的地时，决定端到端路径的网络范围的进程。
维基解释：Routing is the process of selecting a path for traffic in a network, or between or across multiple networks.
网友解释：路由是根据不同的`url`地址展示不同的内容或页面

## 前端路由

大多数情况下，页面是通过服务端根据不同的路由返回不同的页面实现的。而在一些情况下，后端不会给前端提供路由，前端需要达到一些效果就需要自己实现一套路由，由此形成了前端路由。

`AJAX`的应用、`DOM`的动态变化等使页面可以在不改变路由的情况下局部甚至是全局进行刷新，极大的提高了用户体验，但同时也带来了一些问题，用户无法去直接通过改变`url`来获取刚才或者是 Ta 想获取的任一页面，之后单页应用`SPA`的产生、前后端的完全分离这一问题更加明显，前端路由因此诞生了。

通过路由来记录页面上`AJAX`的变化的方式被称为`AJAX标签化`，如`Pjax`。而对于较大的(特别是`SPA`)框架被称为路由系统 ，比如`ngRoute`、`React Router`、`Vue Router`。

## 实现原理

监听路由的变化 => 请求 Ajax/其它逻辑操作

### history 模式

`popstate`可以监听到历史记录，当发生调用历史记录(`history.go()`、`history.forward()`、`history.back()`) 时触发`popstate`事件，之后借助`location`、`history.length`、`history.state`等对页面进行相应操作，历史记录只能使用`pushState/replaceState`事件`push`到当前历史栈和`replace`当前地址 ，前进`history.forward()`，后退`history.back()`， 跳转`history.go()`，获取历史栈的大小`history.length`，当前页的状态`state`、`title`、`url`， 不能进行除此外其它操作。

```html
<p>这是第<span id="coord">1</span>页哦</p>
<p>
  <a href="?x=2" onclick="go(1); return false;">跳转到第2页</a>
</p>
<script>
  // 当前页面
  var currentPage = 1;
  // 点击链接执行该函数
  function go(d) {
    // 更新页码， event是go()压入栈的信息，里面包含state、title、url
    setupPage(currentPage + d);
    // 压栈：state = 当前页码， title = 当前标题，url = 当前location.search
    history.pushState(currentPage, document.title, "?x=" + currentPage);
  }
  // 点击浏览器的返回按钮时会触发
  onpopstate = function (event) {
    console.log("你触发了popstate事件哟~");
    // 更新页码， event是go()压入栈的信息，里面包含state、title、url，这里的event.state为页码
    setupPage(event.state);
  };
  // 更新页码 @param page 跳转到第page页
  function setupPage(page) {
    // 当前页改变
    currentPage = page;
    // 更新标题
    document.title = currentPage;
    // 更新页码
    document.getElementById("coord").textContent = currentPage;
    // 更新a标签里的链接
    document.links[0].href = "?x=" + (currentPage + 1);
    // 更新a标签里的内容
    document.links[0].textContent = "跳转到第" + (currentPage + 1) + "页";
  }
</script>
```

### hash 模式

`hashchange`可以实时的监听`hash`是否发生变化，当 hash 变化时可以使用`location.hash`对页面进行操作

```html
<p>这是第<span id="coord">1</span>页哦</p>
<p>
  <a href="" onclick="go(1); return false;">跳转到第2页</a>
</p>

<script>
  var currentPage = 1;
  function go(d) {
    // 更新本页面的hash
    window.location.hash = "#/hash?x=" + (currentPage + d);
  }
  onhashchange = function (event) {
    // 更新页码，event包含了newURL、oldURL等信息，getQueryString用于获取x的值
    setupPage(parseInt(getQueryString("x", "hash")));
  };
  // 更新页码 @param page 跳转到第page页
  function setupPage(page) {
    // 当前页改变
    currentPage = page;
    // 更新标题
    document.title = currentPage;
    // 更新页码
    document.getElementById("coord").textContent = currentPage;
    // 更新a标签里的内容
    document.links[0].textContent = "跳转到第" + (currentPage + 1) + "页";
  }
  function getQueryString(key, method) {
    var url = method === "hash" ? window.location.hash : window.location.href;
    var url_arr;
    if (url.indexOf("?") !== -1) {
      url = url.split("?");
      url_arr = url[1].split("&");
      for (var k in url_arr) {
        var tmp = url_arr[k].split("=");
        if (tmp[0] === key) {
          return tmp[1];
        }
      }
      url = url[0];
    }
    url_arr = url.split(/[\\/]/);
    for (var n in url_arr) {
      if (url_arr[n] === key) {
        return url_arr[parseInt(n) + 1];
      }
    }
    return false;
  }
</script>
```

### history 与 hash 的区别

1. `history`可以记录状态值`state`，可以根据状态的不同进行操作，`hash`不能
2. `hash`的兼容性比`history`要好一些(附图)，而且很容易去实现兼容 IE， `history`只兼容到 IE11，`hash`兼容到 IE8，如果还要继续向下兼容，可以很容易的自己写一个

```js
// hashchange事件失效时
var oldHash = location.hash;
setInterval(function () {
  var newHash = location.hash;
  if (newHash !== oldHash) {
    setupPage(parseInt(getQueryString("x", "hash")));
  }
}, 100);
```

![hashchange兼容性](http://oq3gl9316.bkt.clouddn.com/hashchang.png)
![popstate兼容性](http://oq3gl9316.bkt.clouddn.com/history.png)

## history 中 state 的用法

`state`是压栈`pushState`和替换`replaceState`可以传入的一个状态，这个状态无限制，可以是上面例子中的数字，也可以是字符串、数组、对象等等，在触发`popstate`事件时可以根据状态的不同进行不同操作。

```js
/**
 * 假设现在有三个历史记录，分别是
 * 1)state1 = {
 *    name: 'a',
 *    page: './a2.html'
 * };
 * history.pushState(state1, title1, './a1.html'); //记录1
 * 2)state2 = {
 *    name: 'b',
 *    bomb: true
 * };
 * history.pushState(state2, title, './b.html'); //记录2
 * 3)history.pushState(null, title, './c.html'); //记录3
 * 现在历史栈里是['记录1', '记录2', '记录3']
 */
onpopstate = function (event) {
  // 第一次点返回按钮时，event获取到的是记录3的信息，记录3的state为空，所以不进行操作，正常返回c.html
  // 判断event.state是否为空
  if (event.state) {
    var state = event.state;
    // 第二次点返回按钮时，event获取到的是记录2的信息，记录2的state中bomb为true，所以先弹框，之后正常返回b.html
    if (state.bomb) {
      alert("这是弹框哟");
    }
    // 第三次点返回按钮时，event获取到的是记录1的信息，记录1的state中page存在
    // 所以跳转到a1.html而不是a2.html，达到重定向的效果
    if (state.page) {
      window.location.href = state.page;
    }
  }
};
```
