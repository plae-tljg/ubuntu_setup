# NVIDIA GPU 与 CUDA 环境配置

## NVIDIA GPU 驱动安装

### 推荐安装方法

直接从 NVIDIA 官网下载并安装驱动，通常比 Ubuntu 的自动安装更可靠。

1. 访问 [NVIDIA 驱动下载页面](https://www.nvidia.com/en-us/drivers)，找到适合你 GPU 的驱动版本。例如，对于 `5060Ti` GPU，需要 `580` 系列驱动（如 `580.76`）。

2. 下载并运行安装程序：

```bash
chmod +x NVIDIA-Linux-x86_64-580.76.05.run
sudo ./NVIDIA-Linux-x86_64-580.76.05.run  # 选择 MIT 选项
sudo reboot
nvidia-smi  # 验证安装
```

### 注意事项

在某些情况下，使用 `sudo ubuntu-drivers autoinstall` 可能无法正确安装驱动，导致 `nvidia-smi` 无法检测到设备。如果遇到问题，建议使用官方安装程序。

## CUDA Toolkit 安装

要使用 GPU 进行 AI 计算，需要安装 CUDA Toolkit。

### 兼容性说明

驱动版本和 CUDA Toolkit 版本之间存在兼容性要求。查看兼容性表：
- [CUDA Toolkit 发布说明](https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html)
- [Stack Overflow - CUDA 版本与计算能力兼容性](https://stackoverflow.com/questions/28932864/which-compute-capability-is-supported-by-which-cuda-versions/28933055#28933055)

对于驱动版本 `>=580`，需要使用 CUDA 版本 `>=13.0`（目前只有 `13.0` 可用）。

### 官方安装指南

<ReferenceViewer 
  title="Official CUDA Installation Guide for Linux" 
  htmlPath="/assets/cuda/CUDA Installation Guide for Linux — Installation Guide for Linux 13.0 documentation.html"
  originalUrl="https://docs.nvidia.com/cuda/cuda-installation-guide-linux/"
/>

<ReferenceViewer 
  title="Official CUDA Release Note" 
  htmlPath="/assets/cuda/CUDA Toolkit 13.0 - Release Notes — Release Notes 13.0 documentation.html"
  originalUrl="https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html"
/>

### 安装步骤（以 CUDA 13.0 为例）

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/13.0.0/local_installers/cuda-repo-ubuntu2204-13-0-local_13.0.0-580.65.06-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu2204-13-0-local_13.0.0-580.65.06-1_amd64.deb
sudo cp /var/cuda-repo-ubuntu2204-13-0-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda-toolkit-13-0
sudo reboot now
```

### 验证安装

```bash
nvcc --version
```

### 环境变量配置

将以下内容添加到 `~/.bashrc` 中：

```bash
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```

然后重新加载配置：

```bash
source ~/.bashrc
```

<ReferenceViewer 
  title="CUDA Download and Installation" 
  htmlPath="/assets/cuda/CUDA Toolkit 13.0 Downloads _ NVIDIA Developer.html"
  originalUrl="https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_local"
/>

## CUDA 安装测试

### 实时监控 GPU

在一个终端中运行：

```bash
watch -n .5 nvidia-smi
```

### 使用 PyTorch 测试

创建虚拟环境并安装依赖：

```bash
python3.10 -m venv test_env
source ./test_env/bin/activate
pip3 install torch torchvision
pip install transformers
# 安装其他可能缺失的依赖
```

> 注意：PyTorch 与 CUDA 版本存在兼容性要求，安装前请查看 [PyTorch 官方安装指南](https://pytorch.org/get-started/locally/)

简单测试：

<CodeViewer 
  title="Simple model" 
  filePath="/lib/test_cuda/test_cuda_simple.py"
  language="python"
/>

更完整的测试（QWEN3）：

<CodeViewer 
  title="QWEN3" 
  filePath="/lib/test_cuda/test_cuda_qwen.py"
  language="python"
/>

## 内核更新后驱动问题

### 问题描述

当系统内核更新后（例如从 `6.8.0-85` 升级到 `6.8.0-87`），NVIDIA 驱动可能无法正常工作。

**症状：**

1. `nvidia-smi` 失败，显示无法与 NVIDIA 驱动通信
2. 运行 `sudo modprobe nvidia` 时提示模块未找到
3. 在 `/lib/modules/` 中可以看到新内核目录，但缺少 NVIDIA 驱动模块

**检查方法：**

```bash
# 查看已安装的内核版本
ls /lib/modules

# 查看内核更新历史
zcat /var/log/apt/history.log.*.gz | grep -A5 -B5 "linux-image"

# 尝试加载驱动模块
sudo modprobe nvidia
sudo modprobe nvidia_modeset
sudo modprobe nvidia_drm
```

### 解决方案

**重新安装驱动**，使其针对当前内核进行编译：

```bash
# 重新运行 NVIDIA 驱动安装程序
sudo ./NVIDIA-Linux-x86_64-580.76.05.run
sudo reboot
```

> 这实际上是一个常见问题，与 iGPU 配置无关，而是因为驱动需要在每个新内核上重新编译。

<ReferenceViewer 
  title="What's the process for fixing NVIDIA drivers after kernel updates in Ubuntu 20.04" 
  htmlPath="/assets/cuda/What's the process for fixing NVIDIA drivers after kernel updates in Ubuntu 20.04 - Graphics _ Linux _ Linux - NVIDIA Developer Forums.html"
  originalUrl="https://forums.developer.nvidia.com/t/whats-the-process-for-fixing-nvidia-drivers-after-kernel-updates-in-ubuntu-20-04/208870/3"
/>

## 历史问题参考

如果之前遇到过 iGPU 相关的问题，可以参考 [旧版 iGPU 问题记录](./gpu/old_igpu_problems.md)。
