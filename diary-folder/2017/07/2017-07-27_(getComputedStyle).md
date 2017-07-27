# getComputedStyle

element.style 只能获取内联样式与 style 标签里面的样式, 如果想获取外联的样式表里面的只能通过 getComputedStyle 这个 API 来获取样式.
```
var element = document.getElementById('id');
window.getComputedStyle(el, '');
```

第二个参数是伪类, 这样是获取了元素的 style 对象, 如果想获取某个样式名的属性值需要通过 getPropertyValue(name)

这里的名字就直接使用 css 样式属性名就可以

但是对于 IE ,上面的就不适用了, 需要像下面这样:

```

function camelize(attr) {

    return attr.replace(/-(w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}

element.currentStyle.getAttribute(camelize(style));
```
在 IE 里面, currentStyle 对应 getComputedStyle, getAttribute 对应 getPropertyValue , 样式名在 IE 中需要使用驼峰命名法

element.style 可读可写, 但是不管 currentStyle 还是 getComputedStyle 都是只读的.

除了 window 对象可以调用 getComputedStyle, document.defaultView 也可以调用.

## 兼容问题

对于标准浏览器, getProperty 可以直接获取 float 的值, 但是由于 float 是 js 中的一个保留字, 所以在 IE 中为 styleFloat, 在标准浏览器为 cssFloat, 但是我查了一下, chrome 并没有 cssFloat 这个属性, 所以我觉得还是使用 float 就可以, IE 使用 styleFloat.

对于 width|height, 标准浏览器使用 getComputedStyle 返回 px, IE678 中 currentStyle 会返回一个 auto 默认值, 这里没有错, 其实这样是正确的, 但是我们在编写 API 的时候希望它返回来一个 px 值, 所以使用 getBoundingClientRect 这个 API 来达到目的.

cssText 在 IE 中, 如果设置的时候是 += 的形式, 会将最后一个 ; 去掉, 所以通用做法是 ele.style.cssText += ';' + (style + ':' + value);

最后有个不透明度的问题, IE 中有两个设置透明度的方法:
```
alpha(opacity=0.5)
filter:progid:DXImageTransform.Microsoft.gradient( GradientType=0, startColorstr="#cccccc", endColorstr="#dddddd" )
```

所以在封装 API 的时候需要注意:
```
var filter = null;

filter = elem.style.filter.match(/progid:DXImageTransform.Microsoft.Alpha(.?opacity=(.*).?)/i) || elem.style.filter.match(/alpha(opacity=(.*))/i);

if(filter) {

    var value = parseFloat(filter);

    if(!isNaN(value)) {
        return value ? value / 100 : 0;
    }

    return 1;
}
```

