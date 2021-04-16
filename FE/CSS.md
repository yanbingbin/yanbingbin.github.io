
## 布局

### 两边固定中间自适应

定位：
父元素设置相对定位，左子元素绝对定位`left`、`top` 为 `0`,右子元素 `right`、`top` 为 `0`，中间元素 `margin：0 width`

`flex`:
父元素设置 `flex`，中间元素设置 `flex: 1`；

浮动：
左元素左浮动，右元素右浮动，中间元素 `margin：0 width`

`BFC`：利用 `BFC` 的区域不会与float box重叠，这里需要注意的是main标签的位置需要放在left、right的后面
```css
<div class="container">
    <div class="g-fl"></div>
    <div class="g-fr"></div>
    <div class="main"></div>
</div>
.container {
    border: 3px solid #888888;
    margin-top: 20px;
    overflow: hidden;
}
.main {
    overflow: hidden;
    height: 200px;
}
```


### div 水平垂直居中

- `flex` 布局：父元素设置`display: flex; justify-content: center; align-items: center;`   
- 定位：父元素相对定位，子元素绝对定位，距上50%，据左50%，然后负的 `margin` 元素自身宽高的一半距离
>   position: absolute;            
    left: 50%;            
    top: 50%;            
    margin: -50px 0 0 -50px;  // 未知宽度 transform: translate(-50%,-50%);
- `table`：父元素设置 `display: table;`，子元素设置 `display: table-cell; vertical-align: middle;`

```css
div.parent {
    display: grid;
}
div.child {
    justify-self: center;
    align-self: center;
}
```

## css

### 盒模型

盒模型分为标准盒模型和IE盒模型两种。
- 标准盒模型：设置的`width` 和 `height` 指的是内容区域的宽度和高度，增加 `padding` 和 `border` 不会影响内容区域的尺寸，但会增加盒子的总尺寸，默认为标准盒模型，通过`box-sizing: content-box`设置。
- IE盒模型：设置的`width` 和 `height` 指的是内容区域 + `border` + `padding` 的宽度和高度，通过`box-sizing: border-box`设置；

### BFC Block Formatting Contexts 

`BFC` 是块级格式化上下文，具有 `BFC` 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素。只要满足任一条件即可触发`BFC`
- 根元素 `html`
- 浮动元素： `float` 除了 `none` 以外的值
- 定位元素：`position` 为 `absolute` 或者 `fixed`
- `display` 为 `inline-block` 或者 `flex`、`table-cells`
- `overflow` 为 `hidden`、`scroll`、`auto`

可以用来处理垂直 `margin` 重叠的问题，还可以用来清除浮动，阻止元素被浮动元素覆盖。

### IFC Inline Formatting Contexts

内联格式化上下文，设置元素为 `inline-block` 则会在外层产生 `IFC`，通过 `text-align` 则可以使其水平居中。。

### flex

- `flex-basis` 定义了该元素的空间大小
- `flex-grow` 若被赋值为一个正整数， `flex` 元素会以 `flex-basis` 为基础，沿主轴方向增长尺寸, 赋值为正数的话是让元素增加所占空间。
- `flex-shrink` 属性是处理 `flex` 元素收缩的问题,正数可以让它缩小所占空间，但是只有在flex元素总和超出主轴才会生效，为0时不收缩。

`flex` 简写顺序：`flex-grow`，`flex-shrink`，`flex-basic`， 默认 `0 1 auto`。
`flex: 1`: 相当于 `flex: 1 1 0`，可以自由伸缩。

### CSS3新特性

- 新增选择器 p:nth-child(n){color: rgba(255, 0, 0, 0.75)}
- 弹性盒模型 display: flex;
- 媒体查询 @media (max-width: 480px) {.box: {column-count: 1;}}
- 颜色透明度 color: rgba(255, 0, 0, 0.75);
- 圆角 border-radius: 5px;
- 渐变 background:linear-gradient(red, green, blue);
- 阴影 box-shadow:3px 3px 3px rgba(0, 64, 128, 0.3);
- 文字溢出 text-overflow:ellipsis;
转换
- 旋转 transform: rotate(20deg);
- 倾斜 transform: skew(150deg, -10deg);
- 位移 transform: translate(20px, 20px);
- 缩放 transform: scale(.5);
- 平滑过渡 transition: all .3s ease-in .1s;
- 动画 @keyframes anim-1 {50% {border-radius: 50%;}} animation: anim-1 1s;


### 1px 

- 伪元素 + transform: scale(.333)  @media (-webkit-min-device-pixel-ratio: 3)
    - scale(.5)  @media (-webkit-min-device-pixel-ratio: 2)

### 重绘回流

- 回流（重排）：当 `DOM` 中的元素发生尺寸、位置的改变时，甚至调用方法`getComputedStyle`，为了保证得到的结果是`即使性`和`准确性`，浏览器会重新渲染部分或者全部文档,这个过程就叫回流。
- 重绘：对 `DOM` 中元素的外观进行修改，比如 `color`、`background-color`等，浏览器会将新样式赋给元素并且重新绘制的过程叫重绘。

回流一定会导致重绘，回流的开销更大，应该尽可能的避免回流。

优化策略：
- 减少回流范围：避免使用 `table` 布局，因为一个小改动可能会造成整个 `table` 的重新布局
- 使用 `documentFragment` 操作 `dom`，操作完成后再添加到文档中
- 避免频繁读取会引发回流/重绘的属性（`getComputedStyle`、`getBoundingClientRect`、`offsetTop`...），如果确实需要多次使用，就用一个变量缓存起来。
- 使用 `transform、opacity、filters` 属性开启硬件加速（GPU加速）不需要回流重绘，直接由合成线程处理。
- 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。
- 现代浏览器会自己缓存一个 `flush` 队列，然后一次性清空。


### BEM  

`BEM` 的意思就是块（`block`）、元素（`element`）、修饰符（`modifier`）。是一种前端命名方法论。这种巧妙的命名方法让你的 css 类对其他开发者来说更加透明而且更有意义。

通过 bem 的命名方式，可以让我们的 css 代码层次结构清晰，通过严格的命名也可以解决命名冲突的问题，但也不能完全避免，毕竟只是一个命名约束，不按规范写照样能运行。
```css
/* 块即是通常所说的 Web 应用开发中的组件或模块。每个块在逻辑上和功能上都是相互独立的。 */
.block {
}
/* 元素是块中的组成部分。元素不能离开块来使用。BEM 不推荐在元素中嵌套其他元素。 */
.block__element {
}
/* 修饰符用来定义块或元素的外观和行为。同样的块在应用不同的修饰符之后，会有不同的外观 */
.block--modifier {
}
```
