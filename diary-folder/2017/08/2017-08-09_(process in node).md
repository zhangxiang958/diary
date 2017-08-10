# process in node

进程之于后台，相当于 HTML 之于前端，进程是非常重要的。
很久以前的服务器架构是单个请求来处理，服务器一次只能处理一个请求，后续的请求只能等待前面的请求处理完才能被处理，这样的服务器架构已经被淘汰了，因为不符合目前高并发的服务器架构需求。
另外一种就是复制进程，通过复制多个进程，而进程又能处理请求，来应对高并发请求，但是缺点在于复制进程往往会将进程的状态变量等等全部复制，进程间的变量等等无法共享，而且进程数一般有限制（内存吃不消），如果请求数大于进程数，会有可能发生奔溃。
另外一种就是多线程，多线程比多进程略好，它消除了复制进程无法共享信息的缺点，线程可以共享一个进程的信息。减少了切换进程上下文的开销，但是问题在于如果线程数过多， CPU 就需要不断地将时间片缩短，这样 CPU 的时间都耗费在了切换线程上下文上了。
最后一种就是事件驱动，像 node，nginx 这样的服务器，使用事件驱动，减少了切换上下文的开销，运行在单线程中，避免不必要的内存开销和上下文切换。

node 是运行在单线程的，影响性能的是 CPU 的计算能力，它的上限决定服务的上限，所以 node 首先需要解决的问题是如何利用多核 CPU。
node 提供创建子进程的 API，我们可以通过子进程来做我们的业务处理，主进程负责调度管理子进程。也就是主从关系。

创建子进程：
```
spawn  启动一个子进程执行命令
exec 启动一个子进程执行命令，和 spawn 不同在于 API 不同， exec 接受一个回调获知子进程状态， 可以设定超时的 timeout
execFile 启动一个子进程来执行可执行文件，可以设定超时的 timeout， 和 exec 不同在于 execFile 是适合执行文件。exec 适合命令
fork  类似于 spawn， 不同点在于它创建的 Node 子进程只需指定要执行的 javascript 模块。
```
对比：
```
方法名     回调    进程类型    执行类型   可否设置超时
spawn      no       任意       命令         否
exec       yes      任意       命令         是
execFile   yes      任意     可执行文件      是
fork       no       node   javscript 文件   否
```
如果需要 execFile 执行 javscript 文件，那么 javscript 前面需要添加 #!/usr/bin/env node

进程间通讯需要使用 IPC, 就像浏览器的 web worker API,

var work = new Work('./work.js');
work.onmessage = function(data){
    console.log(data);
}


//work.js
var data = {
    test: 'test'
};

postMeaage(data);
对于 Node 进程, 父子进程之间的通信可以通过 message 和 send 方法:

//main
var cp = require('child_process');
var n = cp.fork(__dirname + 'sub.js');

n.on('message', function(m){
    console.log(m);
});

n.send({ data: 'test' });

//sub.js
process.on('message', function(m){
    console.log(m);
});

process.send({ foo: 'bar' });