# read underscore34

之前虽然看了 underscore 的链式语法, 但是感觉没有理解透, 总结一下:
链式语法是需要借助原型来完成的, 将所有的方法都寄放在 prototype 上, 如果我们在封装的时候是将方法写在属性上面的(_.xxx), 那么还需要将这些方法全部放到 prototype 上面去.
也就是利用 mixin.
第二就是需要将函数进行包装:
```
var _ = function(obj){
  if(obj instanceof _) return obj;
  if(!(this instanceof obj)) return new _(obj);
  this.wrapped = obj;
}
```
但是在 underscore 中 _.chain 才链式调用的开始:
```
_.chain = function(obj){
  var instance = _(obj);
  instance._chain = true;
  return instance;
}
```
但是最难理解的就在于 _.chain(obj).map(function(){}); map 是怎么拿到前一步的结果的?
所以其实链式调用有两个关键点, 第一用一个 flag 值来开启链式调用语法, instance._chain = tru, 第二就是将前一步的结果存储在 this.wraaped 中, 在执行下一个函数的时候就:
```
var args = [this.wrapped];
push.apply(args, arguments);
func.apply(this, args);
```
这样通过 apply 函数, 将 this.wrapped 作为第一个参数输入到函数里面去., 那这样就相当于 map(this.wrapped, function(){});
另外我觉得难理解的在于源码里面的一句:
```
 var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };
```
这个函数是用来 mixin 函数的时候, 作为最后的返回值的:
```
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
```
当 instance._chain 为 true 的时候,代表开启链式语法, 所以返回 _(obj).chain(), 否则返回原函数的结果. 调用 return chainResult(this, func.apply(_, args)); 的时候,
this 就是前面的 _.chain 经过包装的那个函数. 但是难理解就在于 _(obj).chain() , 我觉得是明明可以直接 _.chain(obj) , 为啥要这样写, 结果一样吗?
在测试的时候确实是一样的. _.chain(obj) 与 _(obj).chain(), 但是为啥要这样写?
_(obj).chain() 先使用 _ 包装起 obj, 变成 { ..., wrapped: obj }, 然后执行 chain, 这个时候执行的是 _.prototype.chain , 这样 func.apply(_.args) 结果就是 
{ ..., _chain: true, wrapped: obj }, 对于 this 来讲就是 _(obj) 也就是 { ..., wrapped: obj }, 所以 instance._chain ? _(obj).chain() : obj 返回的是 obj.
而此时的 obj 已经是 { ..., _chain: true, wrapped: obj } 了.
其实我看了一个压缩后的代码, _.prototype.chain 已经变成 function (){return this._chain=!0,this}, 也就是说, 使用这个函数也就是为了修改 this 对象的 _chain 属性为 true 而已.
事实也是这样, 想一下就明白, _.prototype.chain 就是将前面 _(obj) 包装好的 { ..., wrapped: obj }, 修改了一下 _chain 属性为 true 然后就返回了(因为执行函数前没有 _chain, 所以
三目运算符返回的是后者 _.prototype.chain 的函数结果)
_(obj).chain() === _.chain(obj); 