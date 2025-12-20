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

