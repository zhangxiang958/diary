# read underscore21

## 排序
在 javascript 中, 数组中的 sort 函数已经提供了排序的功能了, 但是这个办法说不上非常好用:
```
var arr = [
  {
    name: 'test1',
    age: 18
  },
  {
    name: 'test2',
    age: 14
  },
  {
    name: 'test3',
    age: 20
  }
];

arr.sort(function(prev, next){
  return next.age < prev.age;
});

//result
arr => [
  {
    name: 'test2',
    age: 14
  },
  {
    name: 'test1',
    age: 18
  },
  {
    name: 'test3',
    age: 20
  }
] 
```
但是排序作为平日开发用的最多的工具功能, 应该更加好用才对: sort 会在原数组上进行排序, 不会返回副本, 如果不输入回调的话, 那么就是按照字符串的开头来排序, 
如果是需要另外的排序功能, 那么就需要输入排序函数, 回调中有两个参数, 表示前一个元素与后一个元素(a, b), 如果是需要 a < b, 也就是 a 在 b 的前面, 那么就需要返回
一个比 0 小的数, 如果是需要 a > b, 也就是 a 在 b 的后面, 那么就需要返回一个比 0 大的数.
```
_.sortBy = function(obj, iteratee, context){
  var index = 0;
  iteratee = cb(iteratee, context);

  return _.pluck(_.map(obj, function(value, key, list){
    return {
      value: value,
      index: index++,
      criteria: iteratee(value, key, list)
    }
  }).sort(function(left, right){
    var a = left.criteria;
    var b = right.criteria;

    if(a !== b) {
      if(a > b || a === void 0) return 1;
      if(a < b || b === void 0) return -1; 
    }

    return left.index - right.index;
  }), 'value');
}
```
其实这里核心是 map 函数, pluck 函数也是 map 函数的再包装使用. 
```
function pluck(obj, key){
  return map(obj, function(item){
    return obj[key];
  });
}
```