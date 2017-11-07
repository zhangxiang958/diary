# generater

promise 函数是为了改善回调函数， 但是如果将所有任务都进行 promise 包装， 所有任务都会是一个 then 函数， 含义不明， 所以需要 generater 函数改善异步。

generater 函数有点像协程， 将协程 A 执行到一半然后执行协程 B， 然后执行完协程 B 再回来执行协程 A 剩下的。
```
function *asyncJob(){
  // ...
  var y = yield readFile(fileA);
  // ....
}
```
asyncJob 就是一个协程， 然后 yield 是一个个分界点， 到了 yield 的一个节点就会将函数控制权交到另一个协程，等执行权返回， 再执行剩下得。
然后我们需要一个函数来封装那些需要异步的函数， 可以类似的理解为 promise 的包装函数：
```
function *gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next(); // { value: 3, done: false }
g.next(); // { value: undefined, done: true }
```
假如传入的 x 不是一个值，而是一个函数， 那么就实现了一个 generate 函数的包装。
完善一下， 保证捕获出错信息：
```
function *gen(x){
  var ret;
  try {
    ret = yield x + 2;
  } catch(e) {
    console.log(e);
  }
  return ret;
}

var g = gen(1);
g.next();
g.throw('error');
```
 continue to learn generater.