# module in node

node 模块查找会将省略的文件后缀替换，会使用 .js/.json/.node 的顺序来逐个分析。
所以有个窍门就是如果是 json 或者 node 文件加上后缀会加快编译。
分为自定义模块和核心模块，核心模块是二进制形式，已经是编译好了的模块，速度最快。

nodejs 会将加载过的模块缓存，减少模块二次加载的性能问题。

像我之前的日记就有提及说 node 符合 commonjs 规范，它在编译打包的时候，会将模块前后加上一个 IIFE 来包裹：
```
(function(exports, require, module, __firname, __dirname){
    var a = require('a');
    exports.a = a;   
});
```
对于 module，其实就是模块本身，本身会拥有像依赖，id，是否加载完成等等的属性记录，就像 webpack 打包出来的 module 一样。

node 模块是 C/C++ 编写编译出来的模块，只需要加载执行。
json 文件编译就是通过同步读取文件 fs.readFileSync() 然后 JSON.parse 然后赋给 exports。

Node 的 buffer，cryto，evals， fs，os 模块都是由 C/C++ 编写的。文件模块依赖核心模块，核心模块依赖內建模块。

node 的核心模块会将 js 文件转存为 C/C++ 代码，采用内置的 js2c.py 工具，将 src/node.js 和 lib/*.js 都进行转换。

不管是核心模块还是文件模块都是一个个对象：
```
function NavtiveModule(id) {
    this.filename = id + '.js';
    this.id = id;
    this.exports = {};
    this.loaded = false;
}

NativeModule._source = process.binding('native');
NativeModule._cache = {};

function Module(id){
    this.filename = id + '.js';
    this.id = id;
    this.exports = {};
    this.loaded = false;
}
```

npm 是 node 用来管理包的, 一个包分为包结构和包描述, 包结构就是 lib 中编写的 js 模块, 包描述就是 package.json.
script 字段是用来说明脚本的, bin 是用来当作命令行来使用的.

npm 常用命令有:
```
npm -V  查看 npm 版本
npm install 会将模块安装到 path.resolve(process.execPath, '..', '..', 'lib', 'node_modules');  如果可执行文件的位置是 /usr/local/bin/node 那么最后就是 /usr/local/
也可以使用 npm install module_name --registry=http://example.com 指定源安装
发布包: npm publish
初始化 package.json: npm init
查看当前路径下所有包: npm ls

```


