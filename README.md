# js回调的心酸历程

### 运行前准备：
`npm i -g gulp bower` 
   
全局安装gulp、bower。

[gulp](http://www.gulpjs.com.cn/)是一个基于流的自动构建工具。

[bower](https://bower.io/)是一个客户端技术的软件包管理器。

### 构建配置简述：
    
gulpfile.js文件是gulp的配置文件，类似Gruntfile.js和webpack.config.js。

使用[gulp-webserver](https://www.npmjs.com/package/gulp-webserver)插件来运行本地的Web服务器与LiveReload。

使用[wiredep](https://www.npmjs.com/package/wiredep)插件将bower依赖的css、js自动插入到html页面中去

### 运行：

`npm i` 安装package.json中依赖的npm包
    
`bower install ` 安装bower依赖的包

`gulp dev` 执行此命令后会开启一个web服务，并自动打开浏览器。页面地址为 127.0.0.1:9000


### 总结

开发时，经常用到回调函数。当回调函数挂载在异步请求的函数体上，往往我们就需要嵌套很多的代码，像金字塔一样的堆叠起来，不仅仅让代码显得更加难看、臃肿，也让项目变得越来越不好维护。
