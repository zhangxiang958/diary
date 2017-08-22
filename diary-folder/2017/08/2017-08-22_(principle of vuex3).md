# principle of vuex3

vuex 还有一个部分就是 getter 函数， getter 函数可以在获取 state 的时候，使用一个回调函数，
帮助我们获取 state 的同时进行一些计算后将计算结果返回给我们，这样方便快捷。
对于 vuex 内部来说， 在构造 store 对象或者是子 module 的时候包装 getter 函数，这里 getter 函数是全局的，虽然 actions 和 mutations 也是全局的但是他们允许名字相同，但是 getter 函数不允许名字相同。所以推荐 getter 命名加上一个命名空间。
所谓包装其实就是将 module 里面的 getter 循环然后封装成一个函数，里面其实就是保存了一个局部的 store， 然后进行数据双向绑定，然后在 this.$store.getter.xxxgetter 的时候， 访问 xxxgetter 的时候， 就相当于访问 store._vm[xxxgetter] 了， 
```
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  Object.keys(wrappedGetters).forEach(key => {
    const fn = wrappedGetters[key]
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    })
  })


  ....
  store._vm = new Vue({
   data: { state },
   computed
  })
  ....
```
下面那段代码，store._vm 就相当于一个 Vue 实例，然后将之前存储的 computed 对象（里面放着 getter 函数）作为新实例对象的计算属性，这样的话，当我们读取 store._vm[xxxgetter] 也就是相当于读取 store._vm[xxxgetter] 的计算属性，也就是会自动执行 getter 函数了。
