# read underscore23

## 对象判空
```
  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };
```
对象判空是很重要的函数, 因为在日常开发的时候会常常遇到, 我们通过会遇到空数据的情况, 但是不会完全是空的, 比如 data: { } 这样, 但是我们不能依靠 !! 这样来判断, 举一个非常简单的例子:
```
!!null === false
```
null 代表一个空对像, 但是返回布尔值确实 false, 确实不靠谱, 所以需要一个对象判空函数. 自实现一遍:
```
function keys(obj){
  var result = [];
  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      result.push(key);
    }
  }

  return result;
}

function isEmpty(obj) {
  if(obj == null) return true;
  if(!!obj.length && (
    Object.prototype.call(obj) === '[object Array]' || 
    Object.prototype.call(obj) === '[object String]' ||
    Object.prototype.call(obj) === '[object Arguments]'
    )
  ) {
    return obj.length === 0;
  }

  return keys(obj).length === 0;
}
```