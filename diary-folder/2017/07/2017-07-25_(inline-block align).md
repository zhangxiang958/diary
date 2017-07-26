# inline-block align

发现 inline-block 的对齐问题非常让人头疼, 往往在一些文字与图标对齐的问题上纠结很久, 不能随心所欲地写 CSS.

## 工作中的 BUG
```
&_nick {
    display: inline-block;
    max-width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 800;
    white-space: nowrap;
    background: yellow;
    //vertical-align: baseline;
}
&_location {
    display: inline-block;
    width: 30%;
    color: #999;
    background: red;
    //vertical-align: baseline;
    // overflow: hidden;
}
```
就是上面这段代码，在对齐问题上非常头疼，nick 与 location 无法对齐， location 下沉了 9 个 px 左右， 像这样：http://jsfiddle.net/KgqJS/88/
然后通过给他们各自都设置 vertical-align:baseline; 发现没有任何变化，这就说明它们的行为是符合规范的，对齐问题就转为了基线对齐问题。
对于 inline-block 的基线问题，规范说明 inline-block 的基线的位置在它内容（文字）的最后一个字的下方， 如果这个 inline-block 加上了 overflow 属性的话， 那么基线就在它盒子的 margin 底部。
那就是因为上面的盒子为了加上文字溢出添加了 overflow 属性导致基线在盒子的 margin 的底部， 然后 location 的基线在文字的下方， 为了对齐 nick 的基线， 只能让自己下沉来对齐 nick 的基线， 所以这里解决 bug 可以通过 overflow: hidden; 或者是 vertical-align: top; 来解决问题。
我觉得遇到问题还是需要深入思考，并不能依照网上说的 vertical-align: top；来解决， 网上的答案普遍没有深入讲。
