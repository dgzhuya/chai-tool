# 柴柴工具箱

> 使用 electron+vue3+adb 实现的一个手机模拟点击工具

## 如何使用

### 手机打开 usb 调试模式，设置允许模拟点击，连接到电脑

### 选择手机设备,可通过右侧按钮刷新设备，以及获取手机当前截图

-   初始状态

    <img src="./doc/start.png" width = "400"/>

-   连接设备状态

    <img src="./doc/device.png" width = "400"/>

### 创建任务

-   点击开始录制

    <img src="./doc/next.png" width = "400"/>

-   点击右侧图片选中位置，执行下一步完成点击并记录到任务中

    <img src="./doc/touch.png" width = "400"/>

-   输入任务名称，点击保存

    <img src="./doc/save.png" width = "400"/>

### 执行任务

-   设置好执行参数
-   点击执行任务

    <img src="./doc/run.png" width = "400"/>

-   查看任务执行状态

    <img src="./doc/running.png" width = "400"/>

-   当任务运行时点击遮罩可取消任务执行

## 升级规划

-   [ ] 实现长按滑动等输入方式
-   [ ] 优化 ADB 截图时间
