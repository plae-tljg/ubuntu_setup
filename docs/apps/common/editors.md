# 编辑器与 IDE

## Sublime Text

```bash
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list
sudo apt-get update
sudo apt-get install sublime-text
```

## Neovim

```bash
sudo apt-get install neovim
```

或安装最新版本：

```bash
sudo add-apt-repository ppa:neovim-ppa/stable
sudo apt-get update
sudo apt-get install neovim
```

## Jupyter Notebook

```bash
pip3 install jupyter notebook
```

或使用 conda：

```bash
conda install jupyter notebook
```

启动：

```bash
jupyter notebook
```

