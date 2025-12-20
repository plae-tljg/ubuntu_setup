# Git 本地和局域网服务器使用

Git 是一个分布式版本控制系统，**不依赖于 GitHub、GitLab 等平台**。你可以在本地机器、局域网内的服务器，或任何支持 Git 的服务器上使用 Git。

## 核心概念

Git 支持多种协议和方式：
- **本地路径** (`/path/to/repo`)
- **SSH** (`ssh://user@host/path` 或 `user@host:path`)
- **HTTP/HTTPS** (`https://server/path`)
- **Git 协议** (`git://server/path`)

### Bare Repository vs 普通 Repository

**重要说明：** Git 仓库有两种类型：

1. **Bare Repository（裸仓库）**：没有工作目录，只包含 Git 历史记录，通常用于服务器端
2. **普通 Repository（工作仓库）**：有工作目录，包含你的项目文件

**关键点：** 两种类型的仓库都可以被克隆！你不需要创建 bare repository 才能作为服务器使用。一个普通的 Git 仓库（有工作目录的）也可以被其他机器克隆。

## 测试用例 1：本地 Git 服务器

这个测试用例展示如何：
1. 创建本地 Git 服务器仓库
2. 从本地服务器克隆
3. 进行修改
4. 推送回本地服务器

### 步骤 1：设置本地 Git 服务器仓库

```bash
# 创建 Git 服务器仓库目录
mkdir -p ~/git-server
cd ~/git-server

# 创建裸仓库（bare repository，服务器端仓库）
git init --bare myproject.git
```

### 步骤 2：克隆仓库（就像从 GitHub 克隆一样）

```bash
# 进入工作目录
cd ~/

# 从本地"服务器"克隆
git clone ~/git-server/myproject.git myproject-local
cd myproject-local
```

### 步骤 3：进行修改并提交

```bash
# 创建测试文件
echo "Hello from my local Git server!" > README.md
echo "This proves Git works without GitHub" >> README.md

# 添加并提交更改
git add README.md
git commit -m "Initial commit: Add README with test message"
```

### 步骤 4：推送更改回本地服务器

```bash
# 推送到本地 Git 服务器仓库
git push origin master  # 或 'main'，取决于默认分支
```

### 步骤 5：验证 - 再次从本地服务器克隆

```bash
# 创建另一个克隆以验证推送成功
cd ~/
git clone ~/git-server/myproject.git myproject-verify
cd myproject-verify

# 检查内容
cat README.md
```

**预期输出：**
```
Hello from my local Git server!
This proves Git works without GitHub
```

## 测试用例 1.5：从普通 Git 仓库克隆（非 Bare Repository）

这个测试用例展示：**你不需要 bare repository，普通的 Git 仓库也可以被克隆！**

### 步骤 1：创建一个普通的 Git 仓库（有工作目录）

```bash
# 在机器 A 上创建一个普通项目
cd ~/
mkdir myproject
cd myproject

# 初始化普通 Git 仓库（不是 bare）
git init

# 创建一些文件
echo "Hello from regular Git repo!" > README.md
echo "This is a working directory" >> README.md

# 提交
git add README.md
git commit -m "Initial commit"
```

### 步骤 2：从其他机器克隆这个普通仓库

**在机器 B 上（或同一机器的不同位置）：**

```bash
# 方法 1：如果通过 SSH 访问
git clone user@machine-a:~/myproject

# 方法 2：如果通过共享文件夹访问
git clone /path/to/shared/myproject

# 方法 3：如果通过本地路径访问（同一机器）
git clone ~/myproject myproject-clone
```

### 步骤 3：验证克隆成功

```bash
cd myproject-clone  # 或 myproject（取决于你使用的命令）
cat README.md
```

**预期输出：**
```
Hello from regular Git repo!
This is a working directory
```

### 步骤 4：修改并推送回原仓库

