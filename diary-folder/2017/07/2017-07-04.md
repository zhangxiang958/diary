# Currying in front Engineering

## what is currying and why currying

currying is a function which makes the mutipart arguments become single arguments.

currying is base on call/apply/bind, colsure, high orider function and so on.

currying can use some tick or delay calculate, fixed those arguments which is easy to change

## delay calculate

```
function curry(func){
  var _args = Array.prototype.slice.call(arguments, 1);

  return function result(){
    var _newArgs = Array.prototype.slice.call(arguments, 0);
    
    if(_newArgs.length === 0) {
      return func.apply(this, _args);
    }

    _args.concat(_newArgs);
    return result;
  }
}

function add(){
  var list = Array.prototype.slice.call(arguments, 0);
  return list.reduce(function(sum, value){
    return sum + value;
  });
}

add = curry(add);

add(1, 2)(3);
add(4)(5);
add(6)(7,8);
add();
```

## arguments complex use
fixed a part of function, and we can use it for complex, and other for dynamic.

```
function curryHelper(func){
  var _args = Array.prototype.silce.call(arguments, 1);
  return function(){
    var _newArgs = Array.prototype.silce.call(arguments, 0);
    _args.concat(_newArgs);
    return func.apply(this, _args);
  }
}

function showMsg(greeting, name, age){
  console.log(greeting + ', ' + name + ', you are ' + age);
}

var sayHello = curryHelper(showMsg, 'hello');

sayHello('zhang', 22);
sayHello('jarvis', 23);
```
we also can send the arguments to setTimeout
```
setTimeout(cutty(func, 'arg1'), 1000);
//or
setTimeout(func.bind(this, 'arg1'), 1000);
```


## create dynamic function

in old time, we usually make function like this:
```
function addEventHandler(ele, type, func){
  if(window.addEventListener){
    ele.addEventListener(type, func);
  } else if(window.attachEvent) {
    ele.attachEvent('on' + type, func);
  } else {
    ele['on' + type] = func;
  }
}
```
but, the problem is, when we use the addEventHandler, it must judge if...else.. every time we use this function, if we use currying to 
create function like this:
```
var addEventHandler = (function(){
  if(window.addEventListener) {
    
    return function(ele, type, func){
      ele.addEventListener(type, func);
    }
  } else if(window.attachEvent) {

    return function(ele, type, func){
      
      ele.attchEvent('on' + type, func);
    }
  } else {

    return function(ele, type, func){
      
      ele['on' + type] = func;
    }
  }
})();
```
we use this function like this will not nesseeary to judeg those if...else.


## in all

currying in javascript is base on call/apply/bind, without them, there are not currying in javascript.

link:
[currying](https://juejin.im/entry/579ac1f60a2b580058efdb48)
