# 微信小程序 Demo（豆瓣电影）

由于时间的关系，没有办法写一个完整的说明，后续配合一些视频资料，请持续关注

> 官方文档：https://mp.weixin.qq.com/debug/wxadoc/dev/
>
> 豆瓣API官方文档：https://developers.douban.com/wiki/?title=movie_v2


> 重要申明：**官方已经对没有资格的开发者开放了`微信Web开发者工具`的使用**
>
> 不需要再用之前的办法破解，破解了有问题！破解了有问题！破解了有问题！
>
> 解决办法就是完全卸载之前的版本，安装`2300`版本，下载地址下面有说明



## Demo 预览

<p align="center">
  <img src="./files/preview.gif" alt="豆瓣电影演示" width="100%">
</p>

[演示视频（流量预警 2.64MB）](https://github.com/zce/weapp-demo/blob/master/files/preview.mp4)

## 可能有刚入门的同学

可以从提交历史记录中找之前提交的版本

当前版本中的代码比较绕，用到挺多的新特性

https://github.com/zce/weapp-demo/commits/master

不会弄，加我微信聊


## 有问题？

### Welcome PR or Issue or Wechat

<p align="center">
  <img src="./files/qrcode.png" alt="我的二维码" width="100%">
</p>



## 使用步骤

1. 将仓库克隆到本地：

  ```bash
  $ git clone https://github.com/zce/weapp-demo.git weapp-douban --depth 1
  $ cd weapp-douban
  ```

2. 打开`微信Web开放者工具`（注意：必须是`0.9.092300`版本）

  - 必须是`0.9.092300`版本，之前的版本不能保证正常运行
  - 不需要所谓的破解，网上所谓的破解只是针对之前的`0.9.092100`版本，新的官方版本不需要破解，不需要破解，不需要破解！
  - 下载链接（官方版本，放心下载）：https://pan.baidu.com/s/1qYld6Vi
    * `wechat_web_devtools_0.9.092300_x64.exe`（Windows 64位）
    * `wechat_web_devtools_0.9.092300_ia32.exe`（Windows 32位）
    * `wechat_web_devtools_0.9.092300.dmg`（macOS）

3. 选择`添加项目`，填写或选择相应信息

  - AppID：点击右下角`无AppID`（我也没有资格，据说这次200个名额是小龙钦点的）
  - 项目名称：随便填写，因为不涉及到部署，所以无所谓
  - 项目目录：选择刚刚克隆的文件夹
  - 点击`添加项目`

  ![添加项目](./files/add-proj.png)

4. 新年快乐，恭喜发财

  ![项目预览](./files/main-view.png)

5. 你可以选择在`微信Web开放者工具`中编码（也可选择你喜欢的编辑器）

  ![编码功能](./files/coding.png)

6. 通过左下角重启按钮，刷新编码过后的预览

7. 可以通过在项目目录下执行以下命令快速创建新页面组件所需文件：

  ```bash
  # `Bash`用户
  $ ./generate <new-page-name>
  # `Cmd`用户
  $ .\generate <new-page-name>
  ```

8. 剩下的可以自由发挥了


## 微信小程序基本教程（持续更新）

### 创建一个项目文件夹，创建基本所需文件

#### app.js

项目主入口文件（用于创建应用程序对象）

```javascript
// App函数是一个全局函数，用于创建应用程序对象
App({
  // ========== 全局数据对象（整个应用程序共享） ==========
  globalData: { ... },

  // ========== 应用程序全局方法 ==========
  method1 (p1, p2) { ... },
  method2 (p1, p2) { ... },

  // ========== 生命周期方法 ==========
  // 应用程序启动时触发一次
  onLaunch () { ... },

  // 当应用程序进入前台显示状态时触发
  onShow () { ... },

  // 当应用程序进入后台状态时触发
  onHide () { ... }
})

```

#### app.json

项目配置声明文件（指定项目的一些信息，比如导航栏样式颜色等等）

```javascript
{
  // 当前程序是由哪些页面组成的（第一项默认为初始页面）
  // 所有使用到的组件或页面都必须在此体现
  // https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#pages
  "pages": [ ... ],
  // 应用程序窗口设置
  // https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#window
  "window": { ... },
  // 应用导航栏设置
  // https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#tabBar
  "tabBar": { ... },
  // 网络超时设置
  // https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#networkTimeout
  "networkTimeout": {},
  // 是否在控制台输出调试信息
  // https://mp.weixin.qq.com/debug/wxadoc/dev/framework/config.html#debug
  "debug": true
}
```

#### app.wxss

[!可选!]项目全局的样式文件，内容遵循CSS标准语法


### 创建页面组件

每个页面组件也分为四个文件组成：

- page-name.js

  * 页面逻辑文件，用于处理页面生命周期控制和数据处理
  * 未完待续...

- page-name.json

 * 设置当前页面工作时的一些配置
 * 此处可以覆盖app.json中的window设置
 * 也就是说只可以设置window中设置的熟悉
 * 未完待续...

- page-name.wxml

  * wxml指的是`Wei Xin Markup Language`
  * 用于定义页面中元素结构的
  * 语法遵循XML语法，注意是XML语法，不是HTML语法，不是HTML语法，不是HTML语法
  * 未完待续...

- page-name.wxss

  * wxml指的是`Wei Xin Style Sheet`
  * 用于定义页面样式的
  * 语法遵循CSS语法，扩展了CSS基本用法和长度单位（主要就是rpx响应式像素）
  * 未完待续...


### 未完待续...


## 恶心的地方

1. 好像没有自定义组件的机制~~
2. 没有热更新
3. 修改代码即时同步问题



## LICENSE

[MIT](./LICENSE)

