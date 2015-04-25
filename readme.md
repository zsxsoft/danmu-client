danmu-client
==========

这是一个弹幕的客户端，其服务端项目见[danmu-server](https://github.com/zsxsoft/danmu-server)，其基于项目[DDPlayer](https://github.com/dpy1123/ddplayer)所完善。

其以[nwjs](https://github.com/nwjs/nw.js)为运行时，若需要使用已经把依赖库编译后的版本(Windows x86)，请打开[Release](https://github.com/zsxsoft/danmu-client/releases)下载。

以```WebSocket```作为通讯协议，用```Canvas```作为弹幕的画布。

目前遇到的主要难点如下：

1. [node native module doesn't work with renamed exe (was node-sqlite3 module don't work in node-webkit package mode)](https://github.com/nwjs/nw.js/issues/199)
2. [Transparency](https://github.com/nwjs/nw.js/wiki/Transparency) - （Linux下不能打开GPU加速）
3. (Solved) [nwjs实现鼠标穿透](http://blog.zsxsoft.com/post/8)
