# principle of Vuex 
vuex 核心其实就是总线型思想, 将组件的数据与状态集中起来, 方便管理与查看. 免去了兄弟组件之间的通信的层层传递, 也免去复杂组件间的复杂传递逻辑.
对于 Vuex 来说核心其实就是三个, state, actions, mutations.
其中 state 是存储数据的, 然后 actions 是用来处理异步操作的, 像 ajax 通常会放在这里, mutations 是用于同步操作的, 一般是用来改变 state 的状态的.
实际运用中 dispatch 是用来触发 actions 异步操作的, 然后 commit 是用来触发 mutations 同步操作的.
vuex 在初始化的时候只需要 Vue.use(vuex); 然后在 store.js 中:
```
import Vue 			from 'vue';
import Vuex 		from 'vuex';
import actions 		from './actions'
import mutations 	from './mutations'
import state 		from "./state"

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
    	.....
    }
})
```
然后在 app.js 新建 Vue 实例的时候, 传入一个 store 对象就可以使用了.问题在于这是怎样的一个过程? 最近在写一些 vue 插件, 道理貌似是类似的, 通过暴露一个 install 方法, Vue.use 的时候
就会执行 install 方法实现初始化.
其实内部就是:
```
function (plugin = object | function) {
    if(plugin.installed) {
        return;
    }
    const args = toArray(arguments, 1);
    args.unshift(this);
    if(typeof plugin.install === 'function') {
        plugin.insall.apply(plugin, args);
    } else {
        plugin.apply(null, args);
    }
    plugin.installed = true;
    return this;
}
```
然后 install 进行全局 $store 挂载, root.$store, 然后每个组件就会通过父组件上面的 store 属性取值:
```
root  this.$store = options.store
  |--App  this.$store = parent.$store
      |---home this.$store = parent.$store
      |---footer this.$store = parent.$store
```