# Common Commands of Asterisk

For Asterisk phone sever, common commands are like these:  

## Seeing logs

| 命令             | 作用说明             |
|------------------|----------------------|
|     sudo asterisk -rvvv   | see asterisk console |
| sudo asterisk -rvvvvvvvvvvvvvv    |  add as many `v` as you like  |

## Location of Asterisk Files

In `/etc/asterisks`, there are asterisk config files.  

```bash
sudo gedit /etc/asterisk/pjsip.conf 
sudo gedit /etc/asterisk/extensions.conf 
```

In `/var/lib/asterisk`, these are default locations for audio, scripts, so on run by asterisk.  

In `/var/spool/asterisk`, these contain asterisk generated files, like recording by `MixMonitor`.  

Config files can be like:  

<br />
<CodeViewer 
  title="Simple model" 
  filePath="/lib/asterisk_scripts/pjsip.conf"
  language="bash"
/>

<br />
<CodeViewer 
  title="Simple model" 
  filePath="/lib/asterisk_scripts/extensions.conf"
  language="bash"
/>

<br />

### Some Miscellaneous Commands

Remember change the permission and owners of files for asterisk using, like to `asterisk:asterisk` or `root:root` depending on which user using asterisk:  

```bash
sudo chmod -R 750 /var/lib/asterisk/agi-bin/
sudo chown -R root:root .   #currently at /var/lib/asterisk/sound
```

## Commands inside Asterisk Console

| 命令             | 作用说明             |
|------------------|----------------------|
|   pjsip reload | reload endpoints |
| core reload  | reload almost everything? |
| dialplan reload  | reload extensions |
| pjsip show endpoints  | show endpoints |
| core show channels verbose  | show channels of call ongoing |
| originate PJSIP/1004 extension 500@default  | start an anonymous call |
|  sip show debug on  |  consider changing sip to pjsip  |
|  rtp set debug on  |  see audio debug  |

## Running Commands outside Asterisk Console

By `sudo asterisk -rx '....'` for asterisk console commands,  

| 命令             | 作用说明             |
|------------------|----------------------|
| sudo asterisk -rx "pjsip reload"  | reload endpoints |
| sudo asterisk -rx "core reload"    | reload almost everything?  |
| sudo asterisk -rx "dialplan reload"    | reload extensions  |

## Complete Logging

| 命令             | 作用说明             |
|------------------|----------------------|
|  script -q -c "sudo asterisk -rvvvvv" /dev/null \| tee -a log.log | log everything appearing in asterisk console |
| sudo asterisk -rx "core reload"    | reload almost everything?  |
| sudo asterisk -rx "dialplan reload"    | reload extensions  |

## Making Shortcuts

Asterisk folders take some time to navigate to, better make shortcut:  

```bash
cd /
sudo mkdir asterisk_proj
cd asterisk_proj
sudo ln -s /etc/asterisk/ asterisk_conf
sudo ln -s /var/lib/asterisk/agi-bin/ agi_bin
sudo ln -s /var/spool/asterisk/monitor/rec asterisk_rec
```

### Quick Generation of Asterisk Usable Audio

```bash
sudo ffmpeg -i /var/lib/asterisk/sounds/custom/output2.wav -ac 1 -ar 8000 -acodec pcm_s16le -y /var/lib/asterisk/sounds/custom/output3.wav
sox input.wav -r 8000 -c 1 -s output.wav

ffmpeg -i /var/lib/asterisk/sounds/custom/output2.wav \
       -ac 1 \             # Convert to MONO (critical!)
       -ar 8000 \          # 8kHz sample rate (telephony standard)
       -acodec pcm_s16le \ # 16-bit PCM (required by Asterisk)
       -y \                # Overwrite without prompt
       /var/lib/asterisk/sounds/custom/output2.wav
```

For bulk convert to suitable formats like `.ulaw`, follow scripts like:  

<br />
<CodeViewer 
  title="Simple model" 
  filePath="/lib/asterisk_scripts/convert_all_ulaw.sh"
  language="bash"
/>