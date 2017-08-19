# Parent-child component communication

我觉得组件通信, 父子组件通信就足够了, 至于兄弟组件, 就是兄弟 1 将事件传到共同的父组件,然后父组件分发事件到对应的子组件.
父子组件的通信除了之前说的 props, 就是平时用的 emit, dispatch, 子组件在修改了某个属性或者做了某些操作之后发送一个 emit 事件, 在父组件中, 父组件的数据属性发生变化或者发生了某个事件的时候, 就可以使用 dispatch 事件, 然后子组件就可以接收相关的信息作出一定的变化.

其实总的来说就是两个方向: dispatch 向父链传播(冒泡), broadcast 向子链传播(广播):
简单地来说, 其实核心方法就是 emit:
```
exports.$emit = function (event, val) {
    let cbs = this._events[event];
    let shouldPropagate = true;
    if (cbs) {
        shouldPropagate = false;
        // 遍历执行事件
        let args = new Array(Array.from(arguments)[1]);
        cbs.forEach((cb) => {
            let res = cb.apply(this, args);
            // 就是这里, 决定了"只有当events事件返回true的时候, 事件才能在触发之后依然继续传播"
            if (res === true) {
                shouldPropagate = true;
            }
        });
    }

    return shouldPropagate;
};
```
其中 this._events 就是子组件初始化的时候, 存放的所有事件和它的回调函数.
当 emit 事件的时候, 取相对应的事件回调, 然后逐个执行, 如果是需要继续传播, 那就就返回 true, 也就是 shouldPropagate, 否则停止继续传播.

每个组件都有这个 emit 方法的.
然后如果是 dispatch 向上也就是向父链传播, 那么就是取该组件的父组件数组($parent), 然后循环遍历父组件,逐个执行他们的 emit 函数(相应的事件).
如果是向下也就是向子链广播事件, 那就是取该组件的子组件数组($children), 然后循环遍历子组件执行他们的 emit 函数(对应事件).