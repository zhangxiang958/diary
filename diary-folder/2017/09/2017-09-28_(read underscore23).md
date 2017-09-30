# read underscore21

## 分类
```
var group = function(behavior, partition){
  return function(obj, iteratee, context){
    var result = partition ? [[], []] : {};
    iteratee = cb(iteratee, context);
    
    _.each(obj, function(value, index){
      var key = iteratee(value, key, index);
      behavior(result, value, key);
    });

    return result;
  }
}

_.group = group(function(result, value, key){
  if(_.has(result, key)) result[key].push(value); else result[key] = value;
});
```
这个 group 函数是非常重要的, 以至于很多场合都会用到, 例如分类.这也是集合类型的核心方法了.