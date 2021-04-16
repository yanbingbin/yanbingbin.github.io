## Vue相关

### 响应式数据原理

1. 用户传入 `data`，初始化 `initData`，通过 `Object.defineProperty` 劫持数据的 `get`、`set`
2. 挂载模板时，会执行 `new Watcher`，将当前 `watcher` 实例保存到 `Dep` 中，然后获取数据触发了 `get`，执行 `dep.depend` 让当前属性的 `dep.subs` 保存 `watcher` 实例，同时 `watcher` 也存储 `dep`，进行一个双向依赖。
3. 修改数据，触发 `set`，执行 `dep.notify`，通知当前 `dep` 保存的 `watcher` 执行 `update` 进行更新。

- `响应式`采用观察者模式
- `Dep`：发布者，可以添加订阅者和对订阅者发布通知
- `Watcher`：观察者，接收到通知进行更新

- `Object.defineProperty` 劫持数组下标性能太差，采用重写数组原型上的方法进行更新视图；通过 `Object.create()` 拷贝了一份数组的原型方法，并重写了其中 `7` 个方法，在调用这7个方法的时候执行 `dep.notify` 通知视图更新
    - `push`, `pop`, `shift`, `unshift`, `reverse`, `sort`, `splice`
- `Object.defineProperty` 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。`Proxy` 可以劫持整个对象。
- `Proxy` 不仅可以代理对象，还可以代理数组。还可以代理动态增加的属性。

### Vue 监听数组变化

- 数组考虑性能原因没有对数组的每一项进行拦截，选择重写数组原型方法，将原生方法拦截下来加了自己的逻辑
- 数组中如果是对象数据类型也会进行递归劫持
- 数组的索引和长度变化是无法监听到的

### Virtual DOM 

- `Virtual DOM` 就是用 `js` 对象来描述真实 `DOM`，是对真实 `DOM` 的抽象，通常包含 `标签名`、`属性`、`事件监听`、`子元素`等。
- 通过 `diff` 算法对比差异进行更新 `DOM`， 可以减少对真实 `DOM` 的操作
- 虚拟 `DOM` 不依赖真实平台环境可以实现跨平台 `(weex/SSR)`


优点：
- 减少不必要的 `dom` 操作
- 跨平台渲染

缺点：
- 需要额外的创建函数 `crateElement`
- 初始渲染会慢一点

### diff 算法原理

`Vue` 的 `diff` 算法使用深度优先，同层比较的策略，内部采用 `双指针` 的方式进行比较，执行 `patch` 方法的时候进行比较

- 先比较是否相同节点，通过判断 `key`、`标签tag`、`input 的 type 类型`等
- 相同节点会复用老节点，不相同直接替换，如果新老节点都有子节点，则对比子节点 `updateChildren`, 这里才是 `diff` 核心
- 比较子节点，考虑老节点和新节点儿子的情况x3
- 优化比较-双端比较-头尾缩进：头头、尾尾、头尾、尾头
- 对比查找进行复用

### key 的作用

`key` 的作用主要是为了高效的更新 `虚拟DOM`，`Vue` 在 `patch` 的过程中通过 `key` 可以判断两个虚拟节点是否相同，从而避免频繁更新不同元素，在 `Dom diff` 头尾交叉比较后没有结果时，会给老节点数组创建一个 `key` 的索引表，没找到则就是新增节点，找到了则 `patch` 新老节点。

### Vue 如何收集依赖

- 每个属性都有自己的 `dep` 属性，存放他所依赖的 `watcher` ，当属性变化后会通知自己对应的 `watcher` 去更新
- 默认在初始化时会调用 `render` 函数，此时会触发属性依赖收集，通过 `dep.depend()` 收集
- 当属性发生修改时会触发 `watcher` 更新，通过 `dep.notify()` 

### 渲染流程

1. 将 `template` 模板转化成 `ast` 语法树，`root: { tag: 'div', type: 1, attrs: [{ name: 'id', value: 'app' }], parent: null, children: [] }`
2. 将 `ast` 语法树生成最终的 `render` 函数，加上 `with`绑定作用域， `_c('div', { id: 'app' }, _c('p', undefined, _v('hello' + _s(name))));`
3. 执行 `render` 生成 `vnode`（会 `new Watcher`）， 通过 `patch` 将 `vnode` 渲染到真实节点 

### Vue 生命周期钩子如何实现

