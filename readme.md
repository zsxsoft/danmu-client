danmu-client
==========

这是一个独立的弹幕客户端，其服务端项目见[danmu-server](https://github.com/zsxsoft/danmu-server)，其基于项目[DDPlayer](https://github.com/dpy1123/ddplayer)所完善。

## 功能特色
- 以``WebSocket``作为通讯协议，用``Canvas``作为弹幕的画布。
- 可在桌面任何位置显示弹幕，可与其他程序共同工作。
- 窗口置于最前，完全透明可穿透，用户可用键鼠等与其他程序正常交互。
- 提供紧急清空弹幕池、停止接收弹幕等功能。 

## 直接启动程序

目前仅有Windows x86版本可用。

1. 打开[Release](https://github.com/zsxsoft/danmu-client/releases)下载已经编译好的程序包并解压到某目录。
2. 双击目录下的``danmu``，启动成功。

## 源代码部署说明

1. 下载并安装[Nodejs](https://nodejs.org)或[iojs](https://iojs.org/cn)，同时需要安装[Visual Studio](https://www.visualstudio.com/en-us/products/visual-studio-express-vs.aspx)以便编译C++组件。
2. 命令行切换到工程目录下，执行``npm install``，等待自动下载和编译组件。（如果不想通过npm下载nw，可以在``package.json``里去掉``nw``再将其手动拷贝到工程目录下）。
3. 执行``nw``，启动成功。

## 调试工具打开说明

对于已编译的程序，你可以打开命令提示符输入``danmu --remote-debugging-port=9222```；

对于源代码部署，可输入``npm run debug``。然后打开``http://127.0.0.1:9222/``即可开始调试。

## 发布说明（Windows x86 + x64）

1. 下载nw-penetrate的[编译版本](https://github.com/zsxsoft/nw-penetrate/releases/)，分别解压到``cache\node_modules\系统版本（win32或win64）\nw-penetrate\build\Release``目录下。
2. 下载[rid](https://github.com/ironSource/rename-import-dll)，将其放到环境变量定义之处，或直接拷贝到项目根目录下。
3. 执行``grunt``。
4. 用各种PE信息修改工具修改文件属性即可（如Visual Studio）。

## 配置说明
根目录``config.js``下有配置，以下是说明

    socket: {
        url: "弹幕服务器开启的IP与端口（如使用反代，需要确认反代支持WebSocket连接）",
        password: "弹幕服务器连接密码",
        room: "选择连接弹幕服务器的某间房间",
        heartbeat: 心跳包发送间隔
    },
    display: {
        comment: {
            animationStyle: "默认弹幕样式（支持scroll、reversescroll、staticdown、staticup）",
            fontStyle: "默认字体样式",
            fontColor: "默认颜色",
            lifeTime: 每条弹幕的基本存活时间,
            height: 每条弹幕占据高度
        }
    }

## 协议
The MIT License (MIT)


## 博文
[弹幕服务器及搭配之透明弹幕客户端研究结题报告](http://blog.zsxsoft.com/post/15)

[弹幕服务器及搭配之透明弹幕客户端研究中期报告](http://blog.zsxsoft.com/post/14)

[弹幕服务器及搭配之透明弹幕客户端研究开题报告](http://blog.zsxsoft.com/post/13)

## 开发者
zsx - http://www.zsxsoft.com / 博客 - http://blog.zsxsoft.com