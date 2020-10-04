---
layout: post
title: 锋利的jquery(第2版)
date: 2017-01-23 10:48:23
author: Vanny
categories: Note
tags: jQuery
excerpt: 书中实例思考
---

- content
  {:toc}

详细笔记见[锋利的 jquery(第 2 版)](https://github.com/VannySi/vanny/blob/master/00NoteBook/05JQuery.md)

## 某网站品牌列表的效果

> 2.6 实现品牌列表的展示效果，用户进入该页面时，品牌列表默认是精简显示，用户可以单击商品列表下方的“显示全部品牌”按钮来显示全部品牌。

书内主要 jquery 代码:

```js
$(function () {
  //等待DOM加载完毕
  var $cate = $("ul li:gt(5):not(:last)"); //获取索引值大于5的品牌集合对象(除最后一条)
  var $toggleBtn = $("div.showmore > a"); //获取“显示全部品牌”按钮

  $cate.hide(); //隐藏上面获取到的jQuery对象
  $toggleBtn.toggle(
    function () {
      //显示元素
      $cate.show(); //显示$cate
      $(this)
        .find("span")
        .css("background", "url(img/up.gif) no-repeat 0 0")
        .text("精简全部品牌"); //改变背景图片和文本
      $("ul li")
        .filter(':contains("佳能"),:contains("尼康"),:contains("奥林尼斯")')
        .addClass("promoted"); //添加高亮样式
      return false; //超链接不跳转
    },
    function () {
      //隐藏元素
      $cate.hide(); //隐藏$cate
      $(this)
        .find("span")
        .css("background", "url(img/down.gif) no-repeat 0 0")
        .text("显示全部品牌"); //改变背景图片和文本
      $("ul li").removeClass("promoted"); //去掉高亮样式
      return false; //超链接不跳转
    }
  );
});
```

利用 toggle()代替 if 判断显示还是隐藏，简化代码；通过 filter()筛选出与指定表达式匹配的元素集合，顺便练习:contains 选择器。

代码改进：

```js
$(function () {
  //等待DOM加载完毕
  var $cate = $("ul li:gt(5):not(:last)"); //获取索引值大于5的品牌集合对象(除最后一条)
  var $toggleBtn = $("div.showmore > a"); //获取“显示全部品牌”按钮
  var $text = $("ul li").filter(
    ':contains("佳能"),:contains("尼康"),:contains("奥林尼斯")'
  ); //获取高亮品牌对象

  $cate.hide(); //隐藏上面获取到的jQuery对象
  $toggleBtn.click(function () {
    $cate.toggle(); //$cate显示时隐藏，隐藏时显示
    $text.toggleClass("promoted"); //有promoted时移除，否则添加
    var $cateText = $(this).find("span"); //获取按钮的内容
    if ($cateText.text() == "显示全部品牌") {
      $cateText
        .css("background", "url(img/up.gif) no-repeat 0 0")
        .text("精简全部品牌"); //改变背景图片和文本
    } else {
      $cateText
        .css("background", "url(img/down.gif) no-repeat 0 0")
        .text("显示全部品牌"); //改变背景图片和文本
    }
    return false; //超链接不跳转
  });
});
```

利用 toggle()和 toggleClass()减少代码书写，减少绑定事件但不易理解。

## 某网站的超链接和图片提示效果

> 3.3 当鼠标移动到超链接的那一瞬间就出现图片/文字提示

书内主要 jQuery 代码：

```js
$(function () {
  var x = 10;
  var y = 20;
  $("a.tooltip")
    .mouseover(function (e) {
      //鼠标移入显示title
      //创建<div>元素
      this.myTitle = this.title;
      this.title = "";
      var imgTitle = this.myTitle ? "<br/>" + this.myTitle : "";
      //var tooltip = "<div id='tooltip'>" + this.myTitle + "</div>";
      var tooltip =
        "<div id='tooltip'><img src='" +
        this.href +
        "' alt='产品预览图'>" +
        imgTitle +
        "</div>";
      $("body").append(tooltip); //将它追加到文档中
      // 设置坐标并且显示
      $("#tooltip")
        .css({
          top: e.pageY + y + "px",
          left: e.pageX + x + "px",
        })
        .show("fast");
    })
    .mouseout(function () {
      //鼠标移出隐藏title
      this.title = this.myTitle;
      $("#tooltip").remove(); //移除
    });
});
```

鼠标移入删除 title，移出添加 title 解决了默认提示显示问题，通过给提示添加固定差距(10,20)分里鼠标和提示，防止出现提示闪烁情况。

代码改进：

```js
$(function () {
  var x = 10;
  var y = 20;
  $("a.tooltip").hover(
    function (e) {
      //鼠标移到元素上显示title
      //title以data-title属性给出
      var imgTitle = $(this).data("title")
        ? "<br/>" + $(this).data("title")
        : "";
      var tooltip =
        "<div id='tooltip'><img src='" +
        this.href +
        "' alt='产品预览图'>" +
        imgTitle +
        "</div>";
      $("body").append(tooltip);
      $("#tooltip")
        .css({
          top: e.pageY + y + "px",
          left: e.pageX + x + "px",
        })
        .show("fast");
    },
    function () {
      //鼠标移出元素时隐藏title
      $("#tooltip").remove();
    }
  );
});
```

hover()是一个模仿悬停事件（鼠标移动到一个对象上面及移出这个对象）的方法。这是一个自定义的方法，它为频繁使用的任务提供了一种“保持在其中”的状态。当鼠标移动到一个匹配的元素上面时，会触发指定的第一个函数。当鼠标移出这个元素时，会触发指定的第二个函数。而且，会伴随着对鼠标是否仍然处在特定元素中的检测（例如，处在 div 中的图像），如果是，则会继续保持“悬停”状态。data()可以存放和读取元素上的数据，利用 data 可以避免 title 属性的默认样式，简化代码。

## 视频展示效果实例

> 4.3 用户可以单击左上角的左右箭头，来控制视频展示的左右滚动。

```js
$(function () {
  var page = 1; // 当前版面数
  var i = 4; // 美版的图片数
  $("span.next").click(function () {
    //绑定click事件
    var $parent = $(this).parents("div.v_show"); //根据当前单击的元素获取到父元素
    var $v_show = $parent.find("div.v_content_list"); //找到“视频内容展示区域”
    var $v_content = $parent.find("div.v_content"); //找到“视频内容展示区域”外围的div

    var v_width = $v_content.width() - 20; //获取区域内容的宽度，带单位
    var page_count = Math.ceil($v_show.find("li").length / i); //总版面数
    if (!$v_show.is(":animated")) {
      //判断“视频内容展示区域”是否正在处于动画
      if (page == page_count) {
        //已经到最后一个版面了，如果再向后必须跳转到第一个版面
        $v_show.animate({ left: "0px" }, "slow"); //通过改变left值，跳转到第一版面
        page = 1;
      } else {
        $v_show.animate({ left: "-=" + v_width }, "slow"); //改变left值，大道每次切换一个版面
        page++;
      }
      //给指定的span元素添加current样式，然后去掉span元素的同辈元素上的current样式
      $parent
        .find("span")
        .eq(page - 1)
        .addClass("current")
        .siblings()
        .removeClass("current");
    }
  });
  $("span.prev").click(function () {
    //绑定click事件
    var $parent = $(this).parents("div.v_show"); //根据当前单击的元素获取到父元素
    var $v_show = $parent.find("div.v_content_list"); //找到“视频内容展示区域”
    var $v_content = $parent.find("div.v_content"); //找到“视频内容展示区域”外围的div

    var v_width = $v_content.width() - 20; //获取区域内容的宽度，带单位
    var page_count = Math.ceil($v_show.find("li").length / i); //总版面数
    if (!$v_show.is(":animated")) {
      //判断“视频内容展示区域”是否正在处于动画
      if (page == 1) {
        //已经到第一个版面了，如果再向后必须跳转到第一个版面
        $v_show.animate({ left: "-=" + v_width * (page_count - 1) }, "slow"); //通过改变left值，跳转到最后一个版面
        page = page_count;
      } else {
        $v_show.animate({ left: "+=" + v_width }, "slow"); //改变left值，大道每次切换一个版面
        page--;
      }
      //给指定的span元素添加current样式，然后去掉span元素的同辈元素上的current样式
      $parent
        .find("span")
        .eq(page - 1)
        .addClass("current")
        .siblings()
        .removeClass("current");
    }
  });
});
```

通过判断是否在动画中决定是否再次执行动画避免了“当快速单击‘向右’按钮时，单击产生的动画会追加到动画队列中，从而出现放开光标后，图片还在继续滚动的情况。”。但个人感觉上述代码比较繁琐，像求总版面数以及获取的 jquery 元素等没有必要重复获取等，动画也可以封装函数以便反复利用。

代码改进：

```js
$(function () {
  var page = 1; // 当前版面数
  var i = 4; // 每版的图片数
  var $parent = $("div.v_show"); //根据当前单击的元素获取到父元素
  var $v_show = $parent.find("div.v_content_list"); //找到“视频内容展示区域”

  var v_width = $parent.find("div.v_content").width() - 20; //获取区域内容的宽度，带单位
  var page_count = Math.ceil($v_show.find("li").length / i); //总版面数
  $("span.next").click(function () {
    //绑定click事件
    carousel($v_show, page + 1);
  });
  $("span.prev").click(function () {
    //绑定click事件
    carousel($v_show, page - 1);
  });
  $(".highlight_tip span").click(function () {
    //绑定click事件,点击原点跳到指定版页
    if (!$(this).hasClass("current")) {
      var page = $(this).index();
      console.log(page);
      carousel($v_show, page + 1);
    }
  });
  setInterval(function () {
    //每隔10s自动跳转下一版面，即轮播
    carousel($v_show, page + 1);
  }, 10000);
  function carousel(ele, count) {
    if (!ele.is(":animated")) {
      //判断“视频内容展示区域”是否正在处于动画
      if (count > page_count) {
        //已经到最后一个页面了，如果再向后必须跳转到第一个页面
        page = 1;
      } else if (count < 1) {
        //已经到第一个版面了，如果再向前必须跳转到最后一个版面
        page = page_count;
      } else {
        page = count;
      }
      ele.animate({ left: "-" + v_width * (page - 1) }, "slow"); //改变left值，大道每次切换一个版面
      //给指定的span元素添加current样式，然后去掉span元素的同辈元素上的current样式
      ele
        .parents("div.v_show")
        .find("span")
        .eq(page - 1)
        .addClass("current")
        .siblings()
        .removeClass("current");
    }
  }
});
```

对动画进行了封装，并添加了轮播以及点击原点跳转到指定版页，简化代码；但这个只适合一页只有这一个轮播的情况，如果需要多个，可自行修改少部分代码实现。
