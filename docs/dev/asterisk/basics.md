# Asterisk 基础命令和配置

## 查看日志和控制台

| 命令 | 作用说明 |
|------|----------|
| `sudo asterisk -rvvv` | 进入 Asterisk 控制台 |
| `sudo asterisk -rvvvvvvvvvvvvvv` | 添加更多 `v` 来增加详细程度 |

## 文件位置

### 配置文件

在 `/etc/asterisk/` 目录下：

```bash
sudo gedit /etc/asterisk/pjsip.conf      # PJSIP 端点配置
sudo gedit /etc/asterisk/extensions.conf # 拨号计划配置
```

### 运行时文件

- `/var/lib/asterisk/` - 音频文件、脚本等运行时文件
- `/var/spool/asterisk/` - Asterisk 生成的文件，如录音（MixMonitor）

### 配置文件示例

<CodeViewer 
  title="pjsip.conf 示例" 
  filePath="/lib/asterisk_scripts/pjsip.conf"
  language="bash"
/>

<CodeViewer 
  title="extensions.conf 示例" 
  filePath="/lib/asterisk_scripts/extensions.conf"
  language="bash"
/>

## 权限管理

记住修改 Asterisk 使用的文件权限和所有者，根据 Asterisk 运行的用户设置：

```bash
sudo chmod -R 750 /var/lib/asterisk/agi-bin/
sudo chown -R root:root .   # 当前在 /var/lib/asterisk/sound
```

## Asterisk 控制台命令

| 命令 | 作用说明 |
|------|----------|
| `pjsip reload` | 重载端点 |
| `core reload` | 重载几乎所有配置 |
| `dialplan reload` | 重载拨号计划 |
| `pjsip show endpoints` | 显示所有端点 |
| `core show channels verbose` | 显示正在进行的呼叫通道 |
| `originate PJSIP/1004 extension 500@default` | 发起匿名呼叫 |
| `sip show debug on` | 启用 SIP 调试（考虑改为 pjsip） |
| `rtp set debug on` | 启用音频调试 |

## 命令行执行 Asterisk 命令

使用 `sudo asterisk -rx '命令'` 在命令行执行 Asterisk 控制台命令：

| 命令 | 作用说明 |
|------|----------|
| `sudo asterisk -rx "pjsip reload"` | 重载端点 |
| `sudo asterisk -rx "core reload"` | 重载几乎所有配置 |
| `sudo asterisk -rx "dialplan reload"` | 重载拨号计划 |

## 完整日志记录

```bash
# 记录所有 Asterisk 控制台输出到文件
script -q -c "sudo asterisk -rvvvvv" /dev/null | tee -a log.log
```

## 创建快捷方式

Asterisk 文件夹路径较长，建议创建快捷方式：

```bash
cd /
sudo mkdir asterisk_proj
cd asterisk_proj
sudo ln -s /etc/asterisk/ asterisk_conf
sudo ln -s /var/lib/asterisk/agi-bin/ agi_bin
sudo ln -s /var/spool/asterisk/monitor/rec asterisk_rec
```

