danmu-client
==========

这是一个独立的弹幕客户端，其服务端项目见[danmu-server](https://github.com/zsxsoft/danmu-server)，其基于项目[DDPlayer](https://github.com/dpy1123/ddplayer)所完善。

## 功能特色
- 以``WebSocket``作为通讯协议，用``Canvas``作为弹幕的画布。
- 可在桌面任何位置显示弹幕，可与其他程序共同工作。
- 窗口置于最前，完全透明可穿透，用户可用键鼠等与其他程序正常交互。
- 提供紧急清空弹幕池、停止接收弹幕等功能。 

## 源代码部署说明

1. 下载并安装[Nodejs](https://nodejs.org)或[iojs](https://iojs.org/cn)，同时需要安装[Visual Studio](https://www.visualstudio.com/en-us/products/visual-studio-express-vs.aspx)以便编译C++组件。
2. 命令行切换到工程目录下，执行``npm install``，等待自动下载和编译组件。（如果不想通过npm下载nw，可以在``package.json``里去掉``nw``再将其手动拷贝到工程目录下）。
3. 执行``nw``，启动成功。

## 不编译部署说明

目前仅有Windows x86版本可用。

1. 打开[Release](https://github.com/zsxsoft/danmu-client/releases)下载已经编译好的程序包并解压到某目录。
2. 直接用git clone得到的代码覆盖解压后的文件。
3. 双击目录下的``nw``，启动成功。

## 协议
The MIT License (MIT)

## 开发者
zsx - http://www.zsxsoft.com / 博客 - http://blog.zsxsoft.com