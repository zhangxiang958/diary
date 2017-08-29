# data structor in FE

之前看过数据结构与算法 javascript 描述, 但是发现里面所讲的算法有点错误, 而且和实际开发结合不深, 所以想写一个系列来弥补一下这方面, 希望做成一个 git book.
```
function getElementById(root, id) {
  if(!root) {
    return null;
  }
  if(root.id === id) return root;
  for(var i = 0; i < root.children.length; i++) {
    var found = getElementById(root.children[i], id);
    if(found) return found;
  }
  return null;
}
```

递归的好处在于代码简洁易懂, 但是性能会相对来说比较差, 所以可能有些人会倾向于非递归的方式.

```
function getElementById(root, id) {
  
  while(root) {
    if(root.id === id) return root;
    root = nextElement(root);
  }

  return null;
}

function nextElement(node) {
  if(node.children.length) {
    return node.children[0];
  }
  if(node.nextElementSibling) {
    return node.nextElementSibling;
  }
  while(node.parentNode) {
    if(node.parentNode.nextElementSibling) {
      return node.parentNode.nextElementSibling;
    }
    node = node.parentNode;
  }

  return null;
}
```
上面是 getElementById 的模拟算法, 我觉得有点类似于深度遍历, 这也是数据结构与算法的第一章所讲的递归与非递归.