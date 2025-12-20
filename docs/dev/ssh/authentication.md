# SSH 认证问题解决

## "Too many authentication failures" 错误

当 SSH 客户端尝试太多认证方法（如多个 SSH 密钥）时，服务器会拒绝连接并断开。这在有多个 SSH 密钥加载到 agent 时很常见。

### 解决方案

#### 1. 使用 `IdentitiesOnly=yes` 选项

```bash
ssh -o IdentitiesOnly=yes user@hostname
```

这告诉 SSH 只使用配置中指定的身份/密钥，而不是尝试 agent 中的所有密钥。

#### 2. 配置 SSH config 文件

创建或编辑 `~/.ssh/config`：

```
Host hostname
    User username
    IdentitiesOnly yes
    PreferredAuthentications password
```

这会强制 SSH 只使用密码认证，不尝试多个密钥。

#### 3. 临时禁用 SSH agent

如果使用 SSH agent（如 ssh-agent），可以临时禁用：

```bash
SSH_AUTH_SOCK= ssh user@hostname
```

这会阻止 SSH 尝试 agent 中加载的所有密钥。

#### 4. 指定具体密钥

如果知道哪个密钥应该工作：

```bash
ssh -i ~/.ssh/specific_key user@hostname
```

#### 5. 清空 SSH agent 中的密钥

```bash
ssh-add -D
```

这会清空所有已加载的密钥。

### Nautilus 中的认证问题

Nautilus 使用 SFTP 连接时，默认会使用系统的 SSH 配置，但无法像终端那样直接添加参数。

**解决方法**：在 `~/.ssh/config` 中配置：

```
Host hostname
    User username
    IdentitiesOnly yes
    PreferredAuthentications password
    PubkeyAuthentication no
```

配置后，Nautilus 连接 SFTP 时会使用这些设置，避免"too many authentication failures"错误。

### 检查服务器认证限制

服务器可能有较低的认证尝试限制。可以在服务器的 `/etc/ssh/sshd_config` 文件中检查 `MaxAuthTries` 设置。

