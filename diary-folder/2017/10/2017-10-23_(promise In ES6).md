# promise in ES6

在实际开发上, 我们会有很多异步任务需要处理, 虽然会有顺序的异步要求, 但是有时候想想其实不是按照顺序也是可以的, 而 promise.all 就是响应多个异步任务的.
```
let p1 = new Promise((resolve, reject) => {
  resolve(41);
});

let p2 = new Promise((resolve, reject) => {
  resolve(42);
});

let p3 = new Promise((resolve, reject) => {
  resolve(43);
});

let p4 = Promise.all(p1, p2, p3);

p4.then((result) => {
  console.log(isArray(result));  //true
  console.log(result[0]);  //41
  console.log(result[1]);  //42
  console.log(result[2]);  //43
});
```
当全部 promise 成功的时候, all 才会有返回值, 返回的是一个数组, 数组的值是按照被解决的顺序来搞定的. 当然并不是每个异步都会成功的, 如果 promise 队列有一个失败了, 那么 catch 会处理相关
的错误函数, 只是 catch 不会接收一个数组的返回值, 而是单个值.
```
p2 = new Promise((resolve, reject) => {
  reject(42);
});

let p4 = Promise.all([p1, p2, p3]);

p4.then((result) => {
  console.log(isArray(result));  // true
})
.catch((result) => {
  console.log(isArray(result));  // false
  console.log(result);  //42
});
```
在对于多个 promise 来说, 如果你只需要多个中的一个 promise 的返回值, 那么就可以使用 Promise.race(p1, p2, p3);  race 接收的返回值
```
Promise.race([p1, p2, p3]);
```
也可以使用继承来重写 promise 的成功与失败方法:
```
class MyPromise extends Promise {
  
  success(resolve, reject){
    return this.then(resolve, reject);
  }

  fail(resolve, reject){
    return this.then(resolve, reject);
  }
}
```