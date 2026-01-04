# SSH 基础命令

## SSH 密码登录

有时即使目标服务器开启了密码认证，仍然无法用密码方式登录，可以尝试这样强制用密码方式连接：    

```bash
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password user@hostname
```

如果是在 Google Colab 或其他云环境里操作 SSH，可以试下（需要`sshpass`）：  

```bash
apt-get install sshpass
sshpass -p 'yourPassword' ssh -o StrictHostKeyChecking=no -p yourPort user@hostname
```

## SSH 密钥登录

如果明明已配置好私钥但无法登录，通常和权限有关。一定要保证私钥权限设置正确：

```bash
chmod 600 ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/your_key
```

有时需手动把密钥加到 ssh-agent：  

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

如果主机指纹有变动，推荐先清除旧记录并重新收集：  

```bash
ssh-keygen -R hostname
ssh-keyscan -p yourPort hostname >> ~/.ssh/known_hosts
```

调试连接（加 `-vvv` 看详细日志）：  

```bash
ssh -vvv -p yourPort user@hostname -i ~/.ssh/your_key
```

## SSH 反向隧道（Reverse Tunneling）

用于内网穿透、远程穿回本地机器：  

```bash
# 将远端 2222 端口映射到本地 22
ssh -R 2222:localhost:22 user@jump_host

# 以后可通过远程机器的 2222 ssh 回你的本地
ssh -p 2222 user@jump_host
```

从外网穿透到其他内网主机：

```bash
ssh -R 2222:192.168.x.x:22 user@jump_host

# 然后可以在远端通过如下方式访问目标机
ssh -p 2222 user@localhost
```

更稳定地保持 tunnel（适用于无人值守情况，需安装 autossh）：

```bash
autossh -M 0 -o "ServerAliveInterval=30" -o "ServerAliveCountMax=3" -o "ExitOnForwardFailure=yes" -N -R 2222:192.168.x.x:22 user@jump_host
```

## SSH 连接问题排查

### "Broken pipe" 错误调试

当 SSH 连接出现 "client_loop: send disconnect: Broken pipe" 错误时，通常是由于连接超时或网络问题导致的。这个错误表示 SSH 连接因无活动而被终止。

#### 问题原因
- SSH 会话长时间空闲
- 客户端电脑进入休眠模式
- 网络防火墙或路由器设置了空闲超时
- 服务器配置了关闭空闲连接

#### 调试步骤

1. **检查 SSH 服务器日志**：
   ```bash
   # 在目标服务器上
   sudo tail -f /var/log/auth.log | grep sshd
   sudo journalctl -u sshd.service -f
   ```

2. **检查网络连接**：
   ```bash
   # 从客户端检查
   ping hostname  # 或 IP 地址
   traceroute hostname
   ```

3. **检查防火墙设置**：
   ```bash
   # 在服务器上
   sudo ufw status
   sudo iptables -L -n -v
   ```

#### 解决方案

**A. 配置 SSH 客户端保持连接**（推荐，无需服务器权限）：

编辑本地 SSH 配置：
```bash
nano ~/.ssh/config
```

添加配置：
```
Host hostname
    HostName hostname
    User your_username
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

`ServerAliveInterval 60` 让客户端每 60 秒发送一次保活包。

**B. 配置 SSH 服务器设置**（需要服务器管理员权限）：

编辑服务器 SSH 配置：
```bash
sudo nano /etc/ssh/sshd_config
```

添加或修改：
```
ClientAliveInterval 60
ClientAliveCountMax 3
TCPKeepAlive yes
```

重启 SSH 服务：
```bash
sudo systemctl restart sshd
```

**C. 检查网络设备超时设置**：
如果通过防火墙、路由器或负载均衡器连接，这些设备可能有自己的空闲超时设置。

**D. 防止客户端休眠**：
如果本地电脑进入休眠会导致连接断开，配置系统在活跃 SSH 会话期间不休眠。

#### 测试方法
配置完成后，连接到服务器并运行长时间命令（如 `top`），然后让它空闲 10-15 分钟观察连接是否保持。
