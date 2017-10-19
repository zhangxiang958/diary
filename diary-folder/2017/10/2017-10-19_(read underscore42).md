# promise in ES6

promise 的内部状态有三个, 第一就是 pending 正在进行中,  有人可能会说为什么不是分为已处理与未处理的两种状态, 确实这两种状态会简单很多,但是意义确不明, pending 一下子就可以说明
了这个函数是正在执行, 而且还有另外两个状态, 第一就是 fulfilled 说明操作成功, 第二就是 rejected 说明操作失败了.有了这三个状态的说明, 我们在随意地绑定 then 任务队列都不怕了.
因为内部存储了这个函数的状态, 所以即使这个函数不是异步的或者异步操作已经完成了, 我们像这样:
```
var promise = new Promise(() => {
  ...
});

...

promise.then(() => {

}, () => {

});

```
这样比回调要灵活与方便, 可读性高得多. promise 的 then 方法应该和 catch 一起用, 这样能够更好地处理异步的结果:
```
function readFile() {
  return new Promise((resolve, reject) => {
    .....
    if(result) {
      resolve(result);
    } else {
      reject(result);
    }
  }); 
}

let promise = readFile();

promise.then(() => {

}, () => {

})
.catch(() => {

});
```
其实 promise 不全是用异步, 可以用做非异步传输数据, Promise.resolve() 函数或者 Promise.reject() 函数就是可以传递非 thenable 对象的, 
Promise.resolve(42); 或者 Promise.reject(1) 这样使用 then 函数就可以获取到数据了, 只是 Promise.resolve 的话就永远不会执行到 reject, 而 Promise.reject 的话就永远不会执行
到 resolve.
```
var thenable = {
  then: function(resolve, reject){
    reject(42);
  }
};

Promise.resolve(thenable)
.then((data) => {
  console.log(data);
});
```
但是如果状态相反了就会报错. 所以 catch 就会执行了.