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
试想一下, 你肯定不会只遇到那种字符串数据, 而你开发中肯定会遇到那种计算数据中出现的数据出现次数或者出现次数前几的场景.
但是你掌握了 group 函数, 就可以随时生成你想要的分类函数, 所以我说这是非常核心的方法.
甚至你不需要记住 _.group 函数, 你只需要掌握 group 函数.其实核心算法就是两步:
第一步: 初始化一个 hash 对象, 其实分类就是将不同类别的类名作为键名, 然后键名对应的是一个个数组, 同类的放在同一个数组里面. 而 key 的生成就是你规定的回调.
第二步: 根据不同的规则, 生成不同的 key, 然后根据这个 key 划分类别.
自己实现一遍:
```
var group = function(behavior){
  return function(obj, iteratee, context){
    var result = {};
    
    each(obj, function(value, index){
      var key = iteratee(value, key, index);
      behavior(result, value, key);
    });

    return result;
  }
}
```