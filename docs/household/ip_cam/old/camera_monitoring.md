# IP Camera

使用 Android 手机作为本地摄像头进行监控。

## 项目概述

基于 [BalioFVFX/IP-Camera](https://github.com/BalioFVFX/IP-Camera) 项目，将 Android 设备转换为 IP 摄像头。

![Preview](https://github.com/BalioFVFX/IP-Camera/blob/main/media/preview.gif?raw=true)

[全屏演示](https://youtu.be/NtQ_Al-56Qs)

## 系统架构

![Overview](https://github.com/BalioFVFX/IP-Camera/blob/main/media/high_level_overview.png?raw=true)

## 安装和设置

### Ubuntu 服务器设置

1. **克隆项目**：
   ```bash
   git clone https://github.com/BalioFVFX/IP-Camera.git
   cd IP-Camera
   ```

2. **安装依赖**：
   ```bash
   # 安装 Node.js (如果还没有)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # 安装项目依赖
   npm install
   ```

3. **启动视频服务器**：
   ```bash
   # 启动 VideoServer
   cd VideoServer
   node server.js
   ```

   默认情况下，视频服务器会启动 3 个服务器：
   - WebSocket 服务器（端口 1234）
   - MJPEG 服务器（端口 4444）
   - 摄像头服务器（端口 4321）

### Android 应用设置

1. **下载并安装应用**：
   从 [GitHub Releases](https://github.com/BalioFVFX/IP-Camera/releases) 下载 Android APK

2. **配置服务器 IP**：
   打开应用设置，输入 Ubuntu 服务器的 IP 地址，例如 `192.168.0.101:4321`

3. **开始流媒体**：
   打开流媒体界面，点击"开始流媒体"按钮

---

## 使用方法

### 启动直播流

您可以观看演示视频或按照以下步骤操作：

1. 确保视频服务器正在运行（见上面的 Ubuntu 设置）
2. 在 Android 手机上安装应用
3. 在应用设置中配置摄像头服务器 IP（例如 `192.168.0.101:4321`）
4. 打开流媒体界面，点击"开始流媒体"按钮
5. 现在手机将视频数据发送到摄像头服务器

### 观看视频流

视频流可以通过浏览器、Web 应用或 VLC 媒体播放器观看。

#### 浏览器观看

打开浏览器，访问 MJPEG 服务器的 IP 地址，例如 `http://192.168.0.101:4444`

![Preview](https://github.com/BalioFVFX/IP-Camera/blob/main/media/browser.gif?raw=true)

#### VLC 媒体播放器

打开 VLC 媒体播放器，文件 -> 打开网络 -> 网络，输入 MJPEG 服务器 IP 地址，例如 `http://192.168.0.101:4444/`

![Preview](https://github.com/BalioFVFX/IP-Camera/blob/main/media/vlc.gif?raw=true)

#### Web 应用

1. 进入 WebApp 目录，在终端执行 `webpack serve`
2. 打开浏览器访问 `http://localhost:8080/`
3. 进入设置，输入 WebSocket 服务器 IP 地址，例如 `192.168.0.101:1234`
4. 访问流媒体页面 `http://localhost:8080/stream.html`，点击连接按钮

![Preview](https://github.com/BalioFVFX/IP-Camera/blob/main/media/webapp.gif?raw=true)

### 配置 Web 应用服务器（可选）

注意：此部分仅在需要从 Web 应用截图时需要。

1. 打开 WebAppServer 项目
2. 打开 index.js，编辑连接对象以匹配您的 MySQL 凭据
3. 通过执行位于 `user.sql` 中的 SQL 查询来创建所需的表
4. 在根目录下执行 `node index.js`
5. 您可能需要更新 Web 应用连接的 IP。您可以在 Web 应用的 `stream.html` 文件中编辑此 IP（`BACKEND_URL` 常量变量）
6. 通过 Web 应用从 `http://localhost:8080/register.html` 创建用户
7. 从 `http://localhost:8080/stream.html` 截图
8. 在 `http://localhost:8080/gallery.html` 查看截图

![Preview](https://github.com/BalioFVFX/IP-Camera/blob/main/media/webapp_gallery.gif?raw=true)

---

## 技术栈

- **Android 应用**：Kotlin + Camera2 API
- **视频服务器**：Node.js
- **Web 应用**：JavaScript + WebSocket
- **流媒体格式**：MJPEG、WebSocket

## 应用场景

- 植物生长监控
- 房间安全监控
- 宠物活动监控
- 临时安防摄像头

## 注意事项

- 所有通信都在本地网络进行，不会暴露到互联网
- 确保 Android 设备和 Ubuntu 服务器在同一 WiFi 网络
- 视频质量和帧率取决于网络条件和设备性能
- 推荐使用稳定的 WiFi 连接以获得最佳体验
