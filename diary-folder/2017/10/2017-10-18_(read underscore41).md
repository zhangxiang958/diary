# promise in ES61

最近在调客户端接口, 发现一个严重的问题, 我把 promise 当回调用了! 这样非常不好, 重新审视了一下自己在 promise 的知识, 虽然之前有试过去实现一遍
promise, 但是也仅限于 resolve 与 reject 两个 API.对于 promise 用的拙劣, 在于自己对于 promise 的整体还缺少认识.
如果调用 then 方法, 会将函数放到 job queue 里面, 当 promise 方法完成的时候, 会逐个将 job queue 里面的函数异步地执行.
在异步编程里面有事件, 回调. 事件有什么缺点? 事件是用于简单的交互, 因为如果多个独立的事件加起来, 你会很难去维护, 简单的情况就是如果你单击按钮再绑定事件将没有任何效果.
而回调就是将函数作为参数传入, 当完成了某些操作之后执行某个函数, 但是如果回调多了之后就会有回调地狱, 而回调地狱不仅是缩进问题, 还是一个代码追踪问题, 一旦出现问题会很难追踪,
而且很难维护.
如果我们需要多个异步操作之后才执行一个函数的话, promise 会是一个很好的选择.
当然, promise 需要内部状态, 因为如果没有状态的帮助, 那么会有问题的.试想一下, 如果我们在异步函数执行之后, 或者这个函数根本就不是异步函数, 但是使用了 promise, 在这个之后
我们才去使用 then 来添加一下后续的步骤.这个时候就需要使用内部状态来判断了, 到底这个 promise 执行过了吗, 如果执行了, 那么就直接调用 then, 如果不是则等待状态变化.