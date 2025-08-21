import { defineClientConfig } from 'vuepress/client'
import ReferenceViewer from './components/ReferenceViewer.vue'
import CodeViewer from './components/CodeViewer.vue'

export default defineClientConfig({
  enhance({ app }) {
    // 暂时注释掉有问题的组件
    app.component('ReferenceViewer', ReferenceViewer)
    app.component('CodeViewer', CodeViewer)
    // app.component('ClientOnly', ClientOnly)
  },
  setup() {
    // 确保组件只在客户端渲染
    if (typeof window !== 'undefined') {
      // 客户端代码
    }
  }
})
