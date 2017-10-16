# learn linux

先将前面的 underscore 总结成博文和封装自己的版本后再继续后面的解读.
说说软链接是啥, 软链接是一个神器, 为一个文件创建一个软链接好处在于当很多文件都引用这个文件的时候, 如果需要更换这个文件的版本或者其他的, 只需要修改一个地方, 就是
将软链接指向到新版本, 其他的文件引用这个软链接就可以了.这个就可以集中式批量修改了.

```
cp 复制文件
cp path1/file path2/file  会将 file1 复制到 file2
cp -i path/file paht2/file 如果 path2 有同名文件, 那么覆盖前通知用户
cp path1/file path2/file dir 将 file1 file 复制到 dir 中
cp dir/* dir2 将 dir 中所有文件复制到 dir2 中
cp -r dir1 dir2 将 dir1 所有文件包括目录复制到 dir2 中, 如果没有 dir2 则创建
```
```
mv 移动和重命名文件, 这个命令和 cp 命令很像
mv path1/file path2/file 将 file1 移动到 file2
mv -i path1/file path2/file 将 file1 移动到 file2, 覆盖前通知
...
将 mv 命令改为 cp 命令是可以通用的
```

```
rm 是用来删除文件的, rm 命令是很危险的
rm file1 删除 file1
rm -i file1 删除 file1 前提醒
rm -r file1 dir1 删除 file1 与 dir1 以及他们的内容
rm -rf file1 dir1 file1 和 dir1 不存在也会执行 rm 命令, 且不提醒用户
```

```
mkdir 命令
例如 mkdir dir1 dir2 dir3 这样是可以创建多个文件目录的
```

```
ln 创建链接
ln file link 硬链接, 硬链接无法引用目录, 也不能引用不在同一个磁盘内的文件
ln -s item link 符号链接, item 可以是目录也可以是文件, 可以理解成 windows 下的快捷方式

```
