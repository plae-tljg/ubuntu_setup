# SIP Trunk 配置指南

本文档基于实际工作配置，展示如何配置 SIP Trunk 以实现服务器间通信。

## 理解 Trunk 的作用

SIP Trunk（中继）允许你的 Asterisk 服务器与其他 SIP 服务器通信。常见场景：
- **出站呼叫**：通过 trunk 服务器拨打外部号码
- **入站呼叫**：接收来自 trunk 服务器的呼叫，路由到你的扩展
- **服务器间通信**：让其他服务器可以拨打你的服务器并使用你的扩展

## 接收 Trunk 配置信息

当有人给你 trunk 配置信息时，通常会包含：
- **Trunk Server IP/地址**：trunk 服务器的 IP 地址
- **Extension/用户名**：用于认证的扩展号或用户名
- **Secret/密码**：认证密码
- **端口**（可选）：通常是 5060（SIP）和 RTP 端口范围

## 实际配置示例

### 1. Transport 配置（pjsip.conf）

首先配置传输层：

```conf
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
```

### 2. Trunk 端点配置

在 `/etc/asterisk/pjsip.conf` 中添加 trunk 配置：

```conf
; ============================================
; Trunk Server 配置 - 连接到外部服务器
; ============================================
; 允许来自 trunk server 的呼叫
[trunk-server]
type=identify
endpoint=trunk-server-endpoint
match=192.168.x.x  ; 替换为实际的 trunk 服务器 IP

[trunk-server-endpoint]
type=endpoint
context=from-trunk
disallow=all
allow=ulaw
allow=alaw
transport=transport-udp
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
direct_media=no
```

### 3. Trunk 注册配置（如果需要）

如果 trunk 服务器要求注册才能接收呼叫：

```conf
; 注册到 trunk server
[trunk-registration]
type=registration
outbound_auth=trunk-registration-auth
server_uri=sip:192.168.x.x  ; 替换为 trunk 服务器 IP
client_uri=sip:EXTENSION@192.168.x.x  ; EXTENSION 替换为实际扩展号
contact_user=EXTENSION
retry_interval=60
forbidden_retry_interval=300
expiration=3600
outbound_proxy=sip:192.168.x.x
transport=transport-udp

[trunk-registration-auth]
type=auth
auth_type=userpass
password=your_secret_here  ; 替换为实际密码
username=EXTENSION  ; 替换为实际扩展号
```

**注意**：如果对方不需要注册，可以注释掉注册部分。

### 4. 配置对应的扩展端点

如果 trunk 服务器会拨打你的特定扩展号，需要配置该扩展：

```conf
; ============================================
; 扩展配置（用于 trunk 呼叫）
; ============================================
; 认证配置
[EXTENSION]
type=auth
auth_type=userpass
password=your_secret_here  ; 替换为实际密码
username=EXTENSION  ; 替换为实际扩展号

; 地址记录 (AOR)
[EXTENSION]
type=aor
max_contacts=1

; 端点配置
[EXTENSION]
type=endpoint
context=internal
disallow=all
allow=ulaw
allow=alaw
auth=EXTENSION
aors=EXTENSION
transport=transport-udp
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
dtmf_mode=rfc4733
```

### 5. 配置入站路由（extensions.conf）

在 `/etc/asterisk/extensions.conf` 中配置如何处理来自 trunk 的呼叫：

```conf
; ============================================
; 从 Trunk Server 接收的呼叫路由
; ============================================
[from-trunk]
; 当从 trunk server 拨打特定扩展时，路由到内部扩展触发智能呼叫程序
exten => TRUNK_EXTENSION,1,NoOp(收到来自trunk的呼叫，分机: ${EXTEN}, 主叫: ${CALLERID(num)})
   same => n,Goto(internal,INTERNAL_EXTENSION,1)
   same => n,Hangup()

; 也支持直接拨打内部扩展
exten => INTERNAL_EXTENSION,1,NoOp(收到来自trunk的呼叫，直接拨打内部扩展)
   same => n,Goto(internal,INTERNAL_EXTENSION,1)
   same => n,Hangup()

; 默认路由：如果拨打其他号码，也可以路由到指定扩展
exten => _X.,1,NoOp(收到来自trunk的呼叫，分机: ${EXTEN}, 路由到内部扩展)
   same => n,Goto(internal,INTERNAL_EXTENSION,1)
   same => n,Hangup()
```

**配置说明**：
- `TRUNK_EXTENSION`：trunk 服务器拨打的扩展号（替换为实际值，如 4112）
- `INTERNAL_EXTENSION`：你的内部扩展号（替换为实际值，如 1001）
- `[from-trunk]`：上下文名称，必须与 `pjsip.conf` 中的 `context` 匹配

### 6. 内部扩展配置（extensions.conf）

确保内部扩展有正确的路由：

