# Git Breaking Change 操作大破坏重写仓库（AI 推荐的可行步骤）

有时候你想对一个 Git 仓库彻底重写（breaking change），比如把完全新的一套代码替换进来，旧的内容全部不要。这时可以参考如下步骤：  

## 操作步骤

1. **备份当前主分支所有代码（可选）**
   ```bash
   git checkout -b legacy-code-backup
   git push origin legacy-code-backup
   ```

2. **切换回主分支并删除所有旧代码**
   ```bash
   git checkout main
   git rm -r .       # 删除所有被 git 跟踪的文件
   git commit -m "BREAKING CHANGE: 完全重写，移除旧代码"
   ```

3. **复制新代码到项目目录，然后提交**
   - 将你新写的代码复制进项目文件夹

   ```bash
   git add .
   git commit -m "Complete rewrite: 新代码库实现"
   git push origin main
   ```

这样，主分支会只保留最新的代码，旧内容会被彻底替换。  

> 小提示：操作前确保大家达成一致，且旧内容有分支备份防止误删。  
