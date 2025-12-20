# 图像编辑工具

## GIMP

```bash
sudo apt-get install gimp
```

## KolourPaint

```bash
sudo apt-get install kolourpaint
```

## Draw.io (diagrams.net)

### 方法 1：使用 AppImage

从 [draw.io 官网](https://github.com/jgraph/drawio-desktop/releases) 下载 AppImage：

```bash
chmod +x drawio-x.x.x-x86_64.AppImage
./drawio-x.x.x-x86_64.AppImage
```

### 方法 2：使用 Snap

```bash
sudo snap install drawio
```

### 方法 3：使用 .deb 包

从 [draw.io 官网](https://github.com/jgraph/drawio-desktop/releases) 下载 .deb 文件：

```bash
sudo dpkg -i drawio-amd64-x.x.x.deb
sudo apt --fix-broken install
```

## ImageMagick

```bash
sudo apt-get install imagemagick
```

