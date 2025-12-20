# Bash 技巧

## 增强终端 Tab 补全

Ubuntu 终端默认的 Tab 补全会显示公共前缀后停止，不像其他终端（如 PuTTY、Arch Linux）可以循环选择。解决方法：

### 基础配置

在 `~/.bashrc` 中添加：

```bash
bind '"\t":menu-complete'
```

启用后，按 Tab 键会循环选择所有匹配项，而不是只显示公共前缀。

### 显示所有匹配项

如果想在循环前先显示所有可能的匹配项列表，可以添加：

```bash
bind "set show-all-if-ambiguous on"
```

这样当有多个匹配时，会先显示所有可能的补全列表，然后可以通过 Tab 键循环选择。

### 应用配置

添加后需要：
1. 运行 `source ~/.bashrc` 立即生效，或
2. 重新登录

## 模块化环境变量管理

将 `.bashrc` 拆分为多个模块文件，便于管理：

<CodeViewer 
  title="环境变量文件示例" 
  filePath="/lib/bash/bash_env_vars_example.sh"
  language="bash"
/>

在 `~/.bashrc` 中加载：

<CodeViewer 
  title=".bashrc 加载示例" 
  filePath="/lib/bash/bashrc_loading_example.sh"
  language="bash"
/>

## Python 模块补全

为 `python -m` 提供 Tab 补全功能：

<CodeViewer 
  title="Python 模块补全脚本" 
  filePath="/lib/bash/python_module_completion.sh"
  language="bash"
/>

在 `~/.bashrc` 中加载：
```bash
if [ -f ~/.python_module_completion.sh ]; then
    source ~/.python_module_completion.sh
fi
```

## Source 和点命令的区别

- `source script.sh` 和 `. script.sh`：在当前 shell 执行，环境变量会生效
- `./script.sh`：在子 shell 执行，环境变量不会影响当前 shell

**关键区别**：
- `. script.sh` - 点后面有**空格**，是命令
- `./script.sh` - 点后面是**斜杠**，是路径

**典型用途**：
- 激活虚拟环境：`source venv/bin/activate` 或 `. venv/bin/activate`
- 加载配置：`source ~/.bash_env_vars`
- 执行独立脚本：`./backup.sh`（不影响当前环境）

