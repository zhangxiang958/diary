# read underscore20

## map-reduce
map 与 reduce 函数可以说是 underscore 函数式的精华所在. 他们对应着映射与归约的思想.

map 对应着映射, 也就是会将一个集合按照一定的规则得到另一个集合.
```
_.map = function(obj, iteratee, context){
  iteratee = optimizeCb(iteratee, context);
  var keys = !isArrayLike(obj) && _.keys(obj),
      length = keys.length,
      results = Array(length);
  for(var index = 0; index < length; index ++){
    var currentKey = keys ? keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }

  return results;
}
```
reduce 对应着归约, 也就是会将一个集合中的元素通过某个规则然后集合成一个数字.
```
function createReducer(dir){
  var reducer = function(obj, iteratee, memo, initial){
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = keys ? keys.length : obj.length,
        index = dir > 0 ? 0 : length - 1;
    
    if(!initial) {
      memo = obj[keys ? keys[index] : index];
      index += dir;
    }

    for(; index >=0 && index < length; index += dir) {
      var currentKeys = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function(obj, iteratee, memo, context){
    var initial = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
  }
}
```