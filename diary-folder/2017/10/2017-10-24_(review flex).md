# flex

之前看过关于 flex 的知识, 了解到目前一般公司在移动端已经大范围地使用 flex 布局了, 在移动端兼容性还是可以接收的范围内.

关于 flex, 其实总结起来就是四个知识点, 主轴, 辅轴, 父容器与子容器.
关于主轴, 它是可以设定方向的, 不一定就是水平方向的, 只是默认是水平方向的, 我们可以通过:
```
display: flex;
flex-direction: column;  // row 为水平, column 为垂直
```
导致项目被垂直堆叠.一旦主轴被确定下来, 那么父容器中的所有子容器将会根据这个主轴的方向, 采取对应合适的间距来分布在父容器中.
对于子容器的分布问题, 我们可以通过:
```
justify-content: center;
```
justify-content 属性是控制主轴上的元素的分布的, 如果设定为 center, 那么就会居中分布.
而对于在交叉轴, 所谓交叉轴就是与主轴垂直的那条轴, 交叉轴上的分布则是采用 align-items 属性来确定的:
```
align-items: center;
```
对于这两个属性, 他们的值是类似的, 有 flex-start, flex-end, center, baseline, stretch.

上面这些就是关于 flex 整体上的布局, 对于 item 个体来说, flex 人性话地提供了一个属性来单独控制:
```
.item {
  align-self: flex-end;
}
```
这样就可以单独地为某个元素设定样式了.