# KVM/QEMU 虚拟机配置与迁移

本页介绍 KVM/QEMU 基础命令、常用管理操作、VirtualBox 转盘、桥接网络与宿主/虚拟机间共享文件夹配置等。

---

## 1. 基础 KVM/QEMU 管理命令

下面是一些管理虚拟机实例的常用命令。

**列出所有虚拟机：**
```bash
virsh list --all
```

**启动虚拟机（以 myvm 为例）：**
```bash
virsh start myvm
```

**关闭虚拟机：**
```bash
virsh shutdown myvm
```

**强制关闭虚拟机：**
```bash
virsh destroy myvm
```

**打开虚拟机控制台：**
```bash
virsh console myvm
```

**编辑虚拟机定义（XML）：**
```bash
virsh edit myvm
```

**删除虚拟机（不删除磁盘，谨慎操作）：**
```bash
virsh undefine myvm
```

---

## 2. 安装必需工具

KVM/QEMU 主机一般需安装以下工具：

```bash
sudo apt update
sudo apt install qemu-utils virt-manager bridge-utils
```

* `qemu-utils`：QEMU 相关工具，如磁盘格式转换、镜像管理等  
* `virt-manager`：图形界面虚拟机管理器  
* `bridge-utils`：桥接网络支持工具   

---

## 3. VirtualBox VDI 格式虚拟盘转为 QCOW2

如果你有 VirtualBox 的 `.vdi` 镜像文件，可以如下转换为 QEMU/QCOW2 格式：  

```bash
qemu-img convert -f vdi -O qcow2 /path/to/your/virtualbox_vm.vdi /path/to/new_vm.qcow2
```

- `/path/to/your/virtualbox_vm.vdi`：原 VDI 镜像文件路径  
- `/path/to/new_vm.qcow2`：输出的 QCOW2 文件路径  

---

## 4. 桥接网络配置

改用桥接网络，可以让虚拟机拥有与物理主机同网段的 IP，便于访问。以下示例假设物理网卡为 `enp4s0`，计划桥接为 `br0` 且分配静态 IP `192.168.13.114`。  

编辑 netplan 配置文件（例如 `/etc/netplan/01-netcfg.yaml`），内容如下：  

<CodeViewer 
  title="Bridged Networking" 
  filePath="/lib/kvm_qemu/01-netcfg.yaml"
  language="yaml"
/>

应用新的网络配置并检查：

```bash
sudo netplan apply

# 查看 bridge 是否建立
sudo brctl show br0

# 查看 br0 的 IP 配置
ip addr show br0
```

---

## 5. 虚拟机共享文件夹（virtiofs）

KVM 支持通过 `virtiofs` 实现高效的主机-虚拟机共享文件夹。假设主机与虚拟机均已准备好 `/home/lkm/00shared` 目录。

### 权限设置

> **建议**：为避免权限问题，主机与虚拟机内对应目录可以临时设置最大读写权限：
>
> 在宿主机和虚拟机内均执行（实际生产环境下请按需调整权限，勿用于敏感目录）：
> ```bash
> sudo chmod 777 /home/lkm/00shared
> ```

### 挂载共享文件夹

在虚拟机内部挂载：

```bash
# inside VM
sudo mount -t virtiofs /home/lkm/00shared /home/lkm/00shared
```

### 开机自动挂载

编辑 `/etc/fstab`：

```bash
sudo nano /etc/fstab
```

添加以下行，实现自动挂载 virtiofs 共享目录（假设共享名和挂载点均为 `/home/lkm/00shared`）：

```bash
/home/lkm/00shared /home/lkm/00shared  virtiofs  defaults,_netdev  0  0
```

> 注：确保创建和启动虚拟机时已添加 virtiofs 设备，具体请参考 [libvirt documentation](https://wiki.libvirt.org/guestfs-and-virtiofs.html) 或 virt-manager 图形设置。

---

如需更多详细教程，请查阅 [KVM/QEMU 官方文档](https://wiki.qemu.org/Documentation) 或本仓库收录的 [netplan 网络配置示例](/lib/kvm_qemu/01-netcfg.yaml)。