---
layout: post
title:  "锋利的jquery(第2版)"
date:   2017-01-23 10:48:23
author: Vanny
categories: Note
tags: jQuery
excerpt: 书中实例思考
---

* content
{:toc}

详细笔记见[锋利的jquery(第2版)](https://github.com/VannySi/vanny/blob/master/00NoteBook/05JQuery.md)

## 某网站品牌列表的效果

> 2.6 实现品牌列表的展示效果，用户进入该页面时，品牌列表默认是精简显示，用户可以单击商品列表下方的“显示全部品牌”按钮来显示全部品牌。

书内主要jquery代码:

```js
    $(function(){ //等待DOM加载完毕                              
        var $cate = $('ul li:gt(5):not(:last)');    //获取索引值大于5的品牌集合对象(除最后一条)
        var $toggleBtn = $('div.showmore > a');     //获取“显示全部品牌”按钮
        
        $cate.hide();   //隐藏上面获取到的jQuery对象
        $toggleBtn.toggle(function(){   //显示元素
            $cate.show();   //显示$cate
            $(this).find('span')
                .css('background', 'url(img/up.gif) no-repeat 0 0')
                .text('精简全部品牌');    //改变背景图片和文本
            $('ul li').filter(':contains("佳能"),:contains("尼康"),:contains("奥林尼斯")').addClass('promoted'); //添加高亮样式
            return false;   //超链接不跳转 
        },function() {  //隐藏元素
            $cate.hide();   //隐藏$cate
            $(this).find('span')
                .css('background', 'url(img/down.gif) no-repeat 0 0')
                .text('显示全部品牌');    //改变背景图片和文本
            $('ul li').removeClass('promoted'); //去掉高亮样式
            return false;   //超链接不跳转 
        });
    });
```

利用toggle()代替if判断显示还是隐藏，简化代码；通过filter()筛选出与指定表达式匹配的元素集合，顺便练习:contains选择器。

代码改进：

```js
    $(function(){ //等待DOM加载完毕                              
        var $cate = $('ul li:gt(5):not(:last)');    //获取索引值大于5的品牌集合对象(除最后一条)
        var $toggleBtn = $('div.showmore > a');     //获取“显示全部品牌”按钮
        var $text = $('ul li').filter(':contains("佳能"),:contains("尼康"),:contains("奥林尼斯")'); //获取高亮品牌对象
        
        $cate.hide();   //隐藏上面获取到的jQuery对象
        $toggleBtn.click(function() {
            $cate.toggle(); //$cate显示时隐藏，隐藏时显示
            $text.toggleClass('promoted');  //有promoted时移除，否则添加
            var $cateText = $(this).find('span');   //获取按钮的内容
            if($cateText.text() == "显示全部品牌"){
                $cateText.css('background', 'url(img/up.gif) no-repeat 0 0')
                    .text('精简全部品牌');    //改变背景图片和文本
            }else {
                $cateText.css('background', 'url(img/down.gif) no-repeat 0 0')
                    .text('显示全部品牌');    //改变背景图片和文本
            }
            return false;   //超链接不跳转 
        });
    });
```

利用toggle()和toggleClass()减少代码书写，减少绑定事件但不易理解。

## 某网站的超链接和图片提示效果

> 3.3 当鼠标移动到超链接的那一瞬间就出现图片/文字提示

书内主要jQuery代码：

```js
    $(function () {
        var x = 10;
        var y = 20;
        $('a.tooltip').mouseover(function (e) { //鼠标移入显示title
            //创建<div>元素
            this.myTitle = this.title;
            this.title = "";
            var imgTitle = this.myTitle ? "<br/>" + this.myTitle : "";
            //var tooltip = "<div id='tooltip'>" + this.myTitle + "</div>";
            var tooltip = "<div id='tooltip'><img src='" + this.href + "' alt='产品预览图'>" + imgTitle + "</div>";
            $('body').append(tooltip);  //将它追加到文档中
            // 设置坐标并且显示
            $('#tooltip')
                .css({
                    "top" : (e.pageY + y) + 'px',
                    "left" : (e.pageX + x) + 'px'
                }).show('fast');
        }).mouseout(function () {   //鼠标移出隐藏title
            this.title = this.myTitle;
            $('#tooltip').remove(); //移除
        });
    })
```

鼠标移入删除title，移出添加title解决了默认提示显示问题，通过给提示添加固定差距(10,20)分里鼠标和提示，防止出现提示闪烁情况。

代码改进：

```js
    $(function () {
        var x = 10;
        var y = 20;
        $('a.tooltip').hover(function (e) { //鼠标移到元素上显示title
            //title以data-title属性给出
            var imgTitle = $(this).data('title') ? "<br/>" + $(this).data('title') : "";
            var tooltip = "<div id='tooltip'><img src='" + this.href + "' alt='产品预览图'>" + imgTitle + "</div>";
            $('body').append(tooltip);
            $('#tooltip')
                .css({
                    "top" : (e.pageY + y) + 'px',
                    "left" : (e.pageX + x) + 'px'
                }).show('fast');
        },function () { //鼠标移出元素时隐藏title
            $('#tooltip').remove();
        });
    })
```

hover()是一个模仿悬停事件（鼠标移动到一个对象上面及移出这个对象）的方法。这是一个自定义的方法，它为频繁使用的任务提供了一种“保持在其中”的状态。当鼠标移动到一个匹配的元素上面时，会触发指定的第一个函数。当鼠标移出这个元素时，会触发指定的第二个函数。而且，会伴随着对鼠标是否仍然处在特定元素中的检测（例如，处在div中的图像），如果是，则会继续保持“悬停”状态。data()可以存放和读取元素上的数据，利用data可以避免title属性的默认样式，简化代码。

## 视频展示效果实例

> 4.3 用户可以单击左上角的左右箭头，来控制视频展示的左右滚动。

