# PostgreSQL

## 安装 PostgreSQL 服务器

如果需要完整的 PostgreSQL 服务器：

```bash
sudo apt install postgresql
```

## 仅安装客户端（轻量级选项）

如果你只需要连接到远程 PostgreSQL 服务器，而不需要本地运行数据库服务，可以只安装客户端工具，这样可以大大减少系统负载：

```bash
# 仅安装 PostgreSQL 客户端工具
sudo apt install postgresql-client

# 使用 psql 连接到远程服务器
psql -h <服务器地址> -U <用户名> -d <数据库名>
```

**优势：**
- 体积小：只安装客户端工具，不包含数据库服务器
- 低负载：不会在本地运行数据库服务进程
- 适合场景：只需要查询和管理远程数据库，不需要本地数据库服务

## Change Config Files

The config files are on `/etc/postgresql/<version>/main`,  

`pghba.conf`:  

<CodeViewer 
  title="pghba.conf" 
  filePath="/lib/psql/pghba.conf"
  language="conf"
/>

```bash
sudo systemctl restart postgresql
```

## Set Password

```bash
sudo -u postgres psql
\password postgres  # type the password
```


## GUI 客户端工具

### pgAdmin 性能问题

**注意：** pgAdmin 4 在 Ubuntu 上存在已知的性能问题。许多用户报告：

- **系统卡顿**：使用一段时间后，整个系统和 IDE 会变得卡顿
- **启动缓慢**：展开服务器或数据库树可能需要 30 秒或更长时间
- **资源占用高**：pgAdmin 4 对 CPU、内存和磁盘 I/O 占用较高
- **架构问题**：这是 pgAdmin 4 在 Linux 系统上的固有架构问题

这些问题在高负载情况下尤其明显，可能导致整个系统响应变慢。

### 推荐的替代方案

#### DBeaver（强烈推荐）

DBeaver 是许多开发者和数据库管理员推荐的替代方案：

**优势：**
- ✅ **性能优秀**：在 Linux 系统上具有出色的原生性能，比 pgAdmin 响应更快
- ✅ **多数据库支持**：不仅支持 PostgreSQL，还支持多种数据库系统
- ✅ **功能强大**：包含强大的 SQL 编辑器，语法高亮等高级功能
- ✅ **广泛使用**：被广泛用于 PostgreSQL 工作
- ✅ **不拖慢系统**：不会导致整个系统变慢

**安装：**
```bash
# 添加 DBeaver 仓库并安装
# 具体安装步骤请参考 DBeaver 官方文档
```

#### 其他可选方案

- **DataGrip**（JetBrains 产品）- 在 Linux 上性能优秀
- **TablePlus** - 跨平台性能良好
- **Navicat Premium** - 跨平台性能良好
- **Beekeeper Studio** - 现代、轻量级的 SQL 客户端

### 无客户端安装的 Web 方案

如果你想让其他人访问 PostgreSQL 服务器，但不想让他们安装任何客户端软件，可以考虑以下 Web 方案：

**1. pgAdmin Web 部署**
- 将 pgAdmin 部署为 Web 应用
- 用户通过浏览器访问，无需安装任何软件

**2. TeamPostgreSQL**
- 专为通过内网或互联网访问 PostgreSQL 设计的 Web 应用
- 提供基于浏览器的访问

**3. PostgREST API + Web 界面**
- 通过 REST API 暴露 PostgreSQL 数据库
- 创建简单的 Web 界面连接

**4. PGlite（前沿选项）**
- 使用 WebAssembly 在浏览器中直接运行 PostgreSQL
- 无需服务器端设置或客户端安装

这些 Web 方案的优势：
- 用户无需安装任何软件
- 更好的权限控制
- 可以在服务器级别配置只读访问
- 通过 Web 界面管理用户认证

## Further Dev

For further allowing accessing remotely and easily, we can do more:  

<CodeViewer 
  title="AI chat for modifying config" 
  filePath="/lib/psql/chat-PostgreSQL Network Access Setup.txt"
  language="conf"
/>
