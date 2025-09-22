# Common Apps Installation

## Google Chrome, Chromium

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt --fix-broken install
```

```bash
sudo apt-get install chromium-browser
```

## Git

```bash
sudo apt-get install git
sudo apt install git-lfs
```

You can also install github desktop, useless for me.  

```bash
sudo apt update && sudo apt install github-desktop
```

## Offices

We already have libreoffice, next is WPS. Download WPS from [https://www.wps.com/download/](https://www.wps.com/download/), then  

```bash
sudo dpkg -i wps-office_11.X4F7VK7r.1.0.11723.XA_amd64.deb
```

Similarly some more tools like meld, fldiff

```bash
sudo apt-get install meld
sudo apt install fldiff
```

## Multimedia

### Videos

```bash
sudo apt-get install vlc
```

### Images

```bash
sudo apt-get install imagemagick
sudo apt-get install gimp
```

## Games

```bash
sudo apt-get install gnome-mines
sudo apt-get install 2048-qt
sudo add-apt-repository ppa:libretro/stable && sudo apt-get update && sudo apt-get install retroarch
```

## Zerotier

```bash
curl -s https://install.zerotier.com | sudo bash    #install zerotier-cli
```

To install gui, may need run with sudo:  

```bash
git clone https://github.com/tralph3/ZeroTier-GUI.git
cd Zerotier-GUI
chmod +x make_deb.sh
./make_deb.sh
sudo dpkg -i ZeroTier-GUI.deb
```

## User Config

```bash
sudo apt install gnome-tweaks
```

## Tools made by Me

Install GUI for creating and managing SSH keys,  

```bash
sudo dpkg -i ssh-manager_1.0.0_amd64.deb
```

```bash
sudo dpkg -i shareboard_1.0.0_all.deb
sudo dpkg -i daily-commands.deb
```

