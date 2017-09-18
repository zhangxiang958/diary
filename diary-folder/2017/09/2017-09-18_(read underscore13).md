# read underscore13

underscore 里面用到了洗牌算法, 是用来做乱序的. 洗牌算法可以一步步地看:
第一次迭代就是简单的算法:
```
function shuffle(array) {
  var copy = [],
      n = array.length,
      i;
  while(n) {
    i = Math.floor(Math.random() * array.length);
    if(i in array) {
      copy[i] = array[i];
      delete array[i];
      n--;
    }
  }

  return copy;
}
```
这个就是简单版的洗牌算法, 但是有个缺陷就是我们这里只是 delete 了, 那么 i 还是有可能不断被重复用到, 得到的值是 undefined, 这样性能就不好了.
改进:
```
function shuffle(array) {
  var copy = [],
      n = array.length,
      i;
  
  while(n){
    i = Math.floor(Math/random() * array.length);
    if(i in array) {
      copy.push(array.splice(i, 1));
      n --;
    }
  }

  return copy;
}
```
这样就没有刚刚那个不断读取 undefined 的了, 但是这个性能还是不好, 因为即使是后台做的不断将元素前移, 性能还是需要注意(splice), 所以还需要改进:
本质是排序, 所以可以不新建数组来保存结果, 然后随机选取一个元素, 然后将这个元素和最后的 length - n 个元素交换:
```
function shuffle(array){
  var length = array.length
      t, i;
  while(length) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
```
不断将元素放到后面去, 这样就不用创建新数组了.