```bash
# 在克隆的仓库中修改
echo "Modified from clone" > newfile.txt
git add newfile.txt
git commit -m "Add file from clone"
git push origin master  # 或 main
```

### Bare vs 普通仓库的区别

| 特性 | Bare Repository | 普通 Repository |
|------|----------------|----------------|
| 工作目录 | ❌ 没有 | ✅ 有 |
| 可直接编辑文件 | ❌ 不能 | ✅ 可以 |
| 可被克隆 | ✅ 可以 | ✅ 可以 |
| 适合作为服务器 | ✅ 推荐 | ✅ 也可以 |
| 使用场景 | 专门的 Git 服务器 | 开发中的项目 |

**什么时候用哪种？**

- **Bare Repository**：当你想要一个专门的"服务器"仓库，不打算直接在其中工作
- **普通 Repository**：当你已经在某个项目上工作，想让它也能被其他人克隆

**重要提示：** 两种方式都可以工作！选择哪种取决于你的使用场景。

## 测试用例 2：局域网内 VM 之间的 Git 使用

### 步骤 1：在 VM 上设置 Git 仓库（192.168.8.108）

**在 VM 上，有两种方式：**

**方式 A：创建 Bare Repository（推荐用于专门的服务器）**
```bash
# 创建 Git 仓库目录
mkdir -p ~/git-repos
cd ~/git-repos

# 创建裸仓库
git init --bare finance_web_app.git

# 应该看到类似输出：
# Initialized empty Git repository in /home/lkm/git-repos/finance_web_app.git/
```

**方式 B：使用普通 Git 仓库（如果你已经在项目上工作）**
```bash
# 如果你已经有一个项目目录
cd ~/Pictures/finance_web_app  # 或你的项目目录

# 如果还没有初始化为 Git 仓库
git init

# 如果已经是 Git 仓库，直接使用即可
# 这个普通仓库也可以被克隆！
```

### 步骤 2：验证仓库在 VM 上存在

```bash
# 在 VM 上：
ls -la ~/git-repos/finance_web_app.git
# 应该显示 Git 仓库文件，如 HEAD, config, objects/, refs/ 等
```

### 步骤 3：从本地机器克隆（使用正确的 SSH 语法）

**在你的本地机器上：**

**如果使用 Bare Repository（方式 A）：**
```bash
# 方法 1：标准 SSH 语法（推荐）
git clone lkm@192.168.8.108:git-repos/finance_web_app.git

# 方法 2：完整 SSH URL 语法
git clone ssh://lkm@192.168.8.108/home/lkm/git-repos/finance_web_app.git

# 方法 3：克隆到指定目录名
git clone lkm@192.168.8.108:git-repos/finance_web_app.git my-finance-web-app
```

**如果使用普通 Repository（方式 B）：**
```bash
# 克隆普通仓库（注意路径，不需要 .git 后缀）
git clone lkm@192.168.8.108:Pictures/finance_web_app

# 或使用完整路径
git clone ssh://lkm@192.168.8.108/home/lkm/Pictures/finance_web_app

# 克隆到指定目录名
git clone lkm@192.168.8.108:Pictures/finance_web_app my-finance-web-app
```

**重要提示：**
- Bare repository 通常以 `.git` 结尾，克隆时需要包含 `.git`
- 普通 repository 是项目目录名，克隆时不需要 `.git` 后缀
- 两种方式都可以正常工作！

### 步骤 4：完整工作流程测试

```bash
# 克隆成功后：
cd finance_web_app  # 或你的克隆目录名

# 创建测试文件
echo "This is a test file from local machine" > test.txt
echo "Current date: $(date)" >> test.txt

# 提交并推回 VM
git add test.txt
git commit -m "Add test file from local machine"
git push origin master  # 或 'main'，取决于默认分支
```

### 步骤 5：在 VM 上验证

```bash
# 在 VM 上：
cd ~/git-repos/finance_web_app.git
# 检查提交是否到达：
git log --oneline -1
# 应该显示你最近的提交
```

