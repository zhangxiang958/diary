# code splitting && vue core1

## code splitting
代码分片是 webpack 使用懒加载的手段之一， 我们可以常常看到如果在文件里面使用 require.ensure 这样的形式来加载一个组件或者一个文件，我们往往会看到打包出来的是两个文件比如：
main.js, 1.js, 2.js 这样的文件。

而对于懒加载，首先 webpack 肯定是需要解决异步加载的问题：
```
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);

/******/ 	};
```
上面这段是我截取项目里面打包的文件。webpack 会使用 webpackJsonP 来加载 chunks。
而对于代码分割其实无非就是将有分隔符文件进行解析识别，然后将模块进行分割，同时在分析模块依赖的时候，对于 main.js 中已经加载了的模块，那么其他 chunk 如果也依赖了的就可以从依赖列表中去除，这样提高了性能，不必重复加载代码。

## vue core
vue 我觉得有两个核心，第一个是数据双向绑定， 第二个就是单向数据流了。单向数据流在比较简单的场景的时候是非常好用的，对于 vuex 这种总线型状态管理工具，有时候就反而显得累赘。
对于单向数据流，就是在组件中通过 props， emit， dispatch 这样的父子组件通信方法来实现的。

对于 vue 的数据双向绑定，其实就是通过 Object.defineProperty(); 函数来实现的，之前在项目中也有使用过，来复习一下， 写个小 demo：其实就是通过劫持对象属性的 getter/setter 函数，目的是为了在读取对象属性与写入对象属性的时候，触发相对应的回调。
对于对象中还有对象的情况，会使用递归的方式，为求监听到每个属性。
```
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype.walk = function(obj){
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            var val = obj[key];

            if(typeof val === 'object') {
                new Observer(val);
            }

            this.convert(key, val);
        }
    }
}

Observer.prototype.convert = function(key, val){
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function(){
            console.log('you are getting:' + key);
            return val;
        },
        set: function(newVal){
            console.log('you are setting newVal for:' + key);
            console.log('newVal is:' + newVal);
            if(newVal === val) return;
            val = newVal;
        }
    });
}

var data = {
    user: {
        name: 'zhangxiang',
        age: 22
    },
    school: {
        name: 'GDUT'
    },
    job: 'frontEnd'
}

var app = new Observer(data);
```
以上轻而易举地解释了一些 bug 比如为什么一些属性设置了不能数据双向绑定（不包括数组），如果发现有这样的 bug，记得检查一下自己的 data 设置得有没有对，是不是动态插入了对象属性。