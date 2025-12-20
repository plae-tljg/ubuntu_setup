# Asterisk 音频处理

## 快速生成 Asterisk 可用音频

Asterisk 需要特定格式的音频文件。以下是转换命令：

### 使用 ffmpeg

```bash
sudo ffmpeg -i /var/lib/asterisk/sounds/custom/input.wav \
       -ac 1 \             # 转换为单声道（关键！）
       -ar 8000 \          # 8kHz 采样率（电话标准）
       -acodec pcm_s16le \ # 16-bit PCM（Asterisk 要求）
       -y \                # 覆盖而不提示
       /var/lib/asterisk/sounds/custom/output.wav
```

### 使用 sox

```bash
sox input.wav -r 8000 -c 1 -s output.wav
```

### 批量转换

对于批量转换为 `.ulaw` 等格式，参考脚本：

<CodeViewer 
  title="批量转换脚本" 
  filePath="/lib/asterisk_scripts/convert_all_ulaw.sh"
  language="bash"
/>

## 音频格式要求

- **采样率**：8000 Hz（电话标准）
- **声道**：单声道（MONO）
- **编码**：PCM 16-bit 或 ulaw/alaw
- **格式**：WAV 文件