- Vue 的生命周期钩子就是回调函数，当创建组件实例的过程中会调用对应的钩子方法
- 内部会对钩子函数进行处理，将钩子函数维护成数组的形式

### Vue.set 方法如何实现

- `observe` 会给对象和数组本身增加 `dep` 属性，当给对象新增不存在的属性不能触发对象依赖的 `watcher` 去更新，这时候我们就需要用到 `set`
- 内部会判断如果传入的对象是数组调用数组本身的 `splice` 方法更新数组
- 如果是新增不存在的属性的话，内部调用 `defineReactive` 方法将属性定义成响应式的

### 组件渲染流程

- 产生组件虚拟节点 -> 创建真实节点 -> 插入到页面中

### data 为什么是个函数

`Vue`组件可能存在多个实例，如果使用对象形式定义 `data`，则会导致它们共用一个`data`对象，那么状态变更将会影响所有组件实例，这是不合理的；采用函数形式定义，在`initData`时会将其作为工厂函数返回全新`data`对象，有效规避多实例之间状态污染问题。而在 `Vue` 根实例创建过程中则不存在该限制，也是因为根实例只能有一个，不需要担心这种情况。


### nextTick 的原理

- `vue` 内部维护了一个队列，需要更新的 `watcher` 对象会存放到这个队列中，然后执行这个队列内 `watcher` 的 `run` 更新的方法会通过 `nextTick` 添加到 `callbacks` 数组中
- 我们调用 `nextTick` 的回调函数也会存放到这个 `callbacks` 数组中，`nextTick` 有一个 `pending` 参数，等到上一个 `callbacks` 中任务执行完成后才执行新添加来的任务。
- 内部 `timerFunc` 会依次尝试 `promise`、`MutationObserver`、`setImmediate`、`setTimeout`来清空 `callbacks` 内的回调函数。
- 这样当我们修改 `data` 的属性，会先执行 `watcher` 的更新视图方法，这样就能在 `nextTick` 的回调中拿到更新后的 `DOM` 了。

### 父子组件通信方法

- 父子间通信  父->子通过 `props` 、子-> 父 `$on、$emit` (发布订阅)
- 获取父子组件实例的方式 `$parent、$children`
- 在父组件中提供数据子组件进行消费 `provide、inject` 插件
- Ref 获取实例的方式调用组件的属性或者方法
- Event Bus 实现跨组件通信  `Vue.prototype.$bus = new Vue`
- Vuex 状态管理实现通信  `$attrs、$listeners`

### computed 和 watch 

- `computed` 是计算属性，依赖其他属性计算值，并且 `computed` 的值有缓存，只有当计算值变化才会返回内容
    - `computed` 本质是一个惰性求值的观察者 `computed watcher`。其内部通过 `dirty` 属性标记计算属性是否需要重新求值。
    - 当 `computed` 的依赖状态发生改变时,就会通知这个惰性的 `watcher computed`, `watcher` 通过 `this.dep.subs.length` 判断有没有订阅者,
    - 有的话,会重新计算,然后对比新旧值,如果变化了,会重新渲染。 (`Vue` 想确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化时才会触发渲染 `watcher` 重新渲染，本质上是一种优化。)
    - 没有的话,把 `dirty` 改成 `true` (当计算属性依赖于其他数据时，属性并不会立即重新计算，只有之后其他地方需要读取属性的时候，它才会真正计算，即具备 lazy（懒计算）特性。)
- `watch` 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作
    - `watch` 的 `deep: true`：当我们需要深度监听对象中的属性时，可以打开 `deep：true` 选项，内部对监听对象中的每一项进行取值，执行对应的 `get` 方法，将当前 `watcher` 存入到属性的依赖中，这样对象属性发生变化 `watcher` 会更新
- 所以一般依赖别的属性来动态获取值的时候可以使用 `computed`，对于监听到值的变化需要做一些复杂业务逻辑的情况下可以使用 `watch`


### keep-alive

