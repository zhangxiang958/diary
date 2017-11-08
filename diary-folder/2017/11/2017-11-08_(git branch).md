# git branch

分支管理， git branch 如果不加任何的参数， 那么就会打印出项目所有分支信息， 如果是当前分支那么分支前面会有一个 * 号：
```
git branch

*develop
master
iss53
```
如果需要看每个分支最后一次提交的信息， 就可以使用 git branch -v
```
git branch -v
*develop 7454hjkh5das45 developing
master 43ad4s6asd4 online
iss53 454asdd664da6qe issue is done
```
如果要查看哪些分支已经被合并到当前分支上去， 那么就可以通过 git branch --merged
```
git branch --merged
iss53
*master
```
因为 iss53 已经合并到 master 中了， iss53 已经完成了使命了， 所以可以删除掉这个分支、
```
git branch -d iss53
```
对应还有未合并的分支：git branch --no-merged
```
git branch --no-merged
develop
```
此时如果使用 git branch -d develop 会失败， 因为没有合并不能删除分支， 所以要不:
```
git checkout master
git merge develop
git branch -d develop
```
合并后删除,  要不就强制删除: -D
```
git branch -D develop
```
分支工作流上，分为长期分支与特性分支， 长期分支就是说保持一个分支是稳定的， 另外的分支是用于后续开发的， 如果在后续开发的分支代码稳定后，可以将代码合并到主分支也就是稳定的分支上， 需要注意如果是采取这个方式， 主分支肯定是大大落后于后续开发的分支提交数的。
特性分支是像在 master 上开发， 为了解决某些问题新建分支，待问题解决了之后合并到主分支上。