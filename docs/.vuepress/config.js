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
            {text: '应用总览', link: '/apps/common/README.md'},
            {text: 'Firefox 浏览器', link: '/apps/common/firefox.md'},
            {text: '浏览器', link: '/apps/common/browsers.md'},
            {text: '编辑器与 IDE', link: '/apps/common/editors.md'},
            {text: 'IDE 开发环境', link: '/apps/common/ide.md'},
            {text: '图像编辑', link: '/apps/common/image_editors.md'},
            {text: '音频工具', link: '/apps/common/audio.md'},
            {text: '网络工具', link: '/apps/common/network.md'},
            {text: '数据库工具', link: '/apps/common/database.md'},
            {text: '系统工具', link: '/apps/common/system.md'},
            {text: '开发工具', link: '/apps/common/dev_tools.md'},
            {text: '办公软件', link: '/apps/common/office.md'},
            {text: '多媒体', link: '/apps/common/multimedia.md'},
            {text: '游戏', link: '/apps/common/games.md'},
            {text: '用户配置', link: '/apps/common/user_config.md'},
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
            '/utils/common_cmd/bash_tricks.md',
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
        {text: '多 SSD 配置', link: '/dev/multiple_ssds.md'},
        {text: 'HTTPS 配置', link: '/dev/https.md'},
        {text: 'SSH 配置', children: [
          {text: 'SSH 总览', link: '/dev/ssh/README.md'},
          {text: '基础命令', link: '/dev/ssh/basics.md'},
          {text: '认证问题解决', link: '/dev/ssh/authentication.md'},
          {text: 'SFTP 使用', link: '/dev/ssh/sftp.md'},
          {text: 'SSH 跳板和代理', link: '/dev/ssh/proxy_jump.md'},
          {text: 'Android 本地文件访问', link: '/dev/ssh/android_access.md'},
        ]},
        {text: 'Web 开发', children: [
          {text: 'HTML Outlook', link: '/dev/web_dev/html.md'},
        ]},
        {text: 'Git 操作', children: [
          {text: '本地和局域网 Git 服务器', link: '/dev/git/local_git_server.md'},
          {text: 'Git Breaking Change', link: '/dev/git/breaking_change.md'},
          {text: 'Github Pages', link: '/dev/git/github_pages.md'},
        ]},
        {text: '网络配置', children: [
          {text: '静态 IP 配置', link: '/dev/internet/static_ip.md'}, 
          {text: 'Wi-Fi 重连', link: '/dev/internet/wifi_reconnect.md'},
        ]},
        {text: 'Asterisk 电话服务器', children: [
          {text: 'Asterisk 总览', link: '/dev/asterisk/README.md'},
          {text: '基础命令和配置', link: '/dev/asterisk/basics.md'},
          {text: 'Trunk 配置', link: '/dev/asterisk/trunk_config.md'},
          {text: '音频处理', link: '/dev/asterisk/audio.md'},
        ]},
      ],
      // 家居设备页面侧边栏
      '/household/': [
        {text: '家居设备总览', link: '/household/README.md'},
        {text: 'IP Camera 监控', children: [
          {text: '监控总览', link: '/household/ip_cam/ip_cam.md'},
          {text: "旧方案记录", children: [
            {text: 'IP Camera 监控总览', link: '/household/ip_cam/old/camera_monitoring.md'},
            {text: '配置指南', link: '/household/ip_cam/old/ip_cam_install.md'},
          ]},
        ]},
      ],
    },
    // 导航栏配置
    navbar: [
      { text: '首页', link: '/' },
      { text: '应用程序', link: '/apps/' },
      { text: '工具', link: '/utils/' },
      { text: '家居', link: '/household/' },
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
