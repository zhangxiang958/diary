# read underscore34

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

  var objProto = Object.prototype,
      hasOwnProperty = objProto.hasOwnProperty;

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

  var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys){
    var nonEnumIdx = nonEnumableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || objProto;

    var prop = 'constructor';
    if(_.has(obj, prop)) && !_.contains(keys, prop) keys.push(prop);

    while(nonEnumIdx--){
      prop = nonEnumerableProps[nonEnumIdx];
      if(prop in obj && obj[prop] !== objProto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  _.keys = function(obj){
    var keys = [];
    for(var key in obj) {
      if(hasOwnProperty.call(obj, key)) {
        keys.push(key);

        if(hasEnumBug) collectNonEnumProps(obj, keys); 
      }
    }
    return keys;
  }

  _.has = function(obj, prop){
    return !!obj && hasOwnProperty.call(obj, prop);
  }

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