# read underscore26

深度抽取: 不要轻易地写出 a.b.c.d 这样的代码, 可维护性与可读性都比较差, 虽然像 underscore 里面有 pluck 这样的 api, 但是这样只是单层的.
比如:
```
var data = [
  {
    name: 'test1',
    address: {
      street: '1'
    }
  },
  {
    name: 'test2',
    address: {
      street: '2'
    }
  }
]
```
pluck 可以通过 pluck(data, 'name') 得到 ['test1', 'test2'] 这样的数据, 但是对于 address.street 这样的数据却无能为力.
所以需要包装一下:
```
function deepPluck(data, path){
  if(path.indexOf('.') < 0) {
    return _.pluck(data, path);
  }
  var obj = _.clone(data);
  path = path.split('.');
  _(path).each(function(key){
    obj = _.pluck(obj, key);
  });

  return obj;
}
```
这样可以深度提取对象属性.