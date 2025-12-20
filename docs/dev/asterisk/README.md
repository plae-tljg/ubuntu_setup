# Asterisk 电话服务器配置

Asterisk 是一个开源的电话系统（PBX）平台。本文档包含 Asterisk 的常用命令、配置方法和实际应用示例。

## 文档结构

- [基础命令和配置](./basics.md) - 常用命令、文件位置、基本操作
- [Trunk 配置](./trunk_config.md) - SIP Trunk 配置，基于实际工作示例
- [音频处理](./audio.md) - 音频文件转换和处理

## 快速开始

### 查看日志和控制台

```bash
# 进入 Asterisk 控制台
sudo asterisk -rvvv

# 添加更多 v 来增加详细程度
sudo asterisk -rvvvvvvvvvvvvvv
```

### 配置文件位置

- `/etc/asterisk/` - 配置文件目录
  - `pjsip.conf` - PJSIP 端点配置
  - `extensions.conf` - 拨号计划配置
- `/var/lib/asterisk/` - 音频文件、脚本等
- `/var/spool/asterisk/` - Asterisk 生成的文件（如录音）

### 重载配置

```bash
# 在 Asterisk 控制台中
pjsip reload      # 重载端点
dialplan reload   # 重载拨号计划
core reload       # 重载几乎所有配置

# 或在命令行中
sudo asterisk -rx "pjsip reload"
sudo asterisk -rx "dialplan reload"
sudo asterisk -rx "core reload"
```

