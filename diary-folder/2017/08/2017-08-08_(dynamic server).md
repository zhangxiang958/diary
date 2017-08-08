# dynamic server

动态服务器, 就是接收来自客户端请求数据的服务器, 一般需要提供的主要有 3 点:
1. 能够处理 get post delete put 等 HTTP 请求方法
2. 能够使用 cookie 
3. 提供 session

因为 HTTP 是一个无状态协议, 对于一些需要记录用户状态的时候, session 非常重要.

那么所谓支持 HTTP 的方法, 也就是通过辨别请求的类型, 然后调取相对应的数据, 数据可能在查询字符串中或者 body 中.

而对于 cookie 的支持, 则是通过两点:
1. 每次请求传递 cookie 字段, cookie 字段在 http 头部中.
2. 响应传递 cookie

如果服务端需要设定 cookie 头, 那么就设置一个 set-cookie 头部.那么下一次客户端请求就会带上设置的 cookie 值.

解析 cookie 值就通过下面的函数:
```
var cookie = request.headers.cookie;

function parse(cookie) {
    var map = {};
    var cookies = cookie.split(';');
    cookies.forEach(function(pair){
        var KeyAndVale = pair.split('=');
        map[KeyAndValue[0]] = KeyAndValue[1];
    });
    return map;
}
```
然后返回信息需要设置 cookie. 对于设置 cookie 几乎和在客户端是一样的. 需要设置 domian 域, max-age 过期时间, path 路径, secure 安全, version 版本号.
```
exports.stringify = function(cookie){
    var buffer = [cookie.key, '=', cookie.value];
    if(cookie.expires) {
        buffer.push(' expires=', (new Date(cookie.expires)).toUTCString(), ';');
    }

    if(cookie.path) {
        buffer.push(' path=', cookie.path, ';');
    }

    if(cookie.domain) {
        buffer.push(' domain=', cookie.domain, ';');
    }

    if(cookie.secure) {
        buffer.push(' secure', ';');
    }

    if(cookie.httpOnly) {
        buffer.push(' httpOnly');
    }

    return buffer.join('');
}

response.setHeader('Set-Cookie', cookie.stringify(cookieObj));
```

而对于 session, 就是在服务器和每个用户之间保持一个 session, 两个用户之间的 session 不会共享, 而且有过期时间.
因为 session 和客户端有关, 一个客户端一个 session 对应, 所以不能支持一个客户端多个账户登录的情况.
对于 session 的使用就是在一个 hash 对象中存储对应的客户端信息和过期时间, 当请求过来的时候, 先判断有没有 session 记录或者 session 有没有过期, 如果没有过期那么就返回记录的信息, 如果已经过期那么就新建一个 session 存储在服务端, 然后设置 sessionID 在客户端的 cookie 中.

