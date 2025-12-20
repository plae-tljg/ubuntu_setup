# SFTP 使用

## 从终端打开 SFTP

### 使用 Nautilus

可以直接从终端打开 Nautilus 连接到 SFTP 服务器：

```bash
nautilus sftp://user@hostname
```

打开到特定目录：

```bash
nautilus sftp://user@hostname/home/user/
```

### 使用命令行 SFTP

```bash
sftp user@hostname
```

连接后可以使用 SFTP 命令：
- `ls` - 列出远程目录
- `cd` - 切换远程目录
- `lcd` - 切换本地目录
- `get file` - 下载文件
- `put file` - 上传文件
- `exit` - 退出

## 在 Nautilus 中连接

### 图形界面方式

1. 打开 Nautilus
2. 点击侧边栏的 **Other Locations**
3. 在底部的 **Connect to Server** 字段输入：
   ```
   sftp://user@hostname
   ```
4. 按 Enter，输入密码

### 终端方式

```bash
nautilus sftp://user@hostname
```

## 解决 Nautilus 中的认证问题

如果 Nautilus 连接时遇到"too many authentication failures"错误，需要在 `~/.ssh/config` 中配置：

```
Host hostname
    User username
    IdentitiesOnly yes
    PreferredAuthentications password
    PubkeyAuthentication no
```

这样 Nautilus 就会使用密码认证，不会尝试多个密钥。

## 验证连接

在连接前，可以先在终端测试：

```bash
ssh -o PreferredAuthentications=password user@hostname
```

如果终端连接成功，Nautilus 也应该能正常连接。

