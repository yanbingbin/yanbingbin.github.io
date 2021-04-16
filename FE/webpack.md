## webpack 介绍

`webpack` 是一个打包模块化的工具，在 `webpack` 中一切文件都是模块，通过 `loader` 转换文件，通过 `plugin` 注入钩子，最后输出由多个模块组成的文件 `chunk`。通过 `entry` 入口自动递归解析需要加载的所有文件，然后用不同的 `loader` 处理不同的文件，用 `plugin` 扩展 `webpack` 功能。


## webpack的构建流程是什么?

`webpack` 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
- 初始化参数：从配置文件和 `Shell` 语句中读取与合并参数，得出最终的参数；
- 开始编译：用得到的参数初始化 `Compiler` 对象，加载所有配置的插件，执行对象的 `run` 方法开始执行编译；
- 编译模块：从入口文件出发，根据模块类型匹配到的 `Loader` 对模块进行翻译，将编译好的文件内容解析生成 `AST` 语法树， 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
- 完成模块编译：在经过使用 `Loader` 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk` ，再把每个 `Chunk` 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
在以上过程中， `webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 `webpack`  提供的 API  改变 `webpack` 的运行结果。

解析 `AST` 过程中有两个阶段：词法分析和语法分析。
- 词法分析阶段：字符串形式的代码转换为令牌（tokens）流，令牌类似于 `AST` 中的节点；
- 语法分析阶段：把一个令牌流转化为 `AST` 的形式，同时把令牌中的信息转化为 `AST` 的表述结构。


## 热更新原理

1. 启动 `dev-server`，`webpack` 开始构建，在编译期间会向 `entry` 文件注入热更新代码；
2. `Client` 首次打开后， `Server` 和 `Client` 基于 `Socket` 建立通讯渠道；
3. 修改文件，`Server` 端监听文件发送变动， `webpack` 开始编译，直到编译完成会触发 `Done` 事件；
4. `Server`通过 `socket` 发送消息告知 `Client`；
5. `Client` 根据`Server`的消息（ `hash` 值和 `state` 状态），通过 `ajax` 请求获取 `Server` 的manifest描述文件；
6. `Client` 对比当前 `modules tree` ，再次发请求到 `Server` 端获取新的JS模块；
7. `Client` 获取到新的JS模块后，会更新 `modules tree` 并替换掉现有的模块；
8. 最后调用 `module.hot.accept()` 完成热更新；


## 什么是bundle,什么是chunk，什么是module?  
- `bundle`: `webpack` 打包出来的文件
- `chunk`: 代码块，一个 `chunk` 可以由多个模块组成，用于代码的分割及合并
- `module`: 项目中每个文件都是一个 `module`

## 什么是Loader、

- `Loader`: 用来转换一些 `webpack` 不能解析的文件，比如 `.vue`文件，本质上是一个函数，接收源文件资源或上一个 `loader` 的返回值作为参数，返回处理后的结果。


## 有哪些常见的Loader？他们是解决什么问题的？

- `file-loader`: 把文件输出到一个文件夹中，在代码中通过相对 `URL` 去引用输出的文件
- `url-loader`: 可以将很小的文件通过 `base64` 的方式把文件内容注入到代码中，或者生成文件路径
- `source-map-loader`: 加载额外的 `Source Map` 文件，方便断点调试
- `image-loader`: 加载并压缩图片文件
- `babel-loader`: 把 `ES6` 转换成 `ES5`
- `css-loader`: 加载 `CSS`，支持模块化、压缩、导入等特性
- `style-loader`: 把 `CSS` 代码注入到 `JS` 中，通过 `DOM` 操作去加载 `CSS`
- `eslint-loader`: 通过 `ESLint` 检查 `JS` 代码

## 什么是Plugin?

- `Plugin`: 扩展 `webpack` 打包的功能，插件是含有 `apply` 方法的一个对象，`webpack` 在执行过程中会 `compiler` 会调用这个方法，传入的参数是 `compiler` 对象，可通过监听这个对象上的 `hooks` 进行一些处理。

## 有哪些常见的Plugin？他们是解决什么问题的？

- `define-plugin`：定义环境变量
- `commons-chunk-plugin`：提取公共代码
- `uglifyjs-webpack-plugin`：通过 `UglifyES` 压缩 `ES6` 代码

## 描述一下编写`loader`或plugin的思路？

- `Loader`像一个"翻译官"把读到的源文件内容转义成新的文件内容，并且每个`Loader`通过链式操作，将源文件一步步翻译成想要的样子。
- 编写`Loader`时要遵循单一原则，每个`Loader`只做一种"转义"工作。 每个`Loader`的拿到的是源文件内容 `（source）` ，可以通过返回值的方式将处理后的内容输出，也可以调用 `this.callback()` 方法，将内容返回给 `webpack`。  还可以通过 `this.async()` 生成一个 `callback` 函数，再用这个 `callback` 将处理后的内容输出出去。 此外 `webpack` 还为开发者准备了开发 `loader` 的工具函数集——`loader-utils`。
- 相对于 `Loader` 而言， `Plugin` 的编写就灵活了许多。 `webpack` 在运行的生命周期中会广播出许多事件， `Plugin` 可以监听这些事件，在合适的时机通过 `webpack` 提供的 API 改变输出结果。
  

## 如何用 webpack 优化性能

- 压缩代码，删除多余的代码注释，开启 `optimization.minimize` 压缩代码
- `CDN` 加速：在构建过程中，将引用的静态资源路径通过 `output.publicPath` 修改成 `CDN` 上对应的路径
- `tree shaking`: 将未引用的、无法执行到的代码进行删除
    - `ES6` 模块依赖关系是确定的，和运行时的状态无关，可以进行静态分析（不执行代码，从字面量上对代码进行分析

## 如何提高 `webpack` 构建速度

- 使用 `Happypack` 进行多进程加速编译
- 使用 `DllPlugin` 与 `DllReferencePlugin` 把第三方库分离出来，能够大幅提高打包的速度

## 怎么配置多页应用

可以使用 `AutoWebPlugin` 来完成简单自动化的构建，但是项目的目录结构必须遵守预设的规范，多页面需要注意的点是提取公共代码

## 组件按需加载

通过 `import(*)` 语句来控制加载时机， `webpack` 内置了对 `import(*)` 的解析，会将引入的模块作为一个新的入口生成一个 `chunk`，当代码执行到 `import(*)` 语句时，会去加载 对应生成的 `chunk`，`import(*)` 会返回一个 `Promise` 对象，为了让浏览器支持，需要事先注入 `Promise polyfill`

## 常见的 Plugin 解决了什么问题


## webpack 优化

`webpack`优化方向主要是两方面，打包体积和打包速度。体积分析用`webpack-bundle-analyzer`插件，速度分析用`speed-measure-webpack-plugin`插件。

### 配置优化 

- 通过 `include` 精确指定 `loader` 要处理的目录，通过 `exclude` 排除不处理的目录比如 `node_modules`
- 通过 `cacheDirectory` 缓存 `loader` 的执行结果； `use: 'babel-loader?cacheDirectory'`
- `resolve.modules`指定 `node_modules`、`src`作为模块查找的路径，默认配置会采用向上递归查找

### 依赖插件优化

- 小图片使用 `base64` 编码
- 路由懒加载
- 使用 `CDN`
- 使用 `production` 模式，好处是：
1. 代码自动压缩
2. 自动删除调试代码
3. 自动启动 `tree-shaking`,删除没用引用的代码，必须使用 `ES6 Module` 才能让 `tree-shaking` 生效， `common.js` 不行，因为 `ES6 Module` 是编译时引入，可以清楚的知道引入的内容，而 `common.js` 是动态引用，执行的时候才知道引入的是什么。