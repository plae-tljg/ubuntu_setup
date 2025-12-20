# SSH 跳板和代理

## 使用场景

当你需要通过一台机器（跳板机）连接到另一台机器时，可以使用 SSH 跳板功能。例如：
- 你的电脑 → 跳板机 → 目标 VM/服务器
- 通过跳板机访问内网中的其他机器

## 方法 1：ProxyJump（推荐）

SSH 7.3+ 支持 `ProxyJump` 选项：

```bash
ssh -J jump_user@jump_host target_user@target_host
```

或者分步：

```bash
ssh -J jump_user@jump_host:port target_user@target_host
```

### 在 SSH config 中配置

编辑 `~/.ssh/config`：

```
Host jump_host
    HostName jump_host_ip
    User jump_user
    Port 22

Host target_host
    HostName target_host_ip
    User target_user
    ProxyJump jump_host
```

然后直接连接：

```bash
ssh target_host
```

## 方法 2：ProxyCommand（兼容旧版本）

对于较旧的 SSH 版本，使用 `ProxyCommand`：

```bash
ssh -o ProxyCommand="ssh -W %h:%p jump_user@jump_host" target_user@target_host
```

### 在 SSH config 中配置

```
Host jump_host
    HostName jump_host_ip
    User jump_user

Host target_host
    HostName target_host_ip
    User target_user
    ProxyCommand ssh -W %h:%p jump_host
```

## 方法 3：多级跳板

可以通过多个跳板机：

```bash
ssh -J jump1,jump2,jump3 target_host
```

或在 config 中：

```
Host target_host
    HostName target_host_ip
    User target_user
    ProxyJump jump1,jump2,jump3
```

## 使用示例

### 场景：通过跳板机访问 VM

假设：
- 跳板机：`jump_user@192.168.x.x`
- 目标 VM：`vm_user@10.0.0.x`（只能从跳板机访问）

**方法 1（ProxyJump）**：
```bash
ssh -J jump_user@192.168.x.x vm_user@10.0.0.x
```

**方法 2（config 配置）**：
```
Host jump
    HostName 192.168.x.x
    User jump_user

Host vm
    HostName 10.0.0.x
    User vm_user
    ProxyJump jump
```

然后：
```bash
ssh vm
```

## SFTP 通过跳板机

SFTP 也支持跳板（如遇认证失败、密钥问题，可加 `-o IdentitiesOnly=yes`，让 SFTP 只用配置的密钥认证）：

```bash
sftp -J jump_user@jump_host target_user@target_host
```
> 如果直接能正常连，则 `-o IdentitiesOnly=yes` 可省略，根据实际需要添加即可。

```bash
sftp -o IdentitiesOnly=yes -J jump_user@jump_host target_user@target_host
```

或在 Nautilus 中，先配置好 SSH config，然后：

```bash
nautilus sftp://target_user@target_host
```

## 注意事项

1. **密钥认证**：确保跳板机和目标机都配置了正确的 SSH 密钥
2. **Agent Forwarding**：可以使用 `ForwardAgent yes` 来转发 SSH agent
3. **保持连接**：可以使用 `ServerAliveInterval` 保持连接活跃

### 完整配置示例

```
Host jump
    HostName 192.168.x.x
    User jump_user
    ForwardAgent yes
    ServerAliveInterval 60

Host target
    HostName 10.0.0.x
    User target_user
    ProxyJump jump
    ServerAliveInterval 60
```

