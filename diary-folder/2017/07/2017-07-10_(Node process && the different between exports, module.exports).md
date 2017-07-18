# Node process && the different between exports, module.exports

## process
进程对于服务端开发, 就相当于 HTML 对于前端一样.服务端开发绝对不可能绕过 linux, 进程等的.

process 是一个全局对象, 可以从命令行中获取参数 process.argv/peocess.env 等等.
退出进程指定退出码: process.exit(0 || 1 ...);
有标准的输入输出流 process.stdout/process.stdin/process.stderr
可以降权
使用 child_process(require('child_process')) 可以创建子进程. spawn(exec, args, options);
进程间的通讯可以通过 kill 或者 send, 如果是同为 nodejs 进程可以使用 send (IPC),
parent => childProcess.kill('messageEvent');
child => process.on('messageevent', function(){}); 


childPocess.spawn('node', ['child.js'], {
  stdio: [0, 1, 2, 'ipc']
});
parent => childProcess.on('event', function(){}); childProcess.send('hi');
child => process.on('event', function(){});


守护进程: 当进程崩溃的时候重启进程
function reload(module){
  var work = child_process.spawn('node', [module]);

  work.on('exit', function(code){
    if(code !== 0) {
      reload(module);
    }
  })
}

reload('http.js');


## exports 与 module.exports 的不同
nodejs 在打包编译模块的时候，会将模块编译成如下：
```
(function(exports, require, module, _filename, _dirname){
  
  /**module 是模块本身， require 是 Node.js 实现查找模块的模块 Module._load 实例的引用，_filename, _dirname 是模块名与模块绝对路径
  */
});
```
exports 是 module.exports 的一个引用
```
exports = module.exports = {}
```
那么也就是说 exports 可以挂载属性，如果模块有很多方法可以导出的话可以使用 exports.xxx = xxx 来导出，而 module.exports 意味着整个模块的导出是什么形式，
而对于 require ，引入的模块接收的是 module.exports 而不是 exports， 所以如果我们用 exports = 这样的形式来赋值，那么就相当于给 exports 重新赋值了，而我们
在引入模块的时候使用的是 module.exports ，而 module.exports 一开始初始化就是一个对象 {}, 所以你在 require 后还是一个 {}, 而如果你同时使用 exports.xxx = xxx, module.exports = function(){}, 那么在其他模块使用 require 引入的时候，只有 function 这个函数，而没有其他属性，这是因为引用传递, module.exports 指向了另外一个对象, 而 exports 还是指向原来的那个对象.
```
function Module(){
  this.exports = {};

}

var module = new Module();

var  fs = require('fs');
var foo_js = fs.readFileSync('./foo.js');

var packStr = '(function(exports, module){' + foo_js + ' return module.exports; })';

var packObj = eval(packStr);

var foo = packObj(module.exports, module);
//function(exports, module){ ... }
这就是为什么对 exports 进行赋值改变(exports = 'obj') 无效,这就是因为这是改变了形参的引用, 没有修改到引用地址真实的值.
```

总结，对于需要导出的属性可以挂载到 exports 对象上，而对于构造函数等，就可以直接时候 module.exports。

link:
[引用传递](http://blog.csdn.net/qq_21930351/article/details/40627649)
[exports 与 module.exports 的区别](https://cnodejs.org/topic/52308842101e574521c16e06)
https://github.com/EdgarLovesProgramming/FE-Learning/blob/master/09-nodejs%E7%9B%B8%E5%85%B3%E7%9F%A5%E8%AF%86%E7%82%B9/04-exports%E5%92%8Cmodule.exports%E7%9A%84%E5%8C%BA%E5%88%AB.md
