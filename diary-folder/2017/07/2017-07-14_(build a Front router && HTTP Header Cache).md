# build a Front router && HTTP Header Cache

## build the Front router
现在前端路由库成为单页面应用的标配, 那么目前的前端路由库主要是为了无刷新更新页面内容, 提升用户体验, 分为两种形式来做到,一种是利用 url 的 hash 片段,
所谓 hash 片段也就是 a 标签的形如 #/a 这样路径. 在路由模块初始化的时候, 为每个路由绑定相对应的更新函数, 就可以了, 然后绑定 hashchange 事件,当路由的
hash 片段变化的时候, 自动触发更新函数.
另外一种则是利用 html5 新的 api, popstate 事件和 pushState 方法/replaceState 方法来做到的, 和 hash 一样,首先也是需要为每个路径绑定相对应的函数的,另外就是 pushState 和 replaceState 都是接收三个参数, 第一个参数就是 state 对象, 放置路由的信息, 第二是页面的 title, 第三就是跳转的路由, 但是值得注意的是这两个方法并不会触发 popstate 事件, popstate 事件是在浏览器触发 history 对象的 back, forward, go 方法才能触发, 所以利用 history 来做路由库和 hash 是不一样的思路, 它是在 pushState 的时候触发了页面更新函数, 然后监听 popstate 事件, 当路由变化的时候也触发更新函数, 这样的好处在于能够控制浏览器的历史行为, 真正做到点击后退是返回到上一个页面, 这个是 hash 片段做不到的.这样的 history 利用 puishState 时更新页面, popstate 更新页面形成一个闭环达到目的.

提一点: 使用 history 的时候需要自己搭建一个简单的服务器, 不然修改会报错.
demo: https://github.com/zhangxiang958/PlayWithRouter

## HTTP cache
http 缓存控制头部分为三种策略，分别是存储策略，过期策略，对比策略。
存储策略就是决定文件是否会缓存到本地，比如 cache-control 中的 public，private，no-cache， max-age，no-store，前四个会存储文件在本地，最后一个则不会，no-cache 会缓存到本地，但是不使用缓存文件。
过期策略是判断文件是否已经过期，是否需要更新。在 HTTP 1.0 的时候一般会使用 Expires 来判断，Expires 的值是绝对日期，但是在 HTTP 1.1 之后 Cache-control 中的 max-age 也有类似的作用，并且 cache-control 的优先级比 Expires 高，两个同时存在则使用 cache-control.
对比策略就是浏览器在再一次访问资源的时候，会先向服务器发送一个询问请求：带上 if-modified-since 或者 if-none-match （他们两个的值是 last-modified 和 Etag 的值）询问是否过期。 
另外，在使用中， max-age 与 no-cache 基本上没有大区别。
实际上就是 no-cache 缓存但是在服务器响应之前不能使用本地缓存（端到端的文件传输），max-age 可以缓存，如果服务器响应没有更新则直接使用本地文件。
links:
[no-cache && max-age=0](https://stackoverflow.com/questions/1046966/whats-the-difference-between-cache-control-max-age-0-and-no-cache)