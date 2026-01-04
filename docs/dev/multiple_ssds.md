# 多 SSD 存储管理与快捷访问

本文档记录在 Ubuntu 系统上管理多个 SSD 的方法，包括挂载不同文件系统的分区和创建符号链接以便快速访问。

## 系统磁盘布局

当前系统配置了多个 NVMe SSD，以下是磁盘布局：

```
nvme0n1     259:0    0   1.9T  0 disk
├─nvme0n1p1 259:1    0   100M  0 part /boot/efi
├─nvme0n1p2 259:2    0    16M  0 part
├─nvme0n1p3 259:3    0 880.6G  0 part        # Windows NTFS 分区
├─nvme0n1p4 259:4    0   768M  0 part
└─nvme0n1p5 259:5    0     1T  0 part        # Ubuntu EXT4 分区

nvme1n1     259:6    0   1.9T  0 disk
├─nvme1n1p1 259:7    0    16M  0 part
└─nvme1n1p2 259:8    0   1.9T  0 part /      # 系统根目录
```

## 挂载额外分区

### 创建挂载点

```bash
# 为 Ubuntu 数据分区创建挂载点
sudo mkdir /mnt/ubuntu_ssd1_nvme0n1p5

# 为 Windows 数据分区创建挂载点
sudo mkdir /mnt/win_ssd1_nvme0n1p3
```

### 挂载分区

```bash
# 挂载 Ubuntu EXT4 分区
sudo mount /dev/nvme0n1p5 /mnt/ubuntu_ssd1_nvme0n1p5

# 挂载 Windows NTFS 分区
sudo mount /dev/nvme0n1p3 /mnt/win_ssd1_nvme0n1p3
```

### 配置自动挂载

编辑 `/etc/fstab` 文件添加自动挂载：

```bash
sudo nano /etc/fstab
```

添加以下行：
```
/dev/nvme0n1p5  /mnt/ubuntu_ssd1_nvme0n1p5  ext4  defaults  0  2
/dev/nvme0n1p3  /mnt/win_ssd1_nvme0n1p3  ntfs-3g  defaults  0  0
```

## 创建快捷访问符号链接

为了方便访问，创建符号链接到用户主目录：

```bash
# 链接到 Ubuntu 分区的用户目录
sudo ln -s /mnt/ubuntu_ssd1_nvme0n1p5/home/lkm /home/lkm/ubuntu_ssd1_nvme0n1p5_lkm

# 链接到 Windows 分区的用户目录
sudo ln -s /mnt/win_ssd1_nvme0n1p3/Users/user /home/lkm/win_ssd1_nvme0n1p3_user
```

## 使用方法

创建符号链接后，可以通过以下方式快速访问：

- **Ubuntu 数据**: `~/ubuntu_ssd1_nvme0n1p5_lkm`
- **Windows 数据**: `~/win_ssd1_nvme0n1p3_user`

在文件管理器中可以直接导航到这些位置。

## 注意事项

1. **权限设置**: 确保挂载的分区具有适当的权限
2. **文件系统兼容性**: EXT4 用于 Linux，NTFS 用于 Windows 兼容性
3. **符号链接**: 使用 `ln -s` 创建符号链接而不是硬链接
4. **fstab 配置**: 确保 UUID 或设备路径正确，以防设备顺序变化

## 故障排除

### 挂载失败
- 检查设备路径是否正确：`ls /dev/nvme*`
- 确认分区表：`sudo fdisk -l /dev/nvme0n1`
- 检查文件系统：`sudo blkid /dev/nvme0n1p5`

### 权限问题
- 设置正确的文件权限：`sudo chown -R $USER:$USER /mnt/mount_point`
- 检查 SELinux/AppArmor 设置（如果启用）

### 符号链接问题
- 使用绝对路径创建符号链接
- 确保目标目录存在且可访问

## 扩展阅读

- [Linux 磁盘管理基础](https://wiki.archlinux.org/title/Device_file)
- [fstab 配置详解](https://wiki.archlinux.org/title/Fstab)
- [NTFS-3G 挂载选项](https://manpages.ubuntu.com/manpages/focal/man8/mount.ntfs-3g.8.html)
