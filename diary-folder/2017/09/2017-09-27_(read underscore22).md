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
但是排序作为平日开发用的最多的工具功能, 应该更加好用才对:
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