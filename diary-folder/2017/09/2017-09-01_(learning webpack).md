# learning webpack

之前工作室的时候会自己搭项目骨架, 但是最近都是使用 feb, 觉得里面可能还有一些流程上的或是性能上的优化, 所以重新学习一下 webpack, 以便优化项目性能.

首先弄清楚 webpack 的配置, 需要先知道两个最为重要的配置项:
```
entry: {},
output: {}
```

一个是入口配置项, 一个是输出文件配置项. webpack 本质上一个模块打包器, 之前在稍微研究一下 webpack 的时候就已经知道了, 但是在实战方面还是欠缺了.
entry 可以接收字符串值, 数组, 和对象:
```
entry: './src/index.js'

entry: ['./src/index1.js', './src/index2.js'];  //说明两个入口

//对象形式就是多页面的那种
entry: {
  main: './src/index.js',
  second: './src/index2.js',
  vendor: ['react', 'react-dom']
}

例子:
entry: {
  home: './src/home.js',
  about: './src/about.js',
  contact: './src/contact.js'
}
```
输出的配置项 output
```
output: {
  path: path.join(__dirname, './dist');
  name: 'js/bundle-[name]-[hash].js',
  chunkFilename: 'js/[name].chunk.js',
  publicPath: '/dist/'
}
```
[name] 表示文件的输出名字, [id] 是 chunk id, 这个倒是由于前面的学习容易理解, [hash] 唯一 hash 值, [chunkhash] 根据内容生成的 hash 值, [ext] 资源拓展名, 这个也很容易理解, 因为
webpack 主要是在 node 中运行, node 有 fs 可以获取到文件拓展名.
前面的学习知道 webpack 是通过打包模块得到最后的输出文件的, 而模块的由来也就是从入口文件开始的进行深度遍历编译得到的 require 进来的文件, 那么这些一个个文件需要对应的模块加载器来做对应工作, 也就是 module.
```
module: {
  rules: [{
    test: '/(\.jsx|\.js)$/',
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['es2015', 'react']
      }
    }
  }, {
    test: '\.css$',
    use: ["style-loader", "css-loader"]
  }]
}
```
PS: 翻看日记, 发现一个问题, 最近的日记没有一个固定的主题, 都是每天都是完全不一样的领域, 这样不利于技术的深究, 需要为技术研究领域制定优先级才行.