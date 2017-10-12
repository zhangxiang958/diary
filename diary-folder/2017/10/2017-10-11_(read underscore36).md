# read underscore32

是时候加强一下自己的 linux 使用了.
```
ls -a  // 全部文件
ls -F  // 将文件标志符也加上, 比如如果是文件夹那么就要加上一个 /
ls -l  // 长格式
```

至于怎么看长格式呢?
```
-rw-r--r-- 1 root root 3576296 2012-04-03 11:05 Experience ubuntu.ogg
按顺序解读:
访问权限 
开头的 - 表示是一个文件, 如果是 d 则是目录.
接下来的三个字符代表文件所有者访问权限
再接下来三个字符代表所属成员组的访问权限
最后三个字符代表所有人的访问权限

1 表示文件硬链接数量为 1 
root 表示文件所有者名字
root 表示文件所有组名称
3576296 表示文件大小
2012-04-03 11:05 表示上次修改日期
Experience ubuntu.ogg 文件名
```
file 命令查看文件类型  file  xxx
less 查看文件内容  less xxx(q 退出, h 显示帮助)

/bin 系统文件
/boot linux 内核等等
/dev 设备目录
/etc 有趣
/home 自己的目录
/lib 核心共享库
/lost+found 用于系统崩溃恢复分区
/media 设备挂载点
/opt 安装软件
/root root 账户目录
/usr 普通用户所有程序
/var 所有可能改变的文件,各种数据库

