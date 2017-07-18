# Module model && NodeJs start

## 模块模式与 IIFE
所谓模块模式, 是 javascript 实现模块化的方式

```
var Module = (function(){
  var array = [];

  function pushData(data){
    array.push(data);
  }

  return {
    pushData: pushData
  }

})();
```

这样可以轻易地创建出一个拥有私有变量的方法, 只能通过 pushData 来对 array 来进行修改, 借助闭包的能力, 为 javascript 增添了私有变量的能力.

像 zepto ,jquery 等这样的库,通常使用像下面这样:
```
(function($, juqery){

  console.log($, jquery);

})($, jquery);
```
传入全局对象

## Nodejs 代码组织 && 模块
使用 node 命令,在文件头部声明一段
```
#! /user/bin/env node
```
这样可以告诉系统这是一个 node 可执行文件, 使用 npm 来管理引用包的依赖.

### 模块
nodejs 使用 commonjs 模块机制, 我们可以使用 require 命令来引用, 暴露模块使用 module.exports, 或者 exports.name = xxx
exports 表示导出的对象, 包含属性与方法
module 可以访问到模块的信息

require 可以使用 node_modules/path  home/node_modules/path  home/user/node_modules 这样的路径去寻找模块
NODE_PATH 是一个全局变量, 指定模块寻找的额外路径.
