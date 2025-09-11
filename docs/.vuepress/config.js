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
          text: '🏠 快速开始',
          icon: 'home',
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
          icon: 'home',
        },
        {
          text: '🌐 网络应用',
          icon: 'network',
          children: [
            {
              text: 'Firefox 浏览器',
              link: '/apps/firefox.md',
            },
          ],
        },
        {
          text: '⌨️ 输入法',
          icon: 'keyboard',
          children: [
            {
              text: '搜狗输入法',
              link: '/apps/sogou_input.md',
            },
          ],
        },
        {
          text: '💻 开发环境',
          icon: 'code',
          children: [
            {
              text: 'IDE 开发环境',
              link: '/apps/ide.md',
            },
            {
              text: 'CUDA 环境配置',
              link: '/apps/cuda.md',
            },
          ],
        },
        {
          text: '🖥️ 虚拟化',
          icon: 'desktop',
          children: [
            {
              text: '虚拟机管理',
              link: '/apps/virtual_machines.md',
            },
          ],
        },
        {
          text: '📱 常用应用速览',
          link: '/apps/quick_apps.md',
          icon: 'app',
        },
      ],
      // 系统结构页面侧边栏
      '/structure/': [
        {
          text: '系统结构总览',
          link: '/structure/README.md',
          icon: 'home',
        },
        {
          text: '📁 目录结构',
          icon: 'folder',
          children: [
            {
              text: '常用目录',
              link: '/structure/common_dir.md',
            },
          ],
        },
        {
          text: '📱 应用分类',
          icon: 'app',
          children: [
            {
              text: '应用分类配置',
              link: '/structure/apps.json',
            },
          ],
        },
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
          icon: 'terminal',
          children: [
            {
              text: '命令索引',
              link: '/utils/common_cmd/index.md',
            },
            {
              text: 'Asterisk 命令',
              link: '/utils/common_cmd/asterisks_cmd.md',
            },
            {
              text: '音频命令',
              link: '/utils/common_cmd/audio_cmd.md',
            },
          ],
        },
        {
          text: '用户配置',
          icon: 'config',
          children: [
            '/utils/user_config/cursor_style.md',
          ],
        },
      ],
    },
    // 导航栏配置
    navbar: [
      { text: '🏠 首页', link: '/', icon: 'home' },
      { text: '📱 应用程序', link: '/apps/', icon: 'app' },
      { text: '⚙️ 系统结构', link: '/structure/', icon: 'structure' },
      { text: '🛠️ 工具', link: '/utils/', icon: 'tool' },
    ],
    // 侧边栏深度
    sidebarDepth: 3,
    // 启用侧边栏分组折叠
    sidebarCollapsible: true,
    // 默认折叠状态
    sidebarCollapsed: false,
  }),
})
