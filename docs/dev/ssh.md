# 常用 SSH 命令笔记

记录我自己常用的 SSH 相关命令，有的是日常用的，有的是在 colab（云实验）里遇到的问题和解决方法。  

此页仅供自己备忘，如有补充可以及时更新。  

其中 `yourPort` 是你的端口号，`user` 是用户名，`yourddns.net` 可以是你的动态域名也可以写你的服务器公网 IP。  

## SSH 密码登录

有时即使目标服务器开启了密码认证，仍然无法用密码方式登录，可以尝试这样强制用密码方式连接：    

```bash
ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password user@yourddns.net
```

如果是在 Google Colab 或其他云环境里操作 SSH，可以试下（需要`sshpass`）：  

```bash
!apt-get install sshpass
!sshpass -p 'yourPassword' ssh -o StrictHostKeyChecking=no -p yourPort user@yourddns.net
```

- `'yourPassword'` 换成真实密码  
- `yourPort`、`yourddns.net` 换成真实端口和主机  


## SSH 密钥登录

如果明明已配置好私钥但无法登录，通常和权限有关。一定要保证私钥权限设置正确：

```bash
!chmod 600 ~/.ssh/id_rsa
!chmod 600 ~/.ssh/id_rsa.pub
!chmod 600 lkm_open_access2
```

（注意：前面加 `!` 只针对 Jupyter/Colab，普通终端不用）  

有时需手动把密钥加到 ssh-agent：  

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

如果主机指纹有变动，推荐先清除旧记录并重新收集：  

```bash
ssh-keygen -R yourddns.net
ssh-keyscan -p yourPort yourddns.net >> ~/.ssh/known_hosts
```

调试连接（加 `-vvv` 看详细日志）：  

```bash
ssh -vvv -p yourPort user@yourddns.net -i lkm_open_access2
```

若需将 open format 的私钥转成 Putty 能识别的 ppk 格式：  

```bash
puttygen lkm_open_access -O private -o lkm_open_access.ppk
```

## SSH 反向隧道（Reverse Tunneling）

用于内网穿透、远程穿回本地机器：  

```bash
# 将远端 2222 端口映射到本地 22
ssh -R 2222:localhost:22 lkm@192.168.13.104

# 以后可通过远程机器的 2222 ssh 回你的本地
ssh -p 2222 lkm@192.168.13.104
```

例2：从外网穿透到其他内网主机（192.168.10.237）：  

```bash
ssh -R 2222:192.168.10.237:22 lkm@192.168.13.114

# 然后可以在远端通过如下方式访问目标机
ssh -p 2222 ubuntu@localhost
```

更稳定地保持 tunnel（适用于无人值守情况，需安装 autossh）：  

```bash
autossh -M 0 -o "ServerAliveInterval=30" -o "ServerAliveCountMax=3" -o "ExitOnForwardFailure=yes" -N -R 2222:192.168.10.237:22 lkm@192.168.13.114
```

> 小提示：如有其他常用 SSH 场景可以随时补充  
