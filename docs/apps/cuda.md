# Nvidia GPU settings

## NVIDIA GPU Driver

(Note that this page is written 3 days after finishing the task, so some command are just by seeing my ai chat history, and some history are deleted already, don't know if work)  

There is some problem with ubuntu's gpu driver installation (on my own experience), by just  

```bash
sudo ubuntu-drivers autoinstall
```

### Previous Experience

When i unplug my `4060 8G` to `5060Ti 16G`, uninstalling everything related to Nvidia, and use above command, the `nvidia-smi` doesnt detect device.  

#### Extra Problem beforehand?

There is extra problem beforehand (may not be the real problem obstructing installation of driver):  

I want to use integrated graphics (YYDS) of CPU but not use GPU, just plainly unplug DP cord from 4060 and plug the DP cord to motherboard DP port. Maybe that cause trouble?  

```bash
# to check if integrated graphics at work (though physically we already know it is not GPU at work)
lspci -k | grep -EA3 'VGA|3D|Display'
lspci | egrep 'VGA|3D'
```

```bash
# gets like following, from ai prompt, at least not see Nvidia there
00:02.0 VGA compatible controller: Intel Corporation HD Graphics 620 (rev 02)
        Subsystem: Dell HD Graphics 620
        Kernel driver in use: i915
        Kernel modules: i915
```

Check if GPU properly attached:  

```bash
sudo apt isntall mesa-utils
glxinfo | grep -E "OpenGL vendor|OpenGL renderer"
```

should see (?):  

```bash
#ai generated prompt, for reference only
OpenGL vendor string: NVIDIA Corporation
OpenGL renderer string: GeForce GTX 1650/PCIe/SSE2
```

Now AI suggested to use:  

```bash
sudo nano /etc/modprobe.d/blacklist-nouveau.conf
```

add following lines to file:  

```bash
blacklist nouveau
options nouveau modeset=0
```

update the initramfs (initial ram file system) and reboot:  

```bash
sudo update-initramfs -u
sudo reboot now
```

#### Towards Real Problem

I run like:

```bash
sudo apt purge '*nvidia*'
sudo apt purge '*cuda*'
sudo apt-get purge nvidia*
reboot now
sudo ubuntu-drivers autoinstall
reboot now
nvidia-smi
```

`nvidia-smi` shows 

```bash
NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver. Make sure that the latest NVIDIA driver is installed and running.
```


### How to install

To install nvidia driver properly, try to install from its official site, go to [https://www.nvidia.com/en-us/drivers](https://www.nvidia.com/en-us/drivers), remember for your gpu driver version number, the `580` or `580.76` for my `5060Ti` GPU.  

Run the downloaded file:  

```bash
chmod +x NVIDIA-Linux-x86_64-580.76.05.run
sudo ./NVIDIA-Linux-x86_64-580.76.05.run # choose the MIT in option, ppl say that
sudo ./NVIDIA-Linux-x86_64-580.76.05.run --no-opengl-files  # for installing driver but still use integrated graphics
sudo reboot
nvidia-smi
```

## CUDA Toolkits

To use GPU for AI computation, have to install cuda toolkits.  

There is a complicated site for installation guide (though I never finish reading it), [https://docs.nvidia.com/cuda/cuda-installation-guide-linux/](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/):  

<br />

<ReferenceViewer 
  title="Official CUDA Installation Guide for Linux" 
  htmlPath="/assets/cuda/CUDA Installation Guide for Linux — Installation Guide for Linux 13.0 documentation.html"
  originalUrl="https://docs.nvidia.com/cuda/cuda-installation-guide-linux/"
/>

For compatibility table between driver version and CUDA toolkits version, let's see [https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html](https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html) (can also see [https://stackoverflow.com/questions/28932864/which-compute-capability-is-supported-by-which-cuda-versions/28933055#28933055](https://stackoverflow.com/questions/28932864/which-compute-capability-is-supported-by-which-cuda-versions/28933055#28933055))

<br />

<ReferenceViewer 
  title="Official CUDA Relase Note" 
  htmlPath="/assets/cuda/CUDA Toolkit 13.0 - Release Notes — Release Notes 13.0 documentation.html"
  originalUrl="https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html"
/>

So we see that for driver version `>=580`, you have to use the CUDA version `>=13.0`, which at this moment only `13.0` is available.  

## Installation Guide

To install `CUDA 12.8`, please see following reference or guide:  

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/13.0.0/local_installers/cuda-repo-ubuntu2204-13-0-local_13.0.0-580.65.06-1_amd64.deb
#wget https://developer.download.nvidia.com/compute/cuda/13.0.0/local_installers/cuda-repo-ubuntu2204-12-8-local_12.8.0-570.86.10-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu2204-12-8-local_12.8.0-570.86.10-1_amd64.deb
sudo cp /var/cuda-repo-ubuntu2204-12-8-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-8
sudo reboot now
```

Check your installation by:  

```bash
nvcc --version
```

Remember add relevant PATH to `.bashrc` for later use:  

```bash
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```

<br />

<ReferenceViewer 
  title="CUDA Download and Installation" 
  htmlPath="/assets/cuda/CUDA Toolkit 13.0 Downloads _ NVIDIA Developer.html"
  originalUrl="https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Ubuntu&target_version=22.04&target_type=deb_local"
/>

### More test on CUDA Installations

Run on one terminal:  

```bash
watch -n .5 nvidia-smi
```

Test by running QWEN3:  

Create venv first, note that there is other compatibility table for torch, for installation see [https://pytorch.org/get-started/locally/](https://pytorch.org/get-started/locally/):  

```bash
python3.10 -m venv test_env
source ./test_env/bin/activate
pip3 install torch torchvision
pip install transformers
# remember pip install nay missing dependency as you find missing when runnign below py
```

Smaller test first:  

<CodeViewer 
  title="Simple model" 
  filePath="/lib/test_cuda/test_cuda_simple.py"
  language="python"
/>

Larger test:  

<CodeViewer 
  title="QWEN3" 
  filePath="/lib/test_cuda/test_cuda_qwen.py"
  language="python"
/>


## GPU for CUDA, Integrated Graphics (iGPU) for Graphics

Following are references for installing for the purpose of "iGPU for screen rendering and GPU for computing". THe methods from first reference is tested and can work.  

<ReferenceViewer 
  title="Use integrated graphics for display and NVIDIA GPU for CUDA on Ubuntu 14.04" 
  htmlPath="/assets/cuda/use_integrated_graphics/Use integrated graphics for display and NVIDIA GPU for CUDA on Ubuntu 14.04.html"
  originalUrl="https://gist.github.com/alexlee-gk/76a409f62a53883971a18a11af93241b?permalink_comment_id=3102545"
/>

<br />
<ReferenceViewer 
  title="Intel Integrated Graphics, dedicated GPU for CUDA and Ubuntu 13.10 and 14.04" 
  htmlPath="/assets/cuda/use_integrated_graphics/osdf's log _ Intel Integrated Graphics, dedicated GPU for CUDA and Ubuntu 13.10 and 14.04.html"
  originalUrl="https://osdf.github.io/blog/intel-integrated-graphics-dedicated-gpu-for-cuda-and-ubuntu-1310.html"
/>


<ReferenceViewer 
  title="[SOLVED] Run CUDA on dedicated NVIDIA GPU while connecting monitors to Intel HD graphics, is this possible?" 
  htmlPath="/assets/cuda/use_integrated_graphics/[SOLVED] Run CUDA on dedicated NVIDIA GPU while connecting monitors to Intel HD graphics, is this possible_ - CUDA _ CUDA Setup and Installation - NVIDIA Developer Forums.html"
  originalUrl="https://forums.developer.nvidia.com/t/solved-run-cuda-on-dedicated-nvidia-gpu-while-connecting-monitors-to-intel-hd-graphics-is-this-possible/47690"
/>


<ReferenceViewer 
  title="Ask Ubuntu - How to configure iGPU for xserver and nvidia GPU for CUDA work" 
  htmlPath="/assets/cuda/use_integrated_graphics/drivers - How to configure iGPU for xserver and nvidia GPU for CUDA work - Ask Ubuntu.html"
  originalUrl="https://askubuntu.com/questions/1061551/how-to-configure-igpu-for-xserver-and-nvidia-gpu-for-cuda-work"
/>

<ReferenceViewer 
  title="
Using GPU for CUDA and integrated graphics for display - can’t make it work " 
  htmlPath="/assets/cuda/use_integrated_graphics/Using GPU for CUDA and integrated graphics for display - can't make it work - CUDA _ CUDA Setup and Installation - NVIDIA Developer Forums.html"
  originalUrl="https://forums.developer.nvidia.com/t/using-gpu-for-cuda-and-integrated-graphics-for-display-cant-make-it-work/49820"
/>