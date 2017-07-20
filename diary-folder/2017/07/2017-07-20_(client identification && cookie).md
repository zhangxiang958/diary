# Client identification && cookie

## client identification

首先要讲的是三个首部, from, user-agent, referer. from 包含了用户的 Email 地址, user-agent 就是用户所用的浏览器信息, referer 就是用户浏览前的一个网址,就是用户是从哪个地方跳进来的. 但是这三个首部并不能很好地识别客户端.

首先有个疑问, 能不能使用 IP 地址作为用户的 id ? 答案是使用 ip 地址不准确, 因为我们一般上网会使用 DHCP 协议, DHCP 服务器会分配动态的 IP 地址个哦客户端, 并且这个区分的不是用户而是机器,如果多个用户使用同一个 IP 地址,比如 NAT 这样的, 具体例子就是 wifi, 这样就不能准确知道用户数量了.另外像网关,代理这样的 "客户端", 服务器看到的是代理或者网关的 IP.

平时像我们使用简单的登录可以是使用 HTTP 的认证, 使用 401 login required 请求, 通过添加 www-authentication 头部, 只要用户输入了用户名密码, 浏览器会重复发送请求, 并添加一个 authorization 首部, 加密用户名与密码后发送到服务端.

## cookie

cookie 非常方便，它分为临时和持久这两种，临时 cookie 在浏览器关闭的时候就会销毁，但是持久 cookie 会在过期的时候才会销毁，cookie 本质上是一个键值对，但是添加了像 domian， path ， expires（在 cookie2 中是 max-age） 这样的属性来保持有序和可控，域名与路径可以保证cookie 不会在不同域名间传递，而 expires 保证有效性的可控，cookie 是带在 http头部传送过去的，所以我们应该尽量减少 cookie 的数量和大小。
而 session 是建立在 cookie 上面的，此时的 cookie 记录的是 session 的 ID 值。但是在使用 node 的时候 session 貌似是一个学问，session 等我接下来研究后再总结。