`keep-alive` 是 `Vue` 提供的一个全局组件，`Vue` 的组件是有销毁机制的，比如条件渲染、路由跳转，组件都会进行销毁，再次回到页面，组件又会进行重新创建，如果我们想保存页面的一些数据，比如说 `tab` 切换，我还想保留 `tab` 切换前的数据， 这时候就可以使用 `keep-alive` 了，它可以帮助我们缓存组件的实例，组件被 `keep-alive` 包裹后，组件创建后就不会销毁，组件状态和数据得以保存。但是没有销毁，也没有重生，所以就会失去原有的生命周期的钩子函数，所以我们需要使用另外两个钩子：
- `activated`: 唤醒休眠组件时执行
- `deactivated`: 组件进入休眠状态时执行
通常我们通过在路由元信息 `meta` 对象中设置是否缓存的标识。
`keep-alive` 使用 `LRU` 算法，最近被使用或访问的组件放置在最前面，如果组件被重新唤醒，将该组件放到头部，当缓存数量达到最大值时，将最近最少访问的数据删除。其核心思想是“如果数据最近被访问过，那么将来被访问的几率也更高”

1. 获取 `keep-alive` 包裹着的第一个子组件对象及其组件名；
2. 根据设定的黑白名单（如果有）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例（`VNode`），否则执行第三步；
3. 根据组件 `ID` 和 `tag` 生成缓存 `Key` ，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该 `key` 在 `this.keys` 中的位置（更新key的位置是实现LRU置换策略的关键）
4. 在 `this.cache` 对象中存储该组件实例并保存 `key` 值，之后检查缓存的实例数量是否超过 `max` 的设置值，超过则根据 `LRU` 置换策略删除最近最久未使用的实例（即是下标为 `0` 的那个 `key`）。


### vue 事件绑定

- 原生事件绑定采用 `addEventListener` 实现
- 组件绑定的事件采用 `$on`


### SSR 

`SSR` 是服务端渲染，将 `Vue` 在客户端把标签选择成 `HTML` 的工作放在服务端完成，直接返回 `HTML`，能减少首屏渲染时间和更好的支持 `SEO`，只支持 `beforeCreate`、`created` 钩子，在 `Node` 渲染过程中调用的第三方库必须支持服务端渲染

- `app.js` 分别给 `Server entry 、Client entry` 暴露出 `createApp()` 方法，使得每个请求进来会生成新的 `app` 实例。而 `Server entry` 和 `Client entry` 分别会被 `webpack` 打包成 `vue-ssr-server-bundle.json` 和`vue-ssr-client-manifest.json`
- `Node` 端会根据 `webpack` 打包好的 `vue-ssr-server-bundle.json`，通过调用 `createBundleRenderer` 生成`renderer` 实例，再通过调用 `renderer.renderToString` 生成完备的 `html` 字符串
- `Node` 端将 `render` 好的 `html` 字符串返回给 `Browser`，同时 `Node` 端根据 `vue-ssr-client-manifest.json`生成的 `js` 会和 `html` 字符串进行组装，完成客户端激活 `html`，使得页面可交互


### Vue3

- 速度更快
- 体积减少
- 更易维护
- 更接近原生
- 更易使用


- 响应式 - `proxy`
- `composition api` 、`TS`, `Tree shaking`
- `虚拟DOM`算法优化，最长递增子序列，静态节点标记
- `Teleport` 传送门
- `Fragment` 组件支持多根节点


`vue3`相比`vue2`

- 重写了虚拟`Dom`实现

- 编译模板的优化

- 更高效的组件初始化

- `undate`性能提高1.3~2倍

- `SSR`速度提高了2~3倍


### Vuex

### 为什么 mutation 中不能做异步操作

vuex中在mutation中使用异步，其实对结果是没有影响的，只是人为规定不能在mutation中使用异步

- 每个 `mutation` 执行完都可以对应到一个新的状态，`devtools` 可以保存快照，正确记录值的变化
- 设计理念，将有副作用的函数放在action中，同步修改放在mutation中
- 内部通过 `_withCommit` 函数验证传入的函数是同步执行。


### vue-router

`vue-router` 有网页端有两种模式：
- `hash` 模式：通过 `hashchange` 监听浏览器地址 `hash` 值变化，执行相应的 `js` 切换网页, 可以通过 `location.hash` 获取和设置 `hash` 值。
- `history` 模式：通过监听 `popstate` 实现 `url` 地址改变，网页内容改变。

比较明显的区别是 `hash` 会在浏览器地址后面增加 `#` 号，而 `history` 可以自定义地址，但是需要后端的支持。

`router` 监听到路由改变后，获取当前路径去匹配对应的记录，当路径变化时更新 `_route`，在 `beforeCreate` 中对该属性进行了劫持，更新后触发 `set`，`watcher` 执行 `update` 更新页面。


### vuex

在 `install` 中利用 `mixin` 混入 `beforeCreate`，递归给当前组件实例添加 `$store` 属性，

