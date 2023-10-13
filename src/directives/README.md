常见的几种自定义指令：https://www.51cto.com/article/702249.html
问题：https://vue3js.cn/interview/vue/directive.html#%E4%B8%80%E3%80%81%E4%BB%80%E4%B9%88%E6%98%AF%E6%8C%87%E4%BB%A4
官网文档有详细介绍

1. 通过指令添加水印。核心就是设置target element的backgroundImage属性。
   创建一个canvas对象，但是隐藏的。
   然后在context2d上绘制文本。可以额外设置字体，大小，颜色，旋转角度等
   画完之后，设置element.style.backgroundImage，通过toDataURL 就能将canvas的视图变成背景图

2. 将弹出框变成可以拖动的。
   监听鼠标事件，设置弹出框根元素的left和top就可以了。
   有个问题，要看弹出框是不是根元素唯一。通过测试发现，如果组件里的根元素不唯一，那指令是加不上的
