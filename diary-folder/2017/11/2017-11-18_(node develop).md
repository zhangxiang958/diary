# node

node 的异步 IO 编程虽然接触后简单, 但是流程控制不好控制
```
for(var i = 0; i < 3; i ++) {
  fs.readFile(file[i], 'utf-8', function(err, code){
    console.log(file[i]);
  });
}
```
其实这个是闭包的问题, 就是共享了变量对象, 改造就是很简单的 IIFE, 这里不再说了.
还有异步会有回调嵌套问题, 所以难看清逻辑问题.
## git
工作区, 缓存区, 仓库, 缓存区可以看作是工作区与仓库的交集.
可以用 git branch 或者 git branch --list 来查看本地分支.git branch --all 是列出所有分支, git branch --remote 是列出远程所有分支.
从远程分支可以拿到代码, 并创建本地分支: git checkout --track origin/branch1 或者 git checkout --track -b branch origin/branch
小型团队,尤其是一个人的时候, 其实可以用一个分支来作为一个功能来管理.可以自问:
```
是否会完全丢弃现在这个想法?
是否严重偏离了原来软件的版本?
是否经过了评审?
是否有可能在完成这个任务前切换到其他任务上去?
```
git commit 直接使用可以直接写多行 commit, 而不是只有一个简短的信息, 这样有利于合作.
生成 .gtignore 文件: git config --global core.excludesfile ~/.gitignore