### 组件库

采用 `BEM` 规范样式定义，使 `CSS` 的代码结构清晰。


### Vite

> 是一个基于浏览器原生ES模块导入的开发服务器，在开发环境下，利用浏览器去解析 import，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随启随用。同时不仅对Vue文件提供了支持，还支持热更新，而且热更新的速度不会随着模块增多而变慢。


流程：
1. 首先启动静态服务，通过 `koa-static` 以 `vite` 的运行目录作为启动目录
2. 服务启动后，`vite` 会获取文件流中的数据解析 `import` 关键字，重写路径添加 `/@modules/`
    - 浏览器原生不支持 `import { effect } from vue` 的 `from` 后面不带路径的写法
3. 根据当前运行 `vite` 的目录从 `node_modules` 中解析出 `vue` 的文件表，包含 `vue3` 的所有模块
4. 通过匹配 `/@modules` 去找到需要使用的包，然后根据文件表返回给浏览器
5. 对于 `.vue` 文件，`vite` 会找到 `vue3` 的 `compiler` 包使用里面提供的方法进行编译再返回
6. 这就是整个 `vite` 

流程：
- `vite` 一开始将应用中的模块区分为 ***依赖*** 和 ***源码*** 两类，改进开发服务器启动时间
    - ***依赖***：开发时不会变动的代码，一些较大的依赖处理起来代价很高， `vite` 使用 `esbuild` 预构建依赖，缓存在 `/node_modules/.vite` 下，而依赖模块请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行强缓存
    - ***源码***：通常包含一些非 `js` 文件，比如 `jsx、.vue`，需要进行转换，时常会被编辑，同时不是所有的源码需要同时被加载，基于路由用到了才去加载，源码模块的请求会根据 304 Not Modified 进行协商缓存
- `vite` 本地在启动服务器，读取 `html` 文件，执行 `import { createApp } from 'vue'`，原生 `ES` 不支持裸模块导入，`vite` 会对服务的所有源文件检测这些裸导入模块，并执行一下操作
    - 进行`依赖预构建`，用 `esbuild` 把检测到的依赖预先构建了一遍， 在预构建这个步骤中，还会对 `CommonJS/UMD` 转换成 `ESM` 格式。比如执行 `import { debounce } from 'lodash-es'` 时， `lodash` 有超过 `600` 个内置模块，浏览器就会发起 `600` 个网络请求，而通过预构建 `lodash` 提前打包成为一个单文件 `bundle`，只需要一个请求。
    - 重写导入为合法的 `URL`， 比如 `/node_modules/.vite/vue.js?v=f3sf2ebd` 以便浏览器能够正确导入它们。
- `vite1` 版本是通过识别解析 `import` 语法的 `.vue`， 内部维护一个 `vue3` 的包的路径映射包，拿到 `compiler-sfc` 包中的 `compileTemplate` 方法编译 `.vue` 文件后返回
- 现在 `2.0` 是通过 `@vitejs/plugin-vue` 插件来处理 `.vue` 文件，`Vite 2.0` 核心已经是框架无关的了


### Vue 优化

1. 不要将所有的数据都放在data中，data中的数据都会增加getter和setter，会收集对应的 watcher
2. vue 在 v-for 时给每项元素绑定事件需要用事件代理
3. SPA 页面采用keep-alive缓存组件
4. 拆分组件( 提高复用性、增加代码的可维护性,减少不必要的渲染  )
5. v-if 当值为false时内部指令不会执行,具有阻断功能，很多情况下使用v-if替代v-show
6. key 保证唯一性 ( 默认 vue 会采用就地复用策略 )
7. Object.freeze 冻结数据
8. 合理使用路由懒加载、异步组件
9. 尽量采用runtime运行时版本
10. 数据持久化的问题 （防抖、节流）


### 单元测试

`Karma` 是一个基于 `Node.js` 的 `JavaScript` 测试执行过程管理工具，又称 `Test Runner`。

`Mocha` 是一个功能丰富的前端测试框架。所谓"测试框架"，就是运行测试的工具。通过它，可以为 JavaScript 应用添加测试用例，从而保证代码的质量。Mocha 既可以基于 Node.js 环境运行也可以在浏览器环境运行。常用的测试框架还有 Asmine 、 Jasmine 等。

`Chai` 是一个断言库，类似于 Node 的内置断言。通过提供许多可以针对代码运行的断言，它使测试变得更加容易。不同断言库的语法都大同小异。