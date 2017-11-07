# generater

promise 函数是为了改善回调函数， 但是如果将所有任务都进行 promise 包装， 所有任务都会是一个 then 函数， 含义不明， 所以需要 generater 函数改善异步。

generater 函数有点像协程， 将协程 A 执行到一半然后执行协程 B， 然后执行完协程 B 再回来执行协程 A 剩下的。
```
function *asyncJob(){
  // ...
  var y = yield readFile(fileA);
  // ....
}
```
asyncJob 就是一个协程， 然后 yield 是一个个分界点， 到了 yield 的一个节点就会将函数控制权交到另一个协程，等执行权返回， 再执行剩下得。
然后我们需要一个函数来封装那些需要异步的函数， 可以类似的理解为 promise 的包装函数：
```
function *gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next(); // { value: 3, done: false }
g.next(); // { value: undefined, done: true }
```
假如传入的 x 不是一个值，而是一个函数， 那么就实现了一个 generate 函数的包装。
完善一下， 保证捕获出错信息：
```
function *gen(x){
  var ret;
  try {
    ret = yield x + 2;
  } catch(e) {
    console.log(e);
  }
  return ret;
}

var g = gen(1);
g.next();
g.throw('error');
```

## git
为什么需要频繁使用 git 分支, 举个例子, 当你在需要开发新功能的时候, 就新建一个分支, 然后就在这个分支上工作.然后当线上代码出了问题, 我们就切换到线上分支, 然后新建一个紧急修补
分支, 然后合并线上分支, 然后修复好了之后切换回之前的分支继续新功能开发.
现在在开发新功能, 忽然有 bug, 那么就新建一个分支, 然后继续在上面开发, 然后线上有 bug, 切回到 master, 只是切换的时候需要工作区是干净的, 有 commit 没有提交会阻止切换的,
stashing 与 commit amending 可以解决这个问题.
像 hotfix 测试修复成功了之后, 就可以进行合并:
```
git merge hotfix
```
Fast-forward 快进, 出现在如果顺着一个分支能走到另一个分支的话, 那么 git 在合并就会只是简单地将指针右移.
当一个分支完成历史使命, 像 hostfix, 就可以删除这个分支了:
```
git branch -d hotfix
```
然后回到新功能开发分支上:
```
git checkout iis53
```
在不同祖先分支进行合并的时候, git 会自动选择最佳分支, 然后进行一个多方合并.
当分支出现冲突的时候, 需要人来裁决, 就是将文件中的那些 <<<< ==== 二选一或进行整合, 然后 git status 可以查看合并式是哪些文件发生冲突的状态, 修改之后再使用 git status 来确认
所有冲突已经修复好了, 然后就 git commit 完成合并提交.
注释:
```
merge brance iss53

Conflicts:
 index.html
#
# It look like you may be committing a merge
#
```