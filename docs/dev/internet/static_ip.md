# Ubuntu 设置静态 IP（临时与永久方法）说明

本页记录如何在 Ubuntu 下设置静态 IP，包括临时和永久方式，以及常见故障（如 DNS 无法解析）的解决方法。  

---

## 一、临时修改 IP（仅当前会话有效）

重启后会失效，适合测试或应急。  

**1. 查看本机网卡名称**  

```bash
ip a         # 找到类似 enp0s3 或 eth0 的网卡名
```

**2. 查看当前该网卡 IP**  

```bash
ip addr show dev enp0s3
```

> 记得将 `enp0s3` 换成你的实际网卡名，如 `eth0`  

**3. 移除已有 IP（如有）**  

```bash
sudo ip addr del 192.168.13.120/24 dev enp0s3
```

**4. 添加新的静态 IP**  

```bash
sudo ip addr add 192.168.13.114/24 dev enp0s3
```

**5. 添加默认网关（如你的网关是 192.168.13.1）**  

```bash
sudo ip route add default via 192.168.13.1 dev enp0s3
```

> 如果经常换机器/虚拟机，网卡名也可能是 `eth0`，命令改成：
> `sudo ip route add default via 192.168.13.1 dev eth0`

**临时解决无 DNS 解析问题方法**  

如果遇到“可以 ping 通 8.8.8.8 但不能上网/解析域名”（如长时间未重启后出现），一般原因是默认路由丢失或无 DNS：  

- 先检查默认路由是否存在  

```bash
ip route | grep default
```

- 若发现没有默认路由，再临时添加（例如网卡是 eth0）：  

```bash
sudo ip route add default via 192.168.13.1 dev eth0
```

  > `eth0` 改成你实际的网卡名。同理 enp0s3/ens33 等。  

- 若 DNS 没配置，也可在 `/etc/resolv.conf` 里添加，临时生效：  

```bash
sudo bash -c "echo 'nameserver 8.8.8.8' > /etc/resolv.conf"
sudo bash -c "echo 'nameserver 223.5.5.5' >> /etc/resolv.conf"
```

---

## 二、永久配置静态 IP（推荐）

推荐用于服务器等长期需求，配置一次，重启后生效。  

1. **编辑 Netplan 配置文件**

（新 Ubuntu 默认用 Netplan，文件名示例：`/etc/netplan/01-network-manager-all.yaml`，实际可能文件名不同。）  

```yaml
network:
version: 2
renderer: NetworkManager
ethernets:
    enp0s3:                   # 注意替换为你的网卡名
    dhcp4: no
    addresses:
        - 192.168.13.114/24   # 你的静态 IP 和掩码
    gateway4: 192.168.13.1  # 默认网关
    nameservers:
        addresses: [8.8.8.8, 223.5.5.5]
```

2. **保存后设定权限（可选）**  

    ```bash
    sudo chmod 600 /etc/netplan/01-network-manager-all.yaml
    sudo chown root:root /etc/netplan/01-network-manager-all.yaml
    ```

3. **应用配置**  

```bash
sudo netplan apply
```

或先用 `sudo netplan try` 测试，120 秒内不确定可自动回滚。

---

**常见注意事项：**  

- 上述所有 `enp0s3` 或 `eth0` 均需换为你真实的网卡名。  

- 配置完成可用 `ip addr` 查看 IP，`ip route` 检查路由，`cat /etc/resolv.conf` 检查 DNS。  

- 多网卡服务器可按同样格式继续添加其它网卡配置。  

- 如果用了 `renderer: NetworkManager`，可通过桌面工具 NetworkManager 或 `nmcli` 管理。  


**参考资料**  

[https://www.freecodecamp.org/news/setting-a-static-ip-in-ubuntu-linux-ip-address-tutorial/](https://www.freecodecamp.org/news/setting-a-static-ip-in-ubuntu-linux-ip-address-tutorial/)


