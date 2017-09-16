# read underscore10

```
  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };
```
字面意思就能理解, 就是查看集合中是否包含特定那个值. _.values 函数就是通过先获取对象的 key 数组(_.keys) ,然后遍历对象, 将对应键值放到数组中然后返回. 
然后看 indexOf 有没有找到列表有有对应的项.
indexOf 内部也比较有意思, 我已经在源码中注释了, 这里总得来说就是如果 fromIndex 传的是数字, 那么就从 fromIndex 开始查找. 如果传的是 true, 那么就说明是排序数组, 将采用二分查找来
查找数组.

```
  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArgs(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      // 如果 path 传入一个函数
      func = path;
    } else if (_.isArray(path)) {
      // 如果 path 是一个数组
      //contextPath 取数组的除最后一个元素外的元素组成的数组(slice 不会影响原数组)
      contextPath = path.slice(0, -1);
      // path 取原数组最后一个元素
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      // 如果 method 为空
      if (!method) {
        // 如果有 contextPath
        if (contextPath && contextPath.length) {
          // 取 path 数组中最后一个键名对应的 context, 利用这个 context ( path 属性)来做处理而不是整个 context
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        // 这句代码花了一点时间来读, 这里的 path 可以传字符串, 就是因为考虑到 item 可能是原生对象或者数组, 那么通过方括号就可以获取原生方法了
        // 例如: _.invoke([[5, 1, 7], [3, 2, 1]], 'sort'); 调用了数组的 sort 方法
        method = context[path];
      }
      // 如果 method 没有赋值, 那么返回空
      // 如果有则返回 method 函数执行结果
      return method == null ? method : method.apply(context, args);
    });
  });
```
可以看到, invoke 函数最后返回的是 map 函数的结果, 所以最后结果是一个集合(数组).

```
  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };
```
我觉得这个 pluck 是 map 的简化版, 也就是将数组中对应的键名的值取出来放到一个数组中.

```
  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };
```
where 是 filter 的特殊用法, 回调使用的是 _.matcher, 筛选出包含 attr 的对象.

```
  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };
```
find 的特殊用法, 找到 obj 中第一个包含 attr 的对象. 试想一下如果列表中的 item 是对象, 那么你需要很多步骤例如遍历等等, findWhere 明显提供了一个简单的 API.
```
  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    // 先记录最后 result 为最小值
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    // 如果缺失回调函数或者 iteratee 是一个数字并且 obj 列表不是一个对象集合
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      // 获取 obj 中的值的集合
      obj = isArrayLike(obj) ? obj : _.values(obj);
      //遍历进行比较
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      //如果没有缺失回调, 先对回调函数进行优化包装
      iteratee = cb(iteratee, context);
      //遍历 obj
      _.each(obj, function(v, index, list) {
        // 使用 computed 缓存起 return 的值
        computed = iteratee(v, index, list);
        //如果 computed 值比 lastComputed 大, 那么 computed 就是较大值, 进行替换
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          // 这里用 result 是因为 item 不一定是数字类型, 可能是对象, 只是使用对象中的某个属性值进行比较大小
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };
```
max 函数就是将列表中的值选出最大值然后返回
```
  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    // 先记录最后 result 为最大值
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    // 如果缺失回调函数或者 iteratee 是一个数字并且 obj 列表不是一个对象集合
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
      // 获取 obj 中的值的集合
      obj = isArrayLike(obj) ? obj : _.values(obj);
      //遍历进行比较
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };
```
min 函数几乎不必解释, 就是和 max 函数相反