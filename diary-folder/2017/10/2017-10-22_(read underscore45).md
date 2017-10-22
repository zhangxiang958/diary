# promise in ES6

promise 在解决回调地狱的时候, 利用的就是 promise 的串联能力.
```
let proimise = new Promise();

promise.then(() => {

})
.then(() => {

});
```
这样就可以顺序调用相互依赖的函数了, 所以我们从上面的看到, then 函数返回的也是一个 promise 值.在 promise 链中, 值是可以不断地被传递下去的:
```
let promise = new Promise((resolve, reject) => {
  resolve(42);
});

promise.then((result) => {
  return result + 1;
})
.then((result) => {
  console.log(result);
});
```
而且即使是前面的 promise 使用了 reject, 只需要在后面添加 catch 错误处理函数, 整个 promise 链还是会执行下去.
```
let promise = new Promise((resolve, reject) => {
  reject(42);
});

promise.catch((result) => {
  return result + 1;
})
.then((result) => {
  console.log(result);
});
```
而对于返回值, 不仅是常规的数据, 还可以是 promise 值.
```
let p1 = new Promise((resolve, reject) => {
  resolve(42);
});

let p2 = new Promise((resolve, reject) => {
  resolve(43);
});

p1.then((result) => {
  console.log(result);  //42
  return p2;
})
.then((result) => {
  console.log(result);  //43
});
```
这样的话是在第二个 then 的时候, 需要注意的是, 第二个 then 不是添加到了 p2 而是 p3, 也就是说:
```
let p1 = new Promise((resolve, reject) => {
  resolve(42);
});

let p2 = new Promise((resolve, reject) => {
  resolve(43);
});

let p3 = p1.then((result) => {
  console.log(result);  //42
  return p2;
});


p3.then((result) => {
  console.log(result);  //43
});
```
如果需要在 promise 中后触发另外一个 promise, promise 链会非常有用.

tips: 在调用 promise 链的时候, 在最后加上 catch 可以确保正确处理所有错误.