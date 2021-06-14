## [Vite](https://cn.vitejs.dev/)简介

一种新型的前端开发与构建工具，能够显著提升前端开发体验。它主要由两部分组成：
- 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。
- 一套构建指令，它使用 Rollup 打包你的代码，并且它是预配置的，可以输出用于生产环境的优化过的静态资源。

## vite快的原因

vite 以原生 ESM 方式服务源码，省去了打包流程，直接通过 HTTP 请求源码，按需加载。

![tcp4.png](https://cn.vitejs.dev/assets/esm.3070012d.png)

webpack 需要对整个项目文件进行打包，启动速度随着项目文件越来越多而变慢，热更新也会变慢。

![tcp4.png](https://cn.vitejs.dev/assets/bundler.37740380.png)

### 依赖预构建

首次启动 vite ，使用 esbuild 进行依赖预构建：
- 将 CommonJS 或 UMD 发布的依赖项转换为 ESM
- 将有许多内部模块的 ESM 依赖关系转换为单个模块
- 与构建的依赖缓存到 node_modules/.vite，解析后的依赖请求会进行强缓存

## vite 执行流程

1. 启动静态服务，通过 `koa-static` 以 `vite` 的运行目录作为启动目录
2. 服务启动后，加载依赖文件，截取文件流中的数据解析 `import` 关键字，重写路径添加 `/@modules/`
    - 浏览器原生不支持 `import { effect } from vue` 的 `from` 后面不带路径的写法
3. 根据当前运行 `vite` 的目录从 `node_modules` 中解析出 `vue` 的文件表，包含 `vue3` 的所有模块
4. 通过匹配 `/@modules` 去找到需要使用的包，然后根据文件表返回给浏览器
5. 对于 `.vue` 文件，`vite` 会找到 `vue3` 的 `compiler` 包使用里面提供的方法进行编译再返回

## vite 存在的问题

- 使用的 ESM 只有现代浏览器支持
- 文件在服务端进行转换，如 .vue 转 js
- 目前还处在初期，不稳定，周边生态还不完善


