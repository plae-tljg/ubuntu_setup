<template>
  <div class="code-viewer">
    <div class="code-header">
      <h3>{{ title }}</h3>
      <div class="code-controls">
        <select v-model="selectedLanguage" class="language-select">
          <option value="auto">自动检测</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="swift">Swift</option>
          <option value="kotlin">Kotlin</option>
          <option value="scala">Scala</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="scss">SCSS</option>
          <option value="json">JSON</option>
          <option value="xml">XML</option>
          <option value="yaml">YAML</option>
          <option value="markdown">Markdown</option>
          <option value="bash">Bash</option>
          <option value="sql">SQL</option>
        </select>
        <button @click="toggleView" class="toggle-btn">
          {{ isExpanded ? '收起' : '展开' }}
        </button>
        <button @click="copyCode" class="copy-btn" v-if="isClient">
          复制代码
        </button>
        <button @click="downloadFile" class="download-btn" v-if="isClient">
          下载文件
        </button>
      </div>
    </div>
    
    <div v-if="isExpanded" class="code-content">
      <div class="code-wrapper">
        <div v-if="loading" class="loading">
          加载中...
        </div>
        <div v-else-if="error" class="error">
          {{ error }}
        </div>
        <div v-else class="code-display">
          <div class="line-numbers">
            <span v-for="line in lineCount" :key="line" class="line-number">{{ line }}</span>
          </div>
          <pre class="code-block"><code :class="codeClass">{{ formattedCode }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeViewer',
  props: {
    title: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'auto'
    },
    maxLines: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      isExpanded: false,
      selectedLanguage: 'auto',
      codeContent: '',
      loading: false,
      error: null,
      isClient: false
    }
  },
  mounted() {
    this.isClient = true;
  },
  computed: {
    codeClass() {
      if (this.selectedLanguage === 'auto') {
        return this.detectLanguage();
      }
      return `language-${this.selectedLanguage}`;
    },
    lineCount() {
      if (!this.codeContent) return [];
      const lines = this.codeContent.split('\n');
      return Array.from({ length: Math.min(lines.length, this.maxLines) }, (_, i) => i + 1);
    },
    formattedCode() {
      if (!this.codeContent) return '';
      const lines = this.codeContent.split('\n');
      return lines.slice(0, this.maxLines).join('\n');
    }
  },
  watch: {
    language: {
      immediate: true,
      handler(newLang) {
        this.selectedLanguage = newLang;
      }
    },
    filePath: {
      immediate: true,
      handler() {
        if (this.isExpanded) {
          this.loadCode();
        }
      }
    }
  },
  methods: {
    toggleView() {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded && !this.codeContent) {
        this.loadCode();
      }
    },
    async loadCode() {
      if (!this.isClient) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(this.filePath);
        if (!response.ok) {
          throw new Error(`无法加载文件: ${response.status} ${response.statusText}`);
        }
        this.codeContent = await response.text();
      } catch (err) {
        this.error = err.message;
        console.error('加载代码文件失败:', err);
      } finally {
        this.loading = false;
      }
    },
    detectLanguage() {
      if (!this.filePath) return '';
      
      const extension = this.filePath.split('.').pop()?.toLowerCase();
      const languageMap = {
        'py': 'python',
        'js': 'javascript',
        'ts': 'typescript',
        'java': 'java',
        'cpp': 'cpp',
        'cc': 'cpp',
        'cxx': 'cpp',
        'c': 'c',
        'go': 'go',
        'rs': 'rust',
        'php': 'php',
        'rb': 'ruby',
        'swift': 'swift',
        'kt': 'kotlin',
        'scala': 'scala',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'json': 'json',
        'xml': 'xml',
        'yaml': 'yaml',
        'yml': 'yaml',
        'md': 'markdown',
        'sh': 'bash',
        'sql': 'sql'
      };
      
      return `language-${languageMap[extension] || 'text'}`;
    },
    async copyCode() {
      if (!this.isClient) return;
      
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(this.codeContent);
        } else {
          // 降级方案
          const textArea = document.createElement('textarea');
          textArea.value = this.codeContent;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        
        // 可以添加一个临时的成功提示
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '已复制!';
        btn.style.background = '#28a745';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    },
    downloadFile() {
      if (!this.isClient || !this.codeContent) return;
      
      try {
        const blob = new Blob([this.codeContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.filePath.split('/').pop() || 'code.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('下载失败:', err);
      }
    }
  }
}
</script>

<style scoped>
.code-viewer {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  margin: 1rem 0;
  background: #f6f8fa;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #ffffff;
  border-bottom: 1px solid #e1e4e8;
  border-radius: 6px 6px 0 0;
}

.code-header h3 {
  margin: 0;
  color: #24292e;
  font-size: 1.1rem;
}

.code-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.language-select {
  padding: 0.5rem;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  background: #ffffff;
  color: #24292e;
  font-size: 0.875rem;
  cursor: pointer;
}

.toggle-btn, .copy-btn, .download-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  background: #ffffff;
  color: #24292e;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.toggle-btn:hover, .copy-btn:hover, .download-btn:hover {
  background: #f3f4f6;
  border-color: #b1b7bd;
}

.toggle-btn:active, .copy-btn:active, .download-btn:active {
  background: #e1e4e8;
}

.copy-btn {
  background: #0366d6;
  color: white;
  border-color: #0366d6;
}

.copy-btn:hover {
  background: #0256cc;
  border-color: #0256cc;
}

.download-btn {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.download-btn:hover {
  background: #218838;
  border-color: #1e7e34;
}

.code-content {
  padding: 1rem;
}

.code-wrapper {
  position: relative;
  min-height: 200px;
}

.loading, .error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #586069;
  font-style: italic;
}

.error {
  color: #d73a49;
}

.code-display {
  display: flex;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  overflow: hidden;
}

.line-numbers {
  background: #f6f8fa;
  border-right: 1px solid #e1e4e8;
  padding: 1rem 0.5rem;
  text-align: right;
  min-width: 3rem;
  user-select: none;
}

.line-number {
  display: block;
  color: #6a737d;
  font-size: 0.875rem;
  line-height: 1.5;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.code-block {
  margin: 0;
  padding: 1rem;
  background: #ffffff;
  overflow-x: auto;
  flex: 1;
}

.code-block code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #24292e;
  white-space: pre;
}

/* 语法高亮基础样式 */
.language-python .keyword { color: #d73a49; }
.language-python .string { color: #032f62; }
.language-python .comment { color: #6a737d; }

.language-javascript .keyword { color: #d73a49; }
.language-javascript .string { color: #032f62; }
.language-javascript .comment { color: #6a737d; }

.language-java .keyword { color: #d73a49; }
.language-java .string { color: #032f62; }
.language-java .comment { color: #6a737d; }

.language-cpp .keyword { color: #d73a49; }
.language-cpp .string { color: #032f62; }
.language-cpp .comment { color: #6a737d; }

.language-c .keyword { color: #d73a49; }
.language-c .string { color: #032f62; }
.language-c .comment { color: #6a737d; }

@media (max-width: 768px) {
  .code-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .code-controls {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .toggle-btn, .copy-btn, .download-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .language-select {
    padding: 0.4rem;
    font-size: 0.8rem;
  }
  
  .code-display {
    flex-direction: column;
  }
  
  .line-numbers {
    border-right: none;
    border-bottom: 1px solid #e1e4e8;
    text-align: left;
    padding: 0.5rem;
  }
}
</style>
