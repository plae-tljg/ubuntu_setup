# Common Command for Audio



## spd-say

```bash
spd-say 'lkm'
spd-say "mu ka de ku lun no ka"
```

## Espeak

Try install espeak and do TTS:  

<ReferenceViewer 
  title="Compile for Espeak" 
  htmlPath="/assets/espeak/解决espeak编译的一些问题 - inss!w! - 博客园.html"
  originalUrl="https://www.cnblogs.com/Hfolsvh/p/15057694.html"
/>

```bash
espeak -v en-us -s 150 -p 50 -w my_speech.wav "This is a custom voice with adjusted speed and pitch."

espeak -v zh -s 150 -p 50 -w my_speech1.wav "阿米诺斯"

espeak -v zh-yue -s 150 -p 50 -w my_speech1.wav "啊米诺斯"
```

If used for asterisk, do some sox:  

```bash
sox my_speech1.wav -r 8000 -c 1 -e signed-integer -b 16 asterisk_speech.wav
```

Unified commands as follows:  

```bash
espeak -v zh -s 150 -p 50 --stdout "阿米诺斯" | sox -t raw -r 22050 -c 1 -e signed-integer -b 16 - -r 8000 -c 1 -e signed-integer -b 16 welcome.wav
espeak -v zh -s 150 -p 50 --stdout "一德格拉米" | sox -t raw -r 22050 -c 1 -e signed-integer -b 16 - -r 8000 -c 1 -e signed-integer -b 16 menu.wav
espeak -v zh -s 150 -p 50 --stdout "阿莫西诺斯" | sox -t raw -r 22050 -c 1 -e signed-integer -b 16 - -r 8000 -c 1 -e signed-integer -b 16 bye.wav
```
