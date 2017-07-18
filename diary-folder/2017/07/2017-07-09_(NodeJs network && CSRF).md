# NodeJs network && CSRF

## HTTP
http 请求本质上相当于一个流, 因此我们可以使用 stream 来处理
```
http.createServer(function(request, response){

}).listen(8080);
```

request 处理
```
http.createServer(function(request, response){

  var body = [];

  request.on('data', function(chunk){
    <!--response.write(chunk);-->
    body.push(chunk);
  });

  request.on('end', function(){
    body = Buffer.concat(body);
    console.log(body.toString());
    response.end();
  });
}).listen(80);
```
## url 模块

将接收到 url 解析或者格式化

url.parse(request.url) 变成下面这个格式:
```
//原本: http://www.example.com/path?query=string

{
  hostname: 'www.example.com',
  protocol: 'http',
  port: 80,
  path: '/path',
  search: '?query=string'
  query: 'query=string',

}
```
或者将对象形式的 url 转化为字符串形式
```
var options = {
  hostname: 'www.example.com',
  protocol: 'http',
  port: 80,
  path: '/path',
  search: '?query=string'
  query: 'query=string',

}

url.format(options);  // http://www.example.com/path?query=string
```
resolve() 将路径进行拼接

## queryString 模块
相当于浏览器端的 JSON 版本, 接收字符串或者对象, 也就是将查询字符串的参数与值对变为对象(parse)或者字符串(stringify).
```
{
  query1: 'string1',
  query2: 'string2',
  query3: 'string3',
  bar: [
    'one',
    'two'
  ]
}

变为

query1=string1&query2=string2&query3=string3&bar=one&bar=two
```

## zlib 模块
监测客户端是否支持 gzip, 使用 zlib 将数据进行压缩
```
if(request.headers['accept-encoding'].indexof('gzip') !== -1) {

  zlib.gzip(data, function(err, data){
    response.writeHeader(200, {
      'Content-type': 'text/plain',
      'Content-Encoding': 'gzip'
    });
    response.end(data);
  });
} else {
  response.writeHeader(200, {
      'Content-type': 'text/plain'
    });
    response.end(data);
}
```

## net 模块
使用 net.connect 建立 scoket 链接请求

## CSRF

本质是发送的请求能够被服务端理解, 或者说被攻击者猜测到, 大部分的 CSRF 攻击隐藏在认证后面, 并且冒充使用 cookie.
步骤应该是在用户登录了 A 网站之后, 黑客发送一个链接诱使用户点击,  B 网页中隐藏了获取或者借助 cookie 的请求, 造成攻击

GET/POST 没用的, 如果你还是使用 query 获取请求参数.

防御:
验证码, 但是不可能每一步操作都使用, 影响用户体验
检查 referer, 但是并不能准确获取, 也可以被伪造, 也可以检查 origin
最好的方式是同时检查 referer 与使用 token, token 是一个随机字符串, 在提交的时候添加到数据中,
服务端检查提交的 token 与服务端存储的(session)的 token 是否一致, 如果一致才成功. 客户端可以在 HTTP 头部或者 cookie 中找到 token.
