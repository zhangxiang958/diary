# SEO && javascript tips

之前对 SEO 都不太熟悉, 来学习一下:
首先我们需要知道通常我们的网页是怎么出现在搜索引擎上的, 搜索引擎使用机器人也就是爬虫, 通过算法自动将网页内容获取然后
记录起来, 建立索引, 通过分析分词和搜索技术知道用户的搜索行为, 然后返回相对应的结果.
google 甚至会进行将内容分类.

一般来说, 像比较封闭的网页都不需要 SEO, 因为怕泄漏用户信息, 像 QQ 空间这些, 但是大量的网页是需要 SEO 的, 因为只有带来流量才能来带价值.

所以没有使用 javascript 的网页也能渲染的网页 SEO 会相对较好, 但是 google 爬虫目前是可以支持从内存中爬出 javascript 动态渲染的内容的, 另外网站速度快也能将网站排名提前.
另外就是 html 的语义化需要足够好, 以前经常看到 html 标签里面会有 role 属性, 这是为了和引擎说明这个标签的使用用途,
方便爬虫和引擎进行分类.

## tips
使用 void 0 代替 undefined. 因为 undefined 不是一个保留词, 而且只是全局对象的一个属性(IE 8 下会变成变量).
undefined 在全局作用域下不能被重写, 但是在局部作用域就可以.
```
(function(){
  var undefined = 10;

  alert(undefined);
}());
```

所以 undefined 是不安全的, 需要被替换, 但是为什么要用 void 0? void 命令符后面不管是什么表达式, 最后的值都是 undefined, 所以可以完美替代 undeined, 而且在一些压缩工具里面, 在压缩的时候都是使用 void 0 来代替 undefined 来节省字节数的, 至于为什么是 void 0, 因为 void 0 是最短的.