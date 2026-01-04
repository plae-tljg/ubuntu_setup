# IP Camera - CameraLink App

使用 Android 手机作为本地摄像头进行监控。新版本使用 CameraLink 应用，相比旧版本更加简单，无需额外服务器。

## 项目概述

CameraLink 是一款开源 Android 应用，可以将任何 Android 12+ 设备转换为 HTTP 基础的 IP 摄像头。应用支持屏幕关闭时持续流媒体，并提供浏览器友好的 MJPEG 流媒体。

**注意**: 这是基于 [onepersonhere/camera-link](https://github.com/onepersonhere/camera-link) 的修改版本，修复了 Gradle 问题并解决了运行时的各种 bug。

**GitHub 项目**: [plae-tljg/camera-link](https://github.com/plae-tljg/camera-link)

## 主要特性

- HTTP MJPEG 流媒体，可通过浏览器或 VLC 查看
- 前景摄像头服务，支持屏幕关闭时持续流媒体
- 内置 HTTP 端点：`/stream`（直播）、`/snapshot`（快照）
- 可选的 Tailscale 保持活跃服务
- 持久通知，支持快速控制

## 快速开始

### 前提条件

- Android Studio Ladybug 或更新版本
- 本地安装 Android SDK 31 或更高版本
- 运行 Android 12+ 的物理 Android 设备，启用 USB 调试
- Java 17+（如果从命令行构建）

### 克隆和构建

```bash
git clone https://github.com/plae-tljg/camera-link.git
cd camera-link
./gradlew assembleDebug
```

### 安装

**Android Studio**:
- 在 Android Studio 中打开项目，同步 Gradle，连接设备，按 Run 部署调试构建。

**命令行**:
```bash
./gradlew installDebug
# 或手动安装生成的 APK
adb install app/build/outputs/apk/debug/app-debug.apk
```

### 构建发布 APK

对于生产部署，构建签名发布 APK：

1. **生成密钥库**（项目中已完成）:
   ```bash
   # 密钥库位于: app/keystore.jks
   # 别名: androidkey
   # 密码: android
   ```

2. **构建发布 APK**:
   ```bash
   ./gradlew assembleRelease
   ```

3. **查找 APK**:
   - 发布 APK: `app/build/outputs/apk/release/app-release.apk`
   - 调试 APK: `app/build/outputs/apk/debug/app-debug.apk`

4. **安装发布 APK**:
   ```bash
   adb install app/build/outputs/apk/release/app-release.apk
   ```

**注意**: 发布构建是签名和优化的，适用于生产使用。对于 Google Play Store 分发，您需要使用自己的密钥库和签名配置。

## 使用方法

### 开始流媒体

1. 在设备上启动 CameraLink
2. 授予摄像头、通知、前景服务权限（出现提示时）
3. 点击 **Start Streaming**。UI 和通知显示本地流 URL（默认 `http://<device-ip>:8080`）
4. 从同一网络上的任何设备打开 URL 查看实时馈送或触发 `/snapshot`
5. 从应用内按钮或通知操作停止流媒体

屏幕关闭和后台流媒体保持活跃，只要前景服务运行。禁用电池优化以获得最佳可靠性。

### Tailscale 保持活跃

1. TailscalePingService 自动启动（可在 `MainActivity` 中配置）
2. 每 15 秒（默认）解析配置的对等点（MagicDNS 或 100.64.0.0/10 地址），ping 它们
3. 状态显示在应用和通知中（成功/失败计数）
4. 使用 **Manage Tailscale Peers** 部分在运行时添加或删除对等点

## 配置

- **Ping 间隔**: `app/src/main/java/.../TailscalePingService.kt`, `PING_INTERVAL_MS` 常量
- **默认对等点**: `TailscalePinger.kt`, `configuredTailscaleIps` 集合
- **HTTP 端口**: `CameraStreamingService.kt` 和 `MainActivity.kt` `port` 值（默认 8080）
- **摄像头选择**: 更新 `CameraStreamingService.startCamera()` 中的 `cameraSelector` 以选择前置或后置摄像头
- **JPEG 质量 / FPS**: 在 `StreamingServer.imageProxyToJpeg()` 中调整压缩质量，在流媒体循环中调整睡眠持续时间

## 测试

- **本地浏览器/VLC 测试**: 开始流媒体，从另一设备访问 `/stream` 或 `/snapshot`，或将 URL 添加到 VLC 中通过"Open Network Stream"
- **服务持久性**: 让流媒体运行 30+ 分钟，屏幕关闭，确认唤醒锁行为
- **Tailscale ping 验证**: 运行 `adb logcat | grep TailscalePing` 确认解析和 ping 结果

## 查看流媒体

### 浏览器查看
- 打开: `http://<device-ip>:8080/stream`
- 在任何现代浏览器中工作

### VLC 媒体播放器
- 文件 → 打开网络流
- 输入: `http://<device-ip>:8080/stream`

### 快照
- 访问: `http://<device-ip>:8080/snapshot`
- 获取当前帧的 JPEG 图像

## 故障排除

### 常见问题

1. **应用启动时崩溃**
   - 确保设备运行 Android 12+
   - 检查是否授予了摄像头、通知和前景服务权限
   - 尝试清除应用数据后重新安装

2. **无法连接到流媒体**
   - 确保手机和查看设备在同一 WiFi 网络
   - 检查防火墙设置（端口 8080 应开放）
   - 确认 IP 地址正确

3. **流媒体质量差或卡顿**
   - 使用稳定的 WiFi 连接
   - 禁用电池优化以确保后台运行
   - 尝试不同的浏览器（推荐 Chrome/Edge）

4. **Tailscale 远程访问问题**
   - 确认 Tailscale 已正确配置
   - 检查 MagicDNS 主机名解析
   - 验证 ping 服务正在运行

### 调试命令

```bash
# 查看错误日志
adb logcat *:E | grep -i camera

# 检查运行服务
adb shell dumpsys activity services | grep camera

# 清除应用数据
adb shell pm clear com.example.cameralink
```

### 浏览器兼容性

- ✅ Chrome/Edge: 最佳性能
- ⚠️ Firefox: 可能稍有延迟
- ❌ Safari: MJPEG 支持有限

## 技术栈

- **Android 应用**: Kotlin + CameraX + Jetpack Compose
- **流媒体服务器**: NanoHTTPD
- **网络协议**: HTTP MJPEG
- **后台服务**: Android 前景服务 + 唤醒锁

## 应用场景

- 植物生长监控
- 房间安全监控
- 宠物活动监控
- 临时安防摄像头
- 远程监控（配合 Tailscale）

## 注意事项

- 所有通信都在本地网络进行，不会暴露到互联网（除非配置 Tailscale）
- 确保 Android 设备连接稳定 WiFi
- 视频质量和帧率取决于网络条件和设备性能
- 推荐使用稳定的 WiFi 连接以获得最佳体验
- 应用需要 Android 12+，因为使用了现代摄像头 API

## 旧版本说明

旧版本的 IP 摄像头项目需要 Ubuntu 服务器运行 VideoServer、WebApp 等组件。CameraLink 是完全重写的版本，只需要 Android 应用，无需额外服务器，更简单易用。

旧版本文档已移至 [old/](./old/) 目录。