## 常见问题排查

### 1. 如果提示"repository does not exist"

```bash
# 检查 VM 上的确切路径：
ssh lkm@192.168.8.108 "ls -la ~/git-repos"

# 确保使用正确的路径格式：
# 错误：lkm@192.168.8.108/Pictures/finance_web_app
# 正确：lkm@192.168.8.108:git-repos/finance_web_app.git
```

**重要提示：**
- SSH 格式使用冒号 `:` 而不是斜杠 `/` 来分隔主机和路径
- 路径是相对于用户主目录的，除非使用 `ssh://` 协议指定绝对路径
- Git 仓库通常以 `.git` 结尾（裸仓库的约定）

### 2. 如果遇到 SSH 权限被拒绝

```bash
# 设置 SSH 密钥（可选但推荐）：
ssh-keygen -t rsa -b 4096  # 在本地机器上
ssh-copy-id lkm@192.168.8.108  # 将公钥复制到 VM
```

### 3. 关于 Bare Repository vs 普通 Repository

**重要澄清：** 你**不需要** bare repository 才能被克隆！普通 Git 仓库也可以被克隆。

```bash
# 如果你有一个普通 Git 仓库，直接克隆即可：
git clone lkm@192.168.8.108:Pictures/finance_web_app

# 不需要转换为 bare repository
```

**什么时候用 Bare Repository？**
- 当你想要一个专门的"服务器"仓库，不打算直接在其中编辑文件
- 当你想要更清晰的服务器/客户端分离

**什么时候用普通 Repository？**
- 当你已经在某个项目上工作，想让它也能被其他人克隆
- 当你想要在服务器端也能直接编辑文件

**两种方式都可以工作！** 选择哪种取决于你的使用场景。

### 4. 检查网络连接

```bash
# 在本地机器上：
ping 192.168.8.108
ssh lkm@192.168.8.108 "echo 'SSH connection works'"
```

## 其他使用方式

### 方法 A：使用共享网络文件夹（如果 VM 共享文件夹）

```bash
# 首先，确保 VM 共享了文件夹，然后：
git clone /path/to/shared/folder/git-repos/finance_web_app.git
```

### 方法 B：在 VM 上设置 HTTP 服务器（用于测试）

```bash
# 在 VM 上：
cd ~/git-repos/finance_web_app.git
git update-server-info
# 然后临时提供 HTTP 服务：
python3 -m http.server 8000 --directory .

# 在本地机器上：
git clone http://192.168.8.108:8000

## 关键要点

1. **不需要 GitHub**：Git 完全独立于 GitHub、GitLab、Bitbucket 等平台工作

2. **任何协议都可以**：Git 支持多种协议（本地、SSH、HTTP/HTTPS、Git 协议）

3. **完整工作流程**：你可以在任何 Git 服务器上执行完整的 Git 工作流程（clone、commit、push、pull）

4. **自托管选项**：你可以在以下位置托管自己的 Git 服务器：
   - 本地机器（如上面的示例）
   - 家庭服务器
   - VPS（如 DigitalOcean、Linode 等）
   - 公司内部服务器

## 实际应用场景

### 自托管 Git 解决方案示例：

- **GitLab CE/EE**：在自己的服务器上运行完整的 GitLab 实例
- **Gitea**：轻量级自托管 Git 服务
- **Gogs**：另一个轻量级选项
- **裸 Git 仓库**：如上面的示例，手动管理
- **企业解决方案**：GitHub Enterprise、GitLab Enterprise、Bitbucket Server

## 总结

Git 的核心功能完全独立于任何特定的托管平台。GitHub 只是你可以与 Git 一起使用的众多可能的远程仓库之一！

通过上述测试用例，你可以证明 Git 可以在本地、局域网或任何支持 Git 的服务器上正常工作，无需依赖任何第三方 Git 托管服务。

