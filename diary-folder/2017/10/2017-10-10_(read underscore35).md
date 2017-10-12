# read underscore31

今天断网, 那就说说今天写的一些代码的总结:
今天搞了很久的一个模块就是集中式管理后台 API 模块, 原本的的设想是:
```
export const List = [
  {
    name: 'getDailyList',
    url: '/mock/getDailyList',
    type: 'POST'
  },
  {
    name: 'getWeekList',
    url: '/mock/getWeekList',
    type: 'POST'
  }
];

export const User = [
  {
    name: 'getUserInfo',
    url: '/mock/User',
    type: 'GET'
  }
];

export const Collection = [List, User];

export CGI = [];

export function setEnv(env, host){
  CGI[env] = _.map(Collection, (uris) => {
    return _.map(uris, (url) => {
      return CGI[env] = {
        name: url.name,
        url: `${host}${url.url}`,
        type: url.type
      }
    });
  });
}
```
这样的好处是可以统一管理 api, 而且能够通过 setEnv 函数得到不同环境的 url 请求地址, 但是问题就在于这样得到的 API url 使用的时候可读性不强, 甚至很弱, 比如 CGI['testEnv']['getDiarylist'] 这样的方式来读, 这样一旦想要修改 url 还需要翻看另外一个文件, 而且不能看到这个请求的 url 是什么, 这样可读性不强.
所以最终放弃这样的写法.

但是集中起来管理 API 是需要的, 但是至于怎么做还需要继续探究, 能不能方便地区分测试环境与开发环境的请求 url, 集中式管理起后台给的 API.
而且发现前端很少写 model, 虽然写了这么久的 MV*, 但是还是觉得我们少写了 model, 怎么样才能让接手的人迅速地知道项目中的数据结构并且进行修改呢? vuex 中的 state 到底算不算是一个 model,
怎么开发才是一个最佳实践?