# read underscore30


继续封装: 
```
(function(root, factory){
  if(typeof define === 'object' && define.amd) {
    define([], factory);
  } else if(typeof module === 'object' && module.exports){
    module.exports = factory();;
  } else {
    root._ = factory();
  }
}(window, function(){
  var _ = function(obj){
    if(obj instanceof _) return obj;
    if(!(this instanceof _)) return new _(obj);
    this.wrapped = obj;
  };

  _.each = function(obj, iteratee){
    if(obj !== null) {
      if(obj.length) {
        for(var i = 0, length; i < length; i++) {
          iteratee(obj[i], i, obj);
        }
      } else {
        var keys = _.keys(obj);
        for(var i = 0, length = keys.length; i < length; i++) {
          iteratee(obj[keys[i]], keys[i], obj);
        }
      }
    }
  }

  _.map = function(obj, iteratee){
    var keys = obj && obj.length && _.keys(obj);
        length = keys.length,
        results = Array(length);
    for(var i = 0; i < length; i++) {
      var currentKey = keys ? keys[i] : i;
      results[i] = iteratee(obj[currentKey], currentKey, obj);
    }

    return result;
  };

  _.chain = function(obj, functions){
    _.each(functions, function(name, idx){
      var fn = obj[name];
      
      obj[name] = function(){
        var args = [].slice.call(arguments, 0);
        fn.apply(this, args);
        return this;
      }
    });
  }

  return _;
}));
```