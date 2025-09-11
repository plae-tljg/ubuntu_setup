import { viteBundler } from '@vuepress/bundler-vite'
import { hopeTheme } from 'vuepress-theme-hope'
import { defineUserConfig } from 'vuepress'
import { path } from '@vuepress/utils'

export default defineUserConfig({
  // 设置基础路径为仓库名
  base: '/ubuntu_setup/',
  bundler: viteBundler(),
  alias: {
    '@': path.resolve(__dirname, '../'),
  },
  clientConfigFile: path.resolve(__dirname, 'client.js'),
  theme: hopeTheme({
    // 侧边栏配置
    sidebar: {
      // 首页侧边栏
      '/': [
        {
          text: '快速开始',
          children: [
            'README.md',
          ],
        },
      ],
      // 应用程序页面侧边栏
      '/apps/': [
        {
          text: '应用程序总览',
          link: '/apps/README.md',
        },
        {
          text: 'Firefox 浏览器',
          link: '/apps/firefox.md',
        },
        {
          text: '搜狗输入法',
          link: '/apps/sogou_input.md',
        },
        {
          text: '常用应用速览',
          link: '/apps/quick_apps.md',
        },
        {
          text: 'IDE 开发环境',
          link: '/apps/ide.md',
        },
        {
          text: 'CUDA 环境配置',
          link: '/apps/cuda.md',
        },
        {
          text: '虚拟机管理',
          link: '/apps/virtual_machines.md',
        },
      ],
      // 系统结构页面侧边栏
      '/structure/': [
        {
          text: '系统结构总览',
          link: '/structure/README.md',
        },
        {
          text: '常用目录',
          link: '/structure/common_dir.md',
        }
      ],
      // 工具页面侧边栏
      '/utils/': [
        {
          text: '工具总览',
          link: '/utils/README.md',
        },
        {
          text: '实用链接',
          link: '/utils/useful_links.md',
        },
        {
          text: '常用命令',
          children: [
            '/utils/common_cmd/README.md',
            '/utils/common_cmd/asterisks_cmd.md',
            '/utils/common_cmd/audio_cmd.md',
          ],
        },
        {
          text: '用户配置',
          children: [
            '/utils/user_config/cursor_style.md',
          ],
        },
      ],
    },
    // 导航栏配置
    navbar: [
      { text: '首页', link: '/' },
      { text: '应用程序', link: '/apps/' },
      { text: '系统结构', link: '/structure/' },
      { text: '工具', link: '/utils/' },
    ],
    // 侧边栏深度
    sidebarDepth: 3,
    // 启用侧边栏分组折叠
    sidebarCollapsible: true,
    // 默认折叠状态
    sidebarCollapsed: false,
  }),
})
