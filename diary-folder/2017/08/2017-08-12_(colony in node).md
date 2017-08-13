# colony in node

之前讲过 node 使用复制子进程来利用多核 CPU 的计算能力, 但是这样应用还是不够稳定.

所以仅仅依靠 send 方法和 message 事件是不行的, 因为我们需要更多的事件和信息来知道子进程的情况, 然后作出对应动作来保证子进程的健壮性, 万一进程崩溃了, 那么主进程就可以重新开启一个进程并把原来的进程关掉.

```
error: 当子进程无法发送信息, 无法被复制创建, 无法杀死的时候发生
exit: 子进程退出时触发事件, 正常退出则是第一个参数是退出码, 如果通过 kill 方法被杀死则会得到第二个参数, 表示杀死进程的信号.
close: 子进程在标准输入输出中止时触发该事件.
disconnect: 当调用 disconnect 方法的时候触发, 关闭监听 IPC
```

可以通过 kill 方法向子进程来发送一个系统信号, 来通知子进程关闭:
```
child.kill();

//child.js
process.kill(pid, [signal]);
```
第一个是发给子进程, 第二个是发给当前进程, 然后当前进程通过监听信号事件然后作出相对应的动作.

```
var fork = require('child_process').fork;
var cpus = require('os').cpus();

var server = require('net').createServer();
server.listen(1337);

var workers = {};
var createWorker = function(){
  var work = require(__dirname + './child.js');
  work.on('exit', function(){
    console.log('work' + work.pid + 'exit.');
    delete workers[work.pid];
    createWork();
  });

  work.send('server', server);
  workers[work.pid] = work;
  console.log('work' + work.pid + 'created');
}

for(var i = 0; i < cpus.length; i++){
  createWorker();
}

process.on('exit', function(){
  for(var pid in workers){
    workers[pid].kill();
  }
});

```

上面创建子进程的过程中, 监听子进程的 exit 事件, 如果退出了那么就重新创建一个进程, 如果主进程退出, 那么就关闭掉所有进程. 

另外子进程还要监听异常情况:
```
process.on('uncaughtException', function(){
  work.close(function(){
    process.exit(1);
  });
});
```
关闭所有连接并退出.需要有一段时间, 因为需要等用户关闭掉链接之后才能关闭掉进程然后重启一个进程.
但是这样还是有风险, 因为有可能所有进程都在等待退出, 然后没有进程来处理用户的请求, 对于一个高并发的网站的话, 这样会丢掉大量请求.
再来仔细思考一下这个流程, 进程在退出和等待退出这段时间, 这么长时间, 足够我们重启一个进程了, 如果我们提前重启而不是等到退出才重启就好了.所以需要在主进程监听多一个事件:
```
work.on('message', function(message){
  if(message.act === 'suicide') {
    createWorker();
  }
});

```
所以子进程需要:
```
process.on('uncaughtException', function(err){
  //发送这种异常肯定是代码健壮性不合格, 需要记录日志看看
  logger.error(err);
  //发送自杀信号
  process.send({ act: 'suicide' });
  process.close(function(){
    process.exit(1);
  });

  //设立定时是因为有可能是长连接, 设定 5 秒后进程关闭
  setTimeout(function(){
    process.exit(1);
  }, 5000);
});
```

进程不可能频繁地重启, 因为第一重启我们并不能记录错误信息, 第二频繁重启极有可能是代码有问题, 所以应该停止频繁重启进程.

```
var limit = 10;
var duration = 6000;
var restart = [];
var isTooFrequency = function(){
  var time = new Date();
  var length = restart.push(time);
  if(length > limit) {

    restart = restar.slice(limit * -1);
  }

  return restart.length >= limit && restart[restart.length - 1] - restart[0] < duration;
}
```

