# Android 本地文件访问

通过 WiFi 在 Ubuntu 和 Android 手机之间访问文件，无需 USB 连接，也不暴露到外网。

## 方法 1：SSH/SFTP（推荐，安全）

使用 Termux 在 Android 上设置 SSH 服务器，然后从 Ubuntu 通过 SFTP 访问。

### 在 Android Termux 中设置

#### 1. 安装和配置

```bash
# 获取存储权限
termux-setup-storage

# 安装 OpenSSH
pkg install openssh

# 设置密码
passwd

# 查看用户名（通常是 u0_aXXX 格式）
whoami
```

#### 2. 配置 SSH 服务器

编辑 SSH 配置（如果需要启用密码认证）：

```bash
nano /data/data/com.termux/files/usr/etc/ssh/sshd_config
```

添加或修改：
```
PasswordAuthentication yes
PubkeyAuthentication yes
```

#### 3. 启动 SSH 服务器

```bash
sshd
```

SSH 服务器会在端口 **8022** 上运行（不是标准的 22）。

#### 4. 查看手机 IP 地址

```bash
ifconfig
```

记下 WiFi 接口的 IP 地址（如 `192.168.8.120`）。

### 在 Ubuntu 中连接

#### 方法 A：使用密钥认证（推荐）

**在 Ubuntu 上生成密钥**（如果还没有）：

```bash
ssh-keygen -t ed25519
cat ~/.ssh/id_ed25519.pub
```

**在 Termux 中添加公钥**：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# 粘贴 Ubuntu 的公钥，保存
chmod 600 ~/.ssh/authorized_keys
```

**从 Ubuntu 连接**：

```bash
sftp -P 8022 username@192.168.8.120
```

#### 方法 B：使用密码认证

如果遇到 "Too many authentication failures" 错误，在 `~/.ssh/config` 中配置：

```
Host android_phone
    HostName 192.168.8.120
    User u0_a322
    Port 8022
    IdentitiesOnly yes
    PreferredAuthentications password
    PubkeyAuthentication no
```

然后连接：

```bash
sftp android_phone
```

#### 使用 Nautilus 访问

在 Nautilus 的地址栏输入：

```
sftp://username@192.168.8.120:8022
```

或使用终端：

```bash
nautilus sftp://username@192.168.8.120:8022
```

### 故障排查

#### SSH 连接问题

1. **检查 SSH 服务器是否运行**：
   ```bash
   # 在 Termux 中
   ps aux | grep sshd
   ```

2. **重启 SSH 服务器**：
   ```bash
   # 在 Termux 中
   pkill sshd && sshd
   ```

3. **检查 IP 地址**：手机 IP 可能会变化，重新运行 `ifconfig` 确认

4. **确保在同一 WiFi 网络**：两台设备必须在同一局域网

#### .ssh 文件夹复制后的连接问题

当从其他计算机复制 `.ssh` 文件夹到新 Ubuntu 系统后，可能遇到连接问题。这通常是文件权限问题：

**修复权限**：
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/android_fit  # 或其他私钥文件
chmod 644 ~/.ssh/known_hosts
chown -R $USER:$USER ~/.ssh
```

**如果遇到 "Host key verification failed"**：
```bash
ssh-keygen -R 192.168.10.193  # 替换为你的 Android IP
```

#### 网络连接问题："No route to host"

如果遇到 `No route to host` 错误，这通常是网络层问题，不是 SSH 配置问题。

**奇怪的网络行为**：有时从 Ubuntu ping Android 不通，但从 Android ping Ubuntu 后，连接突然恢复。这是因为：

- **ARP 缓存问题**：Android 首先 ping Ubuntu 会建立 ARP 表项
- **状态防火墙**：Android ping Ubuntu 后创建了允许返回流量的状态
- **网络接口唤醒**：初始 ping "唤醒" 了网络栈

**解决方案**：
1. 尝试先从 Android ping Ubuntu，然后再从 Ubuntu 连接
2. 或者在 Ubuntu 上先 ping Android 几次：
   ```bash
   ping -c 2 192.168.10.193
   ```

#### 文件传输后其他应用检测不到文件

当通过 SFTP 传输文件到 Android 后，其他应用（如 `File Manager`）可能无法检测到新文件，除非重启手机。这是 Android 媒体扫描器的问题。

**解决方案**：在 Termux 中运行媒体扫描命令：

```bash
termux-media-scan -r ~/storage/shared
```

这会强制 Android 重新扫描媒体文件，使其对其他应用可见，而无需重启。

**创建快捷方式**：为了方便，可以在 `~/.bashrc` 中添加别名：

```bash
alias rescan='termux-media-scan -r ~/storage/shared'
```

添加后，使用 `source ~/.bashrc` 应用更改。然后只需输入 `rescan` 即可。

## 方法 2：FTP 服务器（简单快速）

在 Android 上安装 FTP 服务器应用（如 "FTP Server" 或 "Software Data Cable"），然后在 Ubuntu 的 Nautilus 中输入 FTP 地址：

```
ftp://192.168.8.120:port
```

## 方法 3：LocalSend（现代简单）

安装 LocalSend 应用：
- Android：从 Play Store 或 F-Droid 安装
- Ubuntu：从官网下载或使用 Snap

LocalSend 允许在本地网络上直接传输文件，无需配置。

## 方法 4：KDE Connect（功能丰富）

安装 KDE Connect：
- Android：从 Play Store 安装
- Ubuntu：`sudo apt install kdeconnect`

除了文件传输，还支持通知同步、远程控制等功能。

## 安全注意事项

- 所有方法仅在本地网络工作，不会暴露到互联网
- 确保 WiFi 网络有强密码保护
- SSH/SFTP 比 FTP 更安全
- 使用密钥认证比密码认证更安全

## 推荐方案

- **最安全**：SSH/SFTP + 密钥认证
- **最简单**：LocalSend
- **最功能丰富**：KDE Connect
- **最快速设置**：FTP 服务器应用
