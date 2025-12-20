# 网络工具

## Wireshark

```bash
sudo apt-get install wireshark
```

安装时选择允许非 root 用户捕获数据包。

## Zoiper5

从 [Zoiper 官网](https://www.zoiper.com/en/voip-softphone/download/zoiper5/for/linux) 下载 .deb 文件：

```bash
sudo dpkg -i zoiper5_x.x.x_amd64.deb
sudo apt --fix-broken install
```

## ZeroTier

### 安装 CLI

```bash
curl -s https://install.zerotier.com | sudo bash
```

### 安装 GUI

```bash
git clone https://github.com/tralph3/ZeroTier-GUI.git
cd ZeroTier-GUI
chmod +x make_deb.sh
./make_deb.sh
sudo dpkg -i ZeroTier-GUI.deb
```

