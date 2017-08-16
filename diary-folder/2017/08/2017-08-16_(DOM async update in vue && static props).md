# DOM async update in vue && static props

## DOM async update
Vue 的异步更新是需要理解的，需要理解为什么这么做以及我们日常开发怎么样才能避开这样的 bug。
作者为什么要异步更新呢？高性能里面有说 DOM 其实就是一个浏览器的接口，而一个形象的比喻就是 Javascript 和 DOM 是两座孤岛，在这两座孤岛之间来回是需要一定代价的，所以尽量减少在这两座孤岛上来回，而对于 vue 来说，因为数据驱动，可能会导致数据被修改了两到三次，这个时候如果数据双向绑定修改了 DOM 两到三次，那么就会损耗了很多性能，所以会倾向于将最后一个修改才进行更新，其中就是利用批处理和异步更新的思想。
所谓批处理就是将 watch 的更新函数全部推到一个队列里面，然后逐个地去更新，而队列里面的更新函数则是每个相同 id 的 watcher 的更新函数只有一个，这样保证了多次改动数据只更新一次，保证 DOM 操作次数不会过多。
其实是主要要理解下面这段代码:
```
/**
 * 批处理重置
 */
Batcher.prototype.reset = function () {
    this.has = {};
    this.queue = [];
    this.waiting = false;
};

/**
 * 将事件添加到队列中
 * @param job {Watcher} watcher事件
 */
Batcher.prototype.push = function (job) {
    if (!this.has[job.id]) {
        this.queue.push(job);
        this.has[job.id] = job;
        if (!this.waiting) {
            this.waiting = true;
            setTimeout(() => {
                this.flush();
            });
        }
    }
};
```
在脑子里一天了, 终于将脑子转了过来, 之前一直疑惑, 如果每次只推一个 watcher, 那岂不是只有第一个被执行了? 也就是 this.has][job.id], 其实我一开始理解有误, 其实 job 也就是一个 watcher, 而对于 watcher 来说可以看作是一个事件, 事件就是比如我修改了 test 这个变量, 我修改了 foo 这个变量这样的事件. 所以队列里面只有一个 watcher 是正确的, 而在 flush 清洗队列的时候, 会将 job 中的回调执行, 回调执行也就是更新 DOM 的时候, 就会去拿取变量最新的值, 所以这个时候根本不用关心多次修改变量值的问题, 如果将 DOM 修改动作变为了异步, 肯定是只有一次并且是最新的值.
has 是为了不让重复添加, queue 是任务队列, flush 是逐个执行回调, reset 是为了在一个事件循环之后清空任务队列和任务 id hash 映射, 保证下一次事件循环正确. waiting 是为了保护 flush 不会在一次事件循环中执行两次, 比如修改了 name, 再修改 name, 现在 name 已经在队列里面了并且已经异步执行 flush 了, 所以没必要再执行一次 flush. 
## static props
对于静态 props, 其实没有多少知识点, 如果之前了解过模板引擎, 也就是 vue 的将 template 渲染成真正的 DOM 结构的那个过程, 静态 props 的传递应该非常简单, 其实就是将组件替代符
<components></components> 上面的 props 属性解析出来, 然后合并到组件的 data 属性上, 以便组件可以使用双花括号来解析出值.