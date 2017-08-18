# dynamic props

说到动态 props 绑定，就要说说 vue 数据双向绑定的三大核心，observer， watcher， directive 。其实动态 props 属性就是三大核心的又一次合作。
动态 props 属性，说到底就是需要在父组件修改自身绑定的 data 的时候，然后通知子组件 props 已经发生变化，然后我们知道其实子组件绑定的 props 其实是加入到了子组件的 data 属性里面的，那就是说在父组件修改自身的 data 属性的时候，然后子组件的数据也跟着变化，子组件 data 属性变化后就执行相应的更新 DOM 函数。

所谓指令, 就是:
```
function Directive(name, el, vm, expression) {
    this.name = name;  // 指令的名称， 对于普通的文本节点来说，值为"text"
    this.el = el;              // 指令对应的DOM元素
    this.vm = vm;          // 指令所属bue实例
    this.expression = expression;       // 指令表达式，例如 "name"
    this.attr = 'nodeValue';        
    this.update();
}

// 这是指令的更新方法。当对应的数据发生改变了，就会执行这个方法
// 可以看出来，这个方法就是用来更新nodeValue的
Directive.prototype.update = function () {
    this.el[this.attr] = this.vm.$data[this.expression];
    console.log(`更新了DOM-${this.expression}`);
};
```
原本我们可以在全局添加一个事件, 当数据发生变化的时候, 就通知元素进行变化, 但是这样不管修改哪个属性, DOM 元素都会全部修改, 而且不是修改哪个数据改哪里而是全局修改, 这样性能会比较差.
那么我们就采用指令, 将每个数据和 DOM 独立绑定在一起, 当数据发生改变的时候, 由独立的指令来执行 DOM 更新函数.
指令是 watcher 是一个子集, 指令是特指当数据发生变化的时候更新函数是操作 DOM 的函数, 而 watcher 既可以是指令, 也可以是 $watcher, 这时候的 $watcher 的更新函数就是自定义的函数.
那么动态 props 也是用了指令这一套, 只是当父组件中的 data 属性修改的时候, 也就是 props 修改的时候, 利用指令, 更新(修改)子组件的 data 属性(因为子组件的 props 是嵌入到子组件的 data 属性里面的), 那么子组件本身的 data 属性是和 DOM 数据双向绑定的, 那么这时候就可以实现动态 props 绑定了. 