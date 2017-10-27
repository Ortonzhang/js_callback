# js回调的心酸历程

### 运行前准备：
`npm i -g gulp bower` 
   
全局安装gulp、bower。

[gulp](http://www.gulpjs.com.cn/)是一个基于流的自动构建工具。

[bower](https://bower.io/)是一个客户端技术的软件包管理器。

### 构建配置简述：
    
gulpfile.js文件是gulp的配置文件,类似Gruntfile.js和webpack.config.js。

使用[gulp-webserver](https://www.npmjs.com/package/gulp-webserver)插件来运行本地的Web服务器与LiveReload。

使用[wiredep](https://www.npmjs.com/package/wiredep)插件将bower依赖的css、js自动插入到html页面中去

### 运行：

`npm i` 安装package.json中依赖的npm包
    
`bower install ` 安装bower依赖的包

`gulp dev` 执行此命令后会开启一个web服务，并自动打开浏览器。页面地址为 127.0.0.1:9000


### 需求
demo中src文件里有a、b、c三个json文件，需求是我们需要依次请求它们，并且打印它们的值。



### 发展史
+ ES5 - 金字塔
+ ES6 - 链式
+ ES6 - 暂停
+ ES7 - 同步

### ES5 - 金字塔

首先我们来到ES5的时代,为完成以上的需求写下如下的代码：
```
  $.ajax('./src/a.json').done((a)=>{

        console.log(a.data) // 打印a文件

        $.ajax('./src/a.json').done((b)=>{

              console.log(b.data)  // 打印b文件

              $.ajax('./src/a.json').done((c)=>{
                       console.log(c.data)  // 打印c文件
              })
        })
  })
  
```
嗯，也不错啊，一层套着一层，也算清晰明了了。如果当我们的需要改成100个文件的依次获取呢？此时，如果还这样写的话，那欢迎你来到`回调地狱`。

如果我们嵌套很多的代码，像金字塔一样的堆叠起来，不仅仅让代码显得更加难看、臃肿，也让项目变得越来越不好维护。

### ES6 - 链式

我们来到了ES6的时代，这个时代的有个产物叫做[promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

通过promise我们可以将代码链式的调用改成如下的代码
```
function request(url){
	return new Promise((resolve, reject)=>{
		$.ajax(url).done((data)=>{
			resolve(data)
		}).fail((err)=>{
			reject(err)
		})
	})
}

request('./src/a.json').then((a)=>{
	console.log(a)
	return request('./src/b.json')
}).then((b)=>{
	console.log(b)
	return request('./src/c.json')
}).thne((c)=>{
	console.log(c)
})

```

相比`金字塔`式嵌套的代码，此时的代码更加的简洁，也更容易维护，但是也只不过是将嵌套改成了上下链接调用。

### ES6 - 暂停

[Generator](http://es6.ruanyifeng.com/#docs/generator) 函数是 ES6 提供的一种异步编程解决方案，可以理解成内部有很多状态的状态机。

generator函数与普通函数区别：
+ 定义的时候多了个`*`号
+ 函数内部使用`yield `来定义不同的状态
+ 调用的时候，需要将函数赋值给某个变量，每个变量之间的状态互不影响
+ 使用`next()`函数调用下一个状态

```
function request(url){
	$.ajax(url).done((data)=>{
		generator.next(data)
	})
}


function* generatorFn(){
	let a = yield request('./src/a.json')
	console.log(a)
	let b = yield request('./src/b.json')
	console.log(b)
	let c = yield request('./src/c.json')
	console.log(c)
}

var generator = generatorFn()

generator.next()
```

以上代码定义了generatorFn函数并赋值给generator，在定义request函数的时候，当请求到数据的时候，调用generator的next方法。


### ES7 async/await 

万众瞩目，神器登场 [async/await ](http://es6.ruanyifeng.com/#docs/async)。

先上代码：

```
(async () => {
	let a = await $.ajax('./src/a.json')
	console.log(a)
	let b = await $.ajax('./src/b.json')
	console.log(b)
	let c = await $.ajax('./src/c.json')
	console.log(c)
})

```

async函数是generator函数的语法糖，只是将`*`变成了async，`yield`改成了`await`，但是代码却精简了这么多，它们直接的区别有以下几点：
+ async函数不用手动去调用next() 函数
+ async函数返回值是promise，generator函数返回的是[Iterator](http://es6.ruanyifeng.com/#docs/iterator)

async函数可以看成一个包含多个异步操作的promise的对象，await就是then的语法糖。


四种方式中最精简的方式。使用async处理回调函数，代码会异常的清新，我们写起来也会很爽很舒服。

为什么会有这种感觉呢？

因为它是最符合我们写代码的习惯，用同步的写法去解决异步的代码。



### 换个HTTP库，这里使用[fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)来实现

``` 

### generator

function getUrl(url){
	fetch(url).then((data)=>{
		generator.next(data.json())
	})	
}

function* test(){
	var a = yield getUrl('./src/a.json')
	aJson.then(data=>{
		console.log(data)
	})
}

var generator = test()
generator.next();


### async

(async ()=>{
	
	let a = await fetch('./src/a.json')
	let aJson = a.json()
	aJson.then((data)=>{
		console.log(data)
	})
})()

```

fetch(url)，需要加上一句 response.json() 来从 response 流对象中获取数据，返回的是个promise对象