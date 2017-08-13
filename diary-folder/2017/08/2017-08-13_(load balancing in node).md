# load balancing in node

负载均衡对于后端是非常重要的, 除了在 HTTP 层面和 DNS, IP 层做工作之外, 还可以在后端进程方面均衡, 因为 node 可以生成创建多个进程,那进程之间的进程均衡就很重要了, 因为不能让一个进程非常忙, 另外一个进程非常闲.

其实本身 node 进程在负载均衡的时候进程已经是采用抢占式的了, 但是业务有可能 IO 繁忙, 可能导致某个进程能够抢到比较多的请求,所以会倾向于使用轮询的方式.

可以在 cluster 模块通过 
```
cluster.schedulingPolicy = cluster.SCHED_RR
cluster.schedulingPolicy = cluster.SCHED_NONE;
```

进程之间的通信, 是一个大问题, 因为进程之间内存不共享, 但是业务需要进程之间有时候需要交换信息, 所以需要借助第三方像 redis, 数据库, 或者是文件.也可以进行定时轮询, 然后当数据变化的时候通知子进程.



