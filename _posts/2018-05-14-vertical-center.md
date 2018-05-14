---
layout: post
title:  "CSS如何实现垂直居中"
date:   2018-05-14 23:30:45
author: Vanny
categories: css
tags: css
excerpt: 时隔一年多，相同的面试题，我这次居然没回答上来，感觉自己可以找块豆腐撞死了...
---

### 1. vertical-align

将`div`设置为`table`格式，然后用`vertical-align`实现。该方法外层省略`display: table`，但是外面不套`display: table`可能会引发其它样式问题，例如设置`margin`无效。具体可以看[这里](http://www.zhangxinxu.com/wordpress/2010/10/%E6%88%91%E6%89%80%E7%9F%A5%E9%81%93%E7%9A%84%E5%87%A0%E7%A7%8Ddisplaytable-cell%E7%9A%84%E5%BA%94%E7%94%A8/)

```css
.parent {
    display: table;
}
.child {
    display: table-cell;
    vertical-align: middle;
}
```

[Demo](../_example/)
