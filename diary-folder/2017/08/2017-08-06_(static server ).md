# static server 

用 nodejs 写了一个静态文件服务器, 总结一下.

基本上对于一个静态文件服务器, 那么就是最基本的两点要求:
1. 有文件就返回
2. 没有文件则返回 404 Not Found

在开始返回文件之前, 需要对静态文件目录进行限制, 第一方便管理, 第二是不希望用户可以看到 server.js 的代码.
需要对路径进行一个拼接: realPath = 'assets' + url.parse(req.url).pathname;
对于第一点有文件就返回, 里面细分就需要判断一个路径是不是存在, 如果不存在就返回 404, 如果存在就返回文件.
第一次迭代会比较简单, 直接用 fs.readFile():
```
fs.readFile(realPath, function(err, file){
  if(err) {
    res.writeHead(404, 'Not Found');
    res.write('This file ' + pathname + ' was not found on this server.');
    res.end();
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.write(file);
    res.end();
  }
});
```
对于上面的这个是有问题的, 因为没有文件的 MIME 格式, 所以需要写一个 MIME 的文件映射:
```
var extname = path.extname(realPath);
extname = extname ? extname.slice(1) : 'unknown';

//MIME.js
exports.types = {
  "js": "text/javascript",
  "css": "text/style",
  "html": "text/html",
  "xml": "text/xml",
  "png": "images/png",
  "jpg": "images/jpg",
  "json": "application/json",
  "text": "text/plain"
  .......
}
```
然后进行判断:
```
fs.readFile(realPath, function(err, file){
  if(err) {
    res.writeHead(404, 'Not Found');
    res.write('This file ' + pathname + ' was not found on this server.');
    res.end();
  } else {
    var type = MIME.types[extname] || 'text/plain';
    res.writeHead(200, {
      'Content-Type': type
    });
    res.write(file, 'binary');
    res.end();
  }
});
```
然后做了 MIME 格式之后需要考虑一下缓存问题, 因为如果请求太多, 服务器硬盘 IO 吃不消, 所以缓存减少请求.
所以这里就不能继续用 fs.readFile 了, 需要使用 fs.stat 来检查一下路径是不是存在.
```
function pathHandle(){
  fs.stat(realPath, function(err, stats){
    if(err) {
      res.writeHead(404, 'Not Found', {
        'Content-Type': 'text/plain'
      });
      res.write('This file ' + pathname + ' was not found on this server.');
      res.end();
    } else {
      if(stats.isDirectory()) {
        realPath = path.join(realPath, '/', 'index.html');
        pathHandle(realPath);
      } else {
        var extname = path.extname(realPath);
        extname = extname ? extname.slice(1) : 'unknown';
        var type = MIMT.types[extename] || 'text/plain';
        res.setHeader('Content-Type', type);

        var lastModified = stats.mtime.toUTCString();
        var ifModifiedSince = 'If-Modified-Since'.toLowerCase();
        res.setHeader('last-modified', lastModified);

        if(extname.match(config.Expires.fileMatch)) {
          var expires = new Date();
          expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
          res.setHeader('Expires', expires.toUTCString());
          res.setHeader('Cache-Control', 'max-age=' + config.Expires.maxAge);
        }

        if(req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
          res.writeHead(304, 'Not Modified');
          res.end();
        } else {
          var raw = fs.createReadStream(realPath);
          res.writeHead(200, 'ok', {
            'Content-Length': stats.size
          });
          raw.pipe(res);
        }
      }
    }
  });
}

```
上面做了强缓存, 就是使用 expires 和 cache-control 来做, 然后使用 ifModifiesSince 来做协商缓存.符合配置的需要缓存的文件类型才添加缓存头部,其他的文件类型不添加.
另外比较重要的就是增加 gzip 功能, 为文件压缩, 减少带宽压力. gzip 功能需要使用 zlib 这个库
```
...
var zlib = require('zlib');
...

...
if(req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
  res.writeHead(304, 'Not Modified');
  res.end();
} else {
  var compressHandle = function(raw, statusCode, responPhare, contentLength){
    var stream = raw;
    var accpetEncoding = req.headers['accept-encoding'] || '';
    var matched = extname.match(config.Compress.match);
    
    if(matched && accpetEncoding.match(/\bgzip\b/ig)) {
      res.setHeader('Content-Encoding', 'gzip');
      stream = raw.pipe(zlib.createGzip());
    } else if(matched && accpteEncoding.match(/\bdeflate\b/ig)) {
      res.setHeader('Content-Encoding', 'deflate');
      stream = raw.pipe(zlib.createDeflate());
    } else {
      res.setHeader('Content-Length', contentLength);
    }
    res.setHeader(statusCode, reasonPhare);
    stream.pipe(res);
  }
  var raw = fs.createReadStream(realPath);
  compressHandle(raw, 200, 'ok', stats.size);
}
```
上面就是一个比较完善的静态服务器, 支持 gzip 压缩, gzip 压缩也是符合设置的文件格式才会进行压缩.
还有一步就是安全问题, 为了防止用户用过 ../ 这样的符号访问上层文件, 需要对路径进行解析.

realPath = path.resolve('assets', path.normalize(pathname.replace(/\.\./g, '')));



