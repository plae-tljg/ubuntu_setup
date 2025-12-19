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
        {text: '快速开始',children: ['README.md',],
        },
      ],
      // 应用程序页面侧边栏
      '/apps/': [
        {
          text: '应用程序总览',
          link: '/apps/README.md',
        },
        {
          text: '通用应用',
          children: [
            {text: 'Firefox 浏览器', link: '/apps/common/firefox.md'},
            {text: '常用应用速览', link: '/apps/common/quick_apps.md'},
            {text: 'IDE 开发环境', link: '/apps/common/ide.md'},
            {text: '虚拟机管理', 
              children: [
                {text: 'VirtualBox', link: '/apps/common/vm/virtual_machines.md'},
                {text: 'KVM/QEMU', link: '/apps/common/vm/kvm_qemu.md'},
              ],
            },
          ],
        },
        {
          text: '数据库',
          children: [
            {text: 'PostgreSQL', link: '/apps/db/psql.md'},
          ],
        },
        {
          text: 'GPU 配置',
          children: [
            {text: 'CUDA 环境配置', link: '/apps/gpu/cuda.md'},
            {text: '旧版 iGPU 问题记录', link: '/apps/gpu/old_igpu_problems.md'},
          ],
        },
        {
          text: '旧/不再使用',
          children: [
            {text: '搜狗输入法', link: '/apps/common/old/sogou_input.md'},
          ],
        }
      ],
      // 工具页面侧边栏
      '/utils/': [
        {text: '工具总览', link: '/utils/README.md'},
        {text: '实用链接', link: '/utils/useful_links.md'},
        {text: 'structure', children: [
          {text: '结构总览', link: '/utils/structure/README.md'},
          {text: '常用目录', link: '/utils/structure/common_dir.md'},
        ]},
        {text: '常用命令',
          children: [
            '/utils/common_cmd/README.md',
            '/utils/common_cmd/asterisks_cmd.md',
            '/utils/common_cmd/audio_cmd.md',
            '/utils/common_cmd/reboot_router.md',
            '/utils/common_cmd/send_email.md',
          ],
        },
        {
          text: '用户配置',
          children: [
            '/utils/user_config/cursor_style.md',
            '/utils/user_config/code_highlight.md',
          ],
        },
        {
          text: '有趣命令',
          children: [
            '/utils/interesting_cmd/README.md',
            '/utils/interesting_cmd/hidden_img.md',
          ],
        },
      ],
      // 开发相关页面侧边栏
      '/dev/': [
        {text: '开发相关总览', link: '/dev/README.md'},
        {text: 'Headless 模式', link: '/dev/headless.md'},
        {text: 'HTTPS 配置', link: '/dev/https.md'},
        {text: 'SSH 命令', link: '/dev/ssh.md'},
        {text: 'Web 开发', children: [
          {text: 'HTML Outlook', link: '/dev/web_dev/html.md'},
        ]},
        {text: 'Git 操作', children: [
          {text: 'Git Breaking Change', link: '/dev/git/breaking_change.md'},
          {text: 'Github Pages', link: '/dev/git/github_pages.md'},
        ]},
        {text: '网络配置', children: [
          {text: '静态 IP 配置', link: '/dev/internet/static_ip.md'}, 
          {text: 'Wi-Fi 重连', link: '/dev/internet/wifi_reconnect.md'},
        ]},
      ],
    },
    // 导航栏配置
    navbar: [
      { text: '首页', link: '/' },
      { text: '应用程序', link: '/apps/' },
      { text: '工具', link: '/utils/' },
      { text: '开发相关', link: '/dev/' },
    ],
    // 侧边栏深度
    sidebarDepth: 3,
    // 启用侧边栏分组折叠
    sidebarCollapsible: true,
    // 默认折叠状态
    sidebarCollapsed: false,
  }),
})
