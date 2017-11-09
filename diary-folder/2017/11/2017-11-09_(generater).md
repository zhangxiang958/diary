# generater

当迭代遇到 return, 错误, 或者最后一个 yield 的时候, 再执行一次 next 才会得到 done 为 true.
yield 本身没有返回值(undefined), next 函数执行得到的是 value 的值. value 值就是 yield 语句后面的语句的求值情况.
next 方法可以传参, 传递的参数替代了上一次 yield 的语句的位置, 作为返回值.
需要注意的知识点是:
1. yield 后面语句的执行时机, yield 后面的语句还是按照原来的环境执行, yield 相当于把该行语句推出来执行, 并从 generater 执行环境退出来.
2. yield 的返回值, yield 语句没有返回值, 当 gen 对象实例调用 next 方法, 返回对象的 value 值, value 是 yield 后面语句的求值情况.
3. next 函数传递参数, 参数被当作上一次 yield 语句的返回值.
```
function run(gen){
  var g = gen();
  function next(data){
    var ret = g.next(data);
    if(ret.done) return ret;
    ret.value(next);
  }
  next();
}

var getListData = (success) => {
  $.ajax({
    url: 'http://test.com',
    success: success
  });
}

var getUserData = (success) => {
  $.ajax({
    url: 'http://test.com',
    success: success
  });
}

run(function* gen(){
  var listData = yield getListData;
  var UserData = yield getUserData;
  console.log(listData, UserData);
});
```
之前不理解为什么 koa 里面不管是路由还是其他中间件, 一律都是:
```
app.use(function* (next){
  // do something
  yield next;
  // do something
});
```
这样的写法, 第一 koa 依赖于 co 类库, 第二这样其实还是像 express 里面的一样, 只不过在 express 里面, request, response 是在函数参数里面的, 当然还有 next, 而 koa 里面不用:
```
app.use(function (request, response, next){
  next();
});

=> 
app.use(function* (next){
  this.request;
  this.response;
  yield next;
});
```