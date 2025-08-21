<template>
  <div class="reference-viewer">
    <div class="reference-header">
      <h3>{{ title }}</h3>
      <div class="reference-controls">
        <button @click="toggleView" class="toggle-btn">
          {{ isExpanded ? '收起' : '展开' }}
        </button>
        <button @click="openLocalHtml" class="local-btn" v-if="isClient">
          打开本地文件
        </button>
        <button @click="openInNewTab" class="external-btn" v-if="isClient">
          在新标签页打开
        </button>
      </div>
    </div>
    
    <div v-if="isExpanded" class="reference-content">
      <div class="content-wrapper">
        <iframe 
          v-if="htmlPath && isClient" 
          :src="getFullPath(htmlPath)" 
          class="reference-iframe"
          frameborder="0"
          @load="onIframeLoad"
        ></iframe>
        <div v-else-if="!isClient" class="loading">
          客户端加载中...
        </div>
        <div v-else class="loading">
          加载中...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReferenceViewer',
  props: {
    title: {
      type: String,
      required: true
    },
    htmlPath: {
      type: String,
      required: true
    },
    originalUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isExpanded: false,
      isClient: false
    }
  },
  mounted() {
    this.isClient = true;
  },
  methods: {
    getFullPath(path) {
      // 如果路径已经是绝对路径（以http或https开头），直接返回
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      
      // 如果路径以/开头，使用VuePress的$withBase处理
      if (path.startsWith('/')) {
        // 在客户端环境中，使用window.location.pathname来获取基础路径
        if (this.isClient) {
          const currentPath = window.location.pathname;
          // 提取基础路径（例如：/ubuntu_setup/）
          // 查找仓库名作为基础路径
          const pathParts = currentPath.split('/');
          if (pathParts.length >= 2) {
            const basePath = '/' + pathParts[1] + '/';
            return basePath + path.substring(1);
          }
        }
        return path;
      }
      
      // 相对路径直接返回
      return path;
    },
    toggleView() {
      this.isExpanded = !this.isExpanded;
    },
    openLocalHtml() {
      if (!this.isClient) return;
      
      try {
        // 构建完整的本地URL
        const baseUrl = window.location.origin;
        const localUrl = baseUrl + this.getFullPath(this.htmlPath);
        window.open(localUrl, '_blank');
      } catch (err) {
        console.error('打开本地文件失败:', err);
      }
    },
    openInNewTab() {
      if (!this.isClient) return;
      
      try {
        window.open(this.originalUrl, '_blank');
      } catch (err) {
        console.error('打开新标签页失败:', err);
      }
    },
    onIframeLoad() {
      if (this.isClient) {
        console.log('Reference content loaded');
      }
    }
  }
}
</script>

<style scoped>
.reference-viewer {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  margin: 1rem 0;
  background: #f6f8fa;
}

.reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #ffffff;
  border-bottom: 1px solid #e1e4e8;
  border-radius: 6px 6px 0 0;
}

.reference-header h3 {
  margin: 0;
  color: #24292e;
  font-size: 1.1rem;
}

.reference-controls {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn, .local-btn, .external-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  background: #ffffff;
  color: #24292e;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.toggle-btn:hover, .local-btn:hover, .external-btn:hover {
  background: #f3f4f6;
  border-color: #b1b7bd;
}

.toggle-btn:active, .local-btn:active, .external-btn:active {
  background: #e1e4e8;
}

/* 为本地文件按钮添加特殊样式 */
.local-btn {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.local-btn:hover {
  background: #218838;
  border-color: #1e7e34;
}

.reference-content {
  padding: 1rem;
}

.content-wrapper {
  position: relative;
  min-height: 400px;
}

.reference-iframe {
  width: 100%;
  height: 600px;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  background: #ffffff;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #586069;
  font-style: italic;
}

@media (max-width: 768px) {
  .reference-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .reference-controls {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .toggle-btn, .local-btn, .external-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .reference-iframe {
    height: 400px;
  }
}
</style>