```conf
[internal]
; 内部扩展路由
exten => INTERNAL_EXTENSION,1,Goto(internal,INTERNAL_EXTENSION,1)
   same => n,Hangup()

[default]
; 默认上下文也可以路由到内部扩展
exten => INTERNAL_EXTENSION,1,Goto(internal,INTERNAL_EXTENSION,1)
   same => n,Hangup()
```

## 测试 Trunk 连接

### 1. 检查 Trunk 注册状态

在 Asterisk 控制台中：

```bash
# 查看所有端点状态
pjsip show endpoints

# 查看注册状态（如果 trunk 需要注册）
pjsip show registrations

# 查看认证信息
pjsip show auths
```

### 2. 检查 Trunk 连接

```bash
# 查看所有通道
core show channels verbose

# 启用 PJSIP 调试
pjsip set logger on
```

### 3. 测试入站呼叫

让 trunk 服务器拨打你的服务器，验证呼叫是否能正确路由到你的扩展。

观察日志：
```bash
tail -f /var/log/asterisk/full
```

### 4. 测试出站呼叫（如果配置了出站路由）

从你的扩展拨打外部号码，验证呼叫是否通过 trunk 路由。

## 常见问题排查

### Trunk 无法注册

1. **检查认证信息**：
   ```bash
   pjsip show auths
   ```
   确保用户名和密码正确

2. **检查网络连接**：
   ```bash
   ping trunk_server_ip
   ```

3. **检查防火墙**：
   - SIP 端口（通常是 5060 UDP）
   - RTP 端口范围（通常是 10000-20000 UDP）

4. **检查日志**：
   ```bash
   tail -f /var/log/asterisk/full
   ```

### 呼叫无法建立

1. **检查编解码器兼容性**：
   - 确保双方支持的编解码器匹配（如 ulaw、alaw）
   - 在 trunk 配置中明确指定 `allow` 和 `disallow`

2. **检查路由配置**：
   - 验证 `extensions.conf` 中的路由规则
   - 确保上下文（context）配置正确
   - 检查 `[from-trunk]` 上下文是否存在

3. **检查 NAT 设置**（如果 trunk 服务器在 NAT 后）：
   ```conf
   # 在 pjsip.conf 端点配置中可能需要添加
   rtp_symmetric=yes
   force_rport=yes
   rewrite_contact=yes
   direct_media=no
   ```

### 入站呼叫无法到达扩展

1. **检查 DID 路由**：
   - 如果 trunk 服务器发送特定的 DID 号码，需要在 `extensions.conf` 中配置匹配规则
   - 验证 `exten => TRUNK_EXTENSION` 是否正确

2. **检查上下文配置**：
   - 确保 trunk 端点的 `context=from-trunk` 设置正确
   - 验证 `extensions.conf` 中 `[from-trunk]` 上下文存在
   - 检查内部扩展的上下文是否正确

3. **检查扩展是否存在**：
   ```bash
   pjsip show endpoints
   ```
   确保目标扩展已配置

## 完整配置流程

1. **配置 Transport**：在 `pjsip.conf` 中添加 transport 配置
2. **配置 Trunk 端点**：添加 `identify` 和 `endpoint` 配置
3. **配置注册**（如果需要）：添加 `registration` 配置
4. **配置扩展**：添加对应的扩展端点配置
5. **配置路由**：在 `extensions.conf` 中添加 `[from-trunk]` 上下文
6. **重载配置**：
   ```bash
   pjsip reload
   dialplan reload
   ```
7. **验证连接**：使用 `pjsip show endpoints` 和 `pjsip show registrations` 检查状态
8. **测试入站**：让 trunk 服务器拨打你的服务器
9. **检查日志**：观察完整呼叫流程

## 安全注意事项

- **保护认证信息**：Secret/密码应该保密，不要暴露在日志或文档中
- **防火墙配置**：只开放必要的端口（SIP: 5060 UDP, RTP: 10000-20000 UDP）
- **访问控制**：使用 `identify` 配置限制哪些 IP 可以连接到你的 trunk
- **加密**（可选）：对于生产环境，考虑使用 TLS 加密 SIP 通信

## 实际工作场景示例

**场景**：有人给你 trunk 配置信息，让你创建一个 trunk，这样别人拨打他的服务器时可以拨打你的服务器并使用你的扩展。

**解决方案**：
1. 在 `pjsip.conf` 中配置 trunk 端点，允许来自对方服务器的连接
2. 配置注册（如果需要）以连接到对方的服务器
3. 在 `extensions.conf` 中配置 `[from-trunk]` 上下文，将入站呼叫路由到你的内部扩展
4. 确保你的内部扩展有正确的路由配置

这样，当有人通过对方的服务器拨打你配置的扩展号时，呼叫会被路由到你的服务器，并最终到达你的内部扩展，触发你的智能呼叫程序。

