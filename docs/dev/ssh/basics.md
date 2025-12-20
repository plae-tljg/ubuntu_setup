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

