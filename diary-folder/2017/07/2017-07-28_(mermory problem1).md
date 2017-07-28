# mermory problem

在做单页面应用的时候, 内存管理还是非常必要的, 因为单页面应用有可能长时间在用户设备上运行, 如果不注意又有可能消耗过多的内存, 导致页面的性能变差.

chrome 在更多设置里面有个任务管理器, 里面可以看到每个 tab 占用的内存是多少, 里面可以看到实时的 javascript 占用内存和原生的占用内存.

一般会使用 timelne 来查看内存问题, 里面会分为 js 堆, 文档, dom 节点, 监听器, GPU 来查看每个类型耗费的内存情况

一般来说, js 堆是时上升时下降的, 因为会有垃圾回收机制, 及时将无用的对象回收, DOM 节点需要看自己的需要, 监听器如果一直没有消除引用, 有可能会递增, 这时候需要使用事件代理这样的机制.

通常, DOM 节点未分离完全是最常见的内存泄漏问题, 就是说 DOM 树已经将这个 DOM 节点移除了, 但是由于 javscript 代码中依然引用, 所以就无法被垃圾回收机制收回.

```
var frag;

function createList() {
    var ul = document.createElement('ul');

    for(var i = 0; i < 10; i++) {
        var li = document.createElement('li');
        ul.appendChild(li);
    }
    frag = ul;
}

document.appendChild(frag);
```

这是一个典型的内存泄漏例子, 代码中 ul 和 li 仍然引用着 DOM 节点, 就是不在 DOM 树中, 但是存在于代码引用中.可以使用 profile tab 中的 take a heap snapshots 来查看 DOM 树的内存泄漏问题, 如果是调查节点问题就在 filter 输入 detached, 就会显示出引用的节点树, 黄色代表 js 代码直接引用, 红色代表没有直接引用, 所以我们应该把注意力放在黄色的上面.我们可以在 object tab 里面看到是哪个变量在引用这个 DOM 树, 我们只要保证在运行结束消除引用就可以了.

另外 timeline 也可以分析, timeline 一般是分析 js heap 的内存泄漏的, 可以在 record allocation timeline 中记录, 按下 start 后, 执行认为可能出现内存泄漏的操作, 然后停止, 蓝色竖线表示新内存的分配, 这个时候是最有可能发生内存泄漏的, 选择放大图像可以看到分配的内存用在哪里.
