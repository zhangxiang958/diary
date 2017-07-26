# IFC & BFC again


继昨天那个问题， 我发现一个调试的技巧（个人用），就是如果发现 inline-block 在垂直对齐问题上效果不符合预期， 可以设置 vertical-align: baseline; 这样你可以发现他们的基线是否在统一水平线上，然后再细看 bug。
昨天的例子可以试试我的加上 overflow: hidden; / vertical-align:top，你会发现两个盒子对齐了， 但是如果父盒子还有文字， 也就是匿名盒子（行内文字）， 行内文字是不会自动与前两个盒子对齐的， 因为还是与基线对齐， 符合规范。

然后发现引申出一个 IFC 的特性, 也就是行内盒子模型. 之前已经看过 BFC 了，这里结合着来看， 当做是复习一下。

## IFC
IFC 规定的是行内的盒子从左到右的排列顺序.它被一个 line box 的东西包裹住, 

IFC 内部不可能有两个块级元素，可以试试在 p 标签里面嵌入 div， 它会变为两个 p 元素
```
<p>
    789
    <div>123</div>
    <div>456</div>
    000
</p>
```

行级元素的高度计算需要分类别: 对于替换元素, inline-block, inline-table 这些, 元素高度为他们的 margin-box, 对于行内匿名盒子, 高度为 line-height.
```
<div id="text" style="border: 1px solid #ccc;height:15rem;">
    <span style="vertical-align:bottom;border: 1px solid #ccc;display:inline-block;height:2rem">假设我是一个有内容的inline-block</span>
    <span style="border: 1px solid #ccc;font-size:5rem;vertical-align:baseline;">我的fontSize=5rem</span>
    <span style="vertical-align:baseline;border: 1px solid #ccc;display:inline-block;height:2rem;width:1rem;"></span>
    我是一个不存在的x
</div>
```

vertical-align 是用于将元素的基线与父元素的基线对齐的, 它是用于调整元素的基线位置的.

## BFC 
BFC 之所以需要程序员自己去触发, 就是因为 BFC 耗费性能, 应该在需要的时候再触发
对于 display 为 inline-block, inline-cell 都会有, overflow 不是默认值, 绝对定位与浮动元素, 根元素, 都会触发 BFC, 与之相对应的是 hasLayout 属性, 兼容 IE, 严格模式下使用 width, height 块级元素, 混杂模式只要指定了 width, height, 设定 zoom 属性都会,  像替换元素本身就有 BFC 的.
BFC, haslayout 都会将子元素限制在一个盒子里面, 布局不影响外部元素.
可以阻止外边距折叠, 包含浮动元素(浮动元素高度计算在内), 阻止浮动元素覆盖.

## 基线位置
个人觉得 inline-block 会出现比较多奇怪的问题就在于基线的位置是不定的, 所以很多时候会导致一些奇怪的对齐问题出现.
我觉得理解基线有助于理解很多对齐的 bug, 基线是什么？
```
i) If inline-block in question has its overflow property set to visible (which is by default so no need to set though). Then its baseline would be the baseline of the containing block of the line.

ii) If inline-block in question has its overflow property set to OTHER THAN visible. Then its bottom margin would be on the baseline of the line of containing box.
```
当 inline-block 的 overflow 为默认值也就是 visible 的时候, 它的基线位置就是父元素的基线, 对于 inline-block 的 overflow 不为 visible 的时候, 就是 margin 的 bottom .


links:

http://www.zhangxinxu.com/wordpress/2010/05/%E6%88%91%E5%AF%B9css-vertical-align%E7%9A%84%E4%B8%80%E4%BA%9B%E7%90%86%E8%A7%A3%E4%B8%8E%E8%AE%A4%E8%AF%86%EF%BC%88%E4%B8%80%EF%BC%89/

https://github.com/FE-Girl/MyBlog/issues/6

https://blog.noteawesome.com/2016/05/10/%E8%AE%BE%E7%BD%AE-text-overflow-ellipsis-%E5%90%8E%E5%BC%95%E8%B5%B7%E7%9A%84%E6%96%87%E6%9C%AC%E5%AF%B9%E9%BD%90%E9%97%AE%E9%A2%98/

https://stackoverflow.com/questions/12950479/why-does-this-inline-block-element-have-content-that-is-not-vertically-aligned

https://stackoverflow.com/questions/9273016/why-is-this-inline-block-element-pushed-downward