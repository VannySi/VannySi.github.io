---
layout: post
title: 前端页面性能优化
date: 2017-04-11 14:56:36
author: Vanny
categories: Web
tags: Web
excerpt: 对一些自己遇到过的以及平时阅读文章时看到的优化方法作一个简单的总结。
---

- content
  {:toc}

## 网页内容

1.减少 http 请求次数：捆绑文件、CSS Sprites、Image Maps、Inline Images、SVG。  
2.减少 DNS 查询次数，DNS 查询一般是对首次访问响应速度有所影响。  
3.避免页面跳转。  
4.缓存 Ajax：添加 Expires 或 Cache-Control 报文头使回复可以被客户端缓存、压缩回复内容、减少 DNS 查询、精简 JavaScript、避免跳转、配置 Etags。  
5.延迟加载。  
6.提前加载：无条件提前加载、有条件加载、有预期加载。  
7.减少 DOM 元素数量：提高页面加载和脚本执行的效率。  
8.根据域名划分内容：浏览器一般对同一个域的下载连接数有所限制，按照域名划分下载内容可以使浏览器增大并行下载链接，但是注意控制域名是用在 2~4 个之间，避免 DNS 查询过慢。
一般网络规划会将静态资源放在类似于 static.example.com，动态内容放在www.example.com上，避免使用cookie。  
9.减少 iframe 数量：iframe 内容为空也消耗加载时间，还会阻止页面加载。  
10.避免 404：404 代表服务器没有找到资源，尽量避免在我们提供的网页资源上使服务器返回一个无用的结果。更糟糕的是我们网页中需要加载一个外部脚本，结果返回一个 404，不仅阻塞了其他脚本下载，下载回来的内容(404)客户端还会将其当成 Javascript 去解析。

## 服务器

1.使用 CDN。  
2.添加 Expires 或 Cache-Control 报文头：对于静态内容添加 Expires，将静态内容设为永不过期或者很长时间才会过期；对于动态内容可以使用合适的 Cache-Control，让浏览器根据条件来发送请求。  
3.Gzip 压缩传输文件。  
4.配置 ETags。**(不会)**  
5.尽早 flush 输出。**(不会)**  
6.使用 GET Ajax 请求：浏览器在实现 XMLHttpRequest POST 的时候分成两步，先发 header，然后发送数据。而 GET 却可以用一个 TCP 报文完成请求。另外 GET 从语义上来讲是去服务器取数据，而 POST 则是向服务器发送数据，所以我们使用 Ajax 请求数据的时候尽量通过 GET 来完成。  
7.避免空图片 src：空的图片 src 仍然会是浏览器发送请求到服务器，浪费时间和服务器资源。

## Cookie

1.减少 Cookie 大小：cookie 被用来做认证或个性化设置。其信息被包含在 http 报文头中。

- 去除没有必要的 cookie，如果网页不需要 cookie 就完全禁掉。
- 将 cookie 的大小减到最小。
- 注意 cookie 设置的 domain 级别，没有必要情况下不要影响到 sub-domain。
- 设置合适的过期时间，比较长的过期时间可以提高响应速度。

  2.页面内容使用无 Cookie 域名 **(不会)**：大多数网站的静态资源都没必要 cookie，我们可以采用不同的 domain 来单独存放这些静态文件，这样做不仅可以减少 cookie 大小从而提高响应速度，还有一个好处是有些 proxy 拒绝缓存带有 cookie 的内容，如果能将这些静态资源 cookie 去除，那就可以得到这些 proxy 的缓存支持。 常见的划分 domain 的方式是将静态文件放在 static.example.com，动态内容放在www.example.com。
  也有一些网站需要在二级域名上应用 cookie，所有的子域都会继承，这种情况下一般会再购买一个专门的域名来存放 cookie-free 的静态资源。

## CSS

1.样式表置顶：样式表放在网页的 HEAD 中会让网页加载速度更快，因为这样做可以使浏览器逐步加载速度更快。  
2.避免 CSS 表达式。  
3.用<link>替代@import。  
4.避免使用 Filters：这种滤镜的使用会导致图片在下载的时候阻塞网页绘制，另外使用这种滤镜会导致内存使用量的问题。

## JavaScript

1.将脚本置底。

- 把脚本置底，这样可以让网页渲染所需要的内容尽快加载显示给用户。
- 现在主流浏览器都支持 defer 关键字，可以指定脚本在文档加载后执行。
- HTML5 中新加了 async 关键字，可以让脚本异步执行。

  2.使用外部 JavaScript 和 CSS 文件。  
  3.精简 JavaScript 和 CSS。  
  4.去除重复脚本。  
  5.减少 DOM 访问。

- 缓存已经访问过的元素。
- Offline 更新节点然后再加回 DOM Tree。
- 避免通过 Javascript 修复 layout。

  6.使用智能事件处理。

## 图片

1.优化图像。  
2.优化 CSS Sprite。  
3.不要在 HTML 中缩放图片。  
4.使用小且可缓存的 favicon.ico。

## 移动客户端

1.保持单个内容小于 25KB。  
2.打包组建成符合文档。
