# principle of vuex2
我们来看一下 store 对象是怎么构造出来的。构造 vuex 对象主要是依靠 new Vuex.store() 这个 API 来构建的.
```
new Vuex.store({
  state: {
    count: 0
  },
  mutations: {
    increment: function(state){
      state.count ++;
      console.log(state.count);
    },
    decrement: state => state.count --
  },

  modules: {
    user: user,
    folder: folder
  }
});
```
类似上面这样的, 构造函数里面会将 state, mutaions, module 等等都进行初始化, 我最关心的就是 module, 对于 module 来说, 其实就是先构造出一个根对象, 然后根据传入的 modules 递归构造
子摸块, 得到一个 module 树.
子摸块的注册就是通过递归设置得来的, 取这个模块对应的上一个 state, 然后将本身的 state 进行合并
```
state
  |---user
        |---name
        |---sex
  |---floder
        |---filename
        |---path
     .....
....
``` 
对于 dispatch 和 commit 来说, 他们执行的时候进行了 this 硬绑定, 将 this 对象绑定为 store 对象.
dispatch 就是取到执行的 actions type, 然后判断有没有这个 type 的回调, 如果没有则报错, 如果有则执行回调, 如果回调函数的数量不止一个的话, 就会返回一个 Promise.all, 如果只有一个
那就是执行这个函数.
对于 commit 来说, 会取到 mutations type, 然后取对应这个类型的所有回调函数(数组), 然后遍历循环执行这些回调函数, 执行完了之后遍历监听者数组, 通知所有监听者 state 对象发生了变化.
commit 里面会有一个专门修改 state 对象的函数, 其实是一个代理模式, 监控 state 状态的变化.
mutations 也是需要注册的, 在 store 初始化的时候, 注册 mutations, 所谓注册就是将每个模块的 actions 组装成一个 entry 数组.
actions 是需要注册的, 因为 mutations 是 vuex 里面唯一修改 state 的方法, 所以使用 actions 也是需要在回调里面修改 state 的, 在 actions 的初始化的过程中, 和 mutations 类似的,
类似下面的代码:
```
entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler({
      dispatch,
      commit,
      getters: store.getters,
      state: getNestedState(store.state, path),
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
```
所以我们可以看到, action 可以拿到 dispatch, commit, getter, state, rootState 这五个参数. actions 返回的一定是一个 promise, 因为 vuex 会将它进行 promise 包装, 这也是为什么
vuex 依赖 promise.