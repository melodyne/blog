### 主要所用技术
- [Vue 2.5.x](https://cn.vuejs.org/)
- [iView](https://www.iviewui.com/)
- [iview-admin](https://github.com/iview/iview-admin)
- [iview-area](https://github.com/iview/iview-area)：城市级联组件
- [Vuex](https://vuex.vuejs.org/zh-cn/)
- Vue Router
- ES6
- webpack
- axios
- echarts
- cookie
- 第三方插件
    - [hotjar](https://github.com/Exrick/xmall/blob/master/study/hotjar.md)：一体化分析和反馈

### 本地开发构建运行

- 在项目根文件夹下先后执行命令 `npm install` 、 `npm run dev`
- 前台端口默认9999 http://localhost:9999

### 部署
- 先后执行命令 `npm install` 、 `npm run build` 将打包生成的 `dist` 静态文件放置服务器中，并配置路由代理
