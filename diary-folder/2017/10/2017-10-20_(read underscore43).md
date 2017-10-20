# promise in ES6

如果 reject 没有设定 reject 函数, 是不会立刻报错的, 而是等到 catch 的时候再报.
```
let reject = Promise.reject(42);

....

reject.catch(() => {

});
```
所以如果需要立刻知道出错并处理的话, 那么就需要两个事件 unhandleRejection 和 rejectionHandled. 
unhandleRejection 事件和 rejectHandled 事件都是用于处理 promise 没有预设 reject 函数的, 如果 promise 发生了, 却没有对应的 reject 函数, 那么就会报错.
他们的区别就在于 unhandleRejection 事件是处理在一个事件循环中的 promise 执行情况, 而 rejectHandled 是处理一个事件循环之后的 promise 的执行情况的.
```
let rejected;

process.on('unhandleRejection', (reason, promise) => {
  console.log(reason.message);  // 'Explosion'
  console.log(rejected === promise); // true
});

reject = Promise.reject(new Error('Explosion'));
```
对于 handleRejected 事件:
```
let rejected;

process.on('rejectionHandled', function(promise){

});

setTimeout(() => {
  reject.catch((value) => {
    console.log(value);  // 'Explosion'
  });
}, 500);
```
一旦加上错误处理函数, 马上弹出错误. 这些都是全局弹出来的, 这是在 node 环境下, 在 window 下也是一样的, 只是挂载在 window 对象上而已.
而且回调中 event.type / event.promise / event.reason , type 是事件名, promise 是被拒绝的对象, reason 是 promise 拒绝值.
