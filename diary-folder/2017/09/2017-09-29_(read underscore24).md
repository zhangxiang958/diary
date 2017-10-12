# read underscore21

## 洗牌算法
洗牌算法是乱序的基础
```
function shuffle(set, n){
  var length = set.length,
      i;
  var sample = map(set, function(elem){
    return elem;
  });
  var last = length - 1;
  for(var i = 0; i < n; i++) {
    var randIndex = Math.floor(Math.random() * (last - i + 1) + i);
    var tmp = smple[i];
    sample[i] = sample[randIndex];
    sample[randIndex] = temp; 
  }
  return smaple.slice(0, n);
}
```
Math.floor(Math.random() * (last - i + 1) + i) 是算法的核心之一, 这里是生成一个在 i 与 last 之间的随机数.

集合的核心方法有几个, 掌握 map, reduce, pluck, group, sortBy, shuffle 这几个相当于掌握集合函数的精髓.