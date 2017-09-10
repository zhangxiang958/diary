# read underscore6

```
  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

```
shallowProperty 函数是用来获取对象对应键名的值的, deepGet 函数则主要是在 property 或者 propertyOf 这两个根据键名获取键值的函数中, 当输入的键名值为数组类型的时候, 采用遍历的方式
取值, 它是一个内部的工具函数.
getLength 是一个获取对象 length 属性的工具方法, 而 MAX_ARRAY_INDEX 为 2 的 53 次方减 1, 而这个是 javascript 中能表示的最大整数值.
isArrayLike 是为了判断一个对象是不是类数组对象, 什么是类数组对象? 像我们常见的 arguments 对象, DOM 中的 NodeList 对象等等这些都是类数组对象, 他们有 length 属性并且表示的是对象
拥有的元素的数量, 但是却没有数组的某些方法像 forEach, map 等等.
