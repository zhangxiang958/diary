# generator

如果给 generator 传递参数的话, 第一次调用 next 函数是没有任何作用的, 会被忽略掉.
```
function *createIterator() {
  let first = yield 1;
  let second = yield first + 2;
  yield second + 3;
}

var gen = createIterator();
console.log(gen.next());   // 1  { value: 1, done: false }
console.log(gen.next(5));  // 7 ( 5 + 2)  传进去的 5 变成了 first 的值进行计算, yield first(5) + 2  { value: 7, done: false }
console.log(gen.next(8));   // 11 ( 8 + 3 ) 传进去的 8 变成了 second 的值进行计算  yield second(8) + 3  { value: 11, done: false }
console.log(gen.next());   // { value: undefined, done: true }
```
给我的感觉就像是迭代器只能执行 n 次这样, 比如上面是 3 个 yield 语句, 所以只能执行 3 次, 然后多于 3 次的话调用 next 都是 undefined, 即使你在里面调用了 try catch 也是一样的
```
function *createIterator() {
  let first = yield 1;
  let second;

  try {
    second = yield first + 2;
  } catch(e) {
    second = 6;
  }

  yield second + 3;
}

var gen = createIterator();
console.log(gen.next());   // 1  { value: 1, done: false }
console.log(gen.next(5));  // 7 ( 5 + 2)  传进去的 5 变成了 first 的值进行计算, yield first(5) + 2  { value: 7, done: false }
console.log(gen.throw(new Error('Error')));   // 抛出错误, 但是还是返回了结果, { value: 11, done: false }
console.log(gen.next());   // { value: undefined, done: true }
```
目前看来迭代器貌似好像很符合一般的思考逻辑: 比如下面这个代理生成器
```
function *createNumberIterator() {
  yield 1;
  yield 2;
}

function *createColorIterator() {
  yield '#ccc';
  yield '#666';
}

function *createAlllIterator() {
  yield *createNumberIterator();
  yield *createColorIterator();
  yield true;
}

let gen = createAllIterator();

console.log(gen.next());   // { value: 1, done: false }
console.log(gen.next());   // { value: 2, done: false }
console.log(gen.next());   // { value: '#ccc', done: false }
console.log(gen.next());   // { value: '#666', done: false }
console.log(gen.next());   // { value: true, done: true }
```