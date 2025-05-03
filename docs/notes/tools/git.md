---
title: git
createTime: 2025/05/02 13:29:03
permalink: /tools/zuduacbr/
outline: "deep"
---

### 1. 安装

官网下载：[https://git-scm.com/download](https://git-scm.com/download)

### 2. 工作流程

<ImageCard image="/notes/tools/git-workflow.png" />

### 3. 常用命令

#### 3.1. 全局用户信息

- 设置

  ```bash
  git config --global user.name "your name"
  git config --global user.email "your email"
  ```

- 查看

  ```bash
  git config --global user.name
  git config --global user.email
  ```

#### 3.2. 本地仓库操作

<ImageCard image="/notes/tools/git-example1.png" />

- 初始化仓库

  ```bash
  git init
  ```

- 加入暂存区
  ```bash
  # 所有
  git add .
  # 单个
  git add <file>
  ```
- 查看变更状态
  ```bash
  git status
  ```
- 提交
  ```bash
  git commit -m "commit message"
  ```
- 查看提交记录
  ```bash
  git log --pretty=oneline --all --graph --abbrev-commit
  ```
  - options：
    - all 显示所有分支
    - pretty=oneline 将提交信息显示为一行
    - abbrev-commit 使得输出的 commitId 更简短
    - graph 以图的形式显示
- 版本回退
  ```bash
  git reset --hard CommitID
  ```

#### 3.3. 分支操作

> [!TIP]
>
> 1. 当再 A 分支中创建 B 分支时，会基于 A 分支的最新提交创建一个内容完全相同的新分支 B；
> 2. **_所有分支对本地仓库的暂存区都是一样的_**。例如当你在 B 分支中修改了文件，再切换回 A 分支，那么 A 分支的内容也会被修改，直到你在 B 分支中提交修改（此时暂存区内容为空），A 分支的内容才会还原，除非你将 B 的修改合并到 A。

- 查看本地分支
  ```bash
  git branch
  ```
- 创建本地分支
  ```bash
  git branch 分支名
  # 将当前分支重命名为 main（-M 是 --move --force 的缩写组合）
  git branch -M main
  ```
- 切换分支
  ```bash
  git checkout branchName
  # 强制切换分支（不存在则创建分支）
  git checkout -b branchName
  ```
- 合并分支

  如果将分支 A 合并到分支 B，需要在分支 B 上执行合并操作：

  ```bash
  git checkout B
  git merge A
  ```

- 删除分支
  ```bash
  # 会询问一些信息
  git branch -d 分支名
  # 强制删除分支（不询问）
  git branch -D 分支名
  ```

#### 3.4. 远程仓库操作

- 配置 SSH 公钥
  ```bash
  # 不断回车（如果公钥已经存在，则自动覆盖）
  ssh-keygen -t rsa
  # 查看公钥（git bash/linux）
  cat ~/.ssh/id_rsa.pub
  # 查看公钥（windows cmd）
  type %USERPROFILE%\.ssh\id_rsa.pub
  # 测试是否成功
  ssh -T git@github.com
  ```
- 添加远程仓库
  ```bash
  git remote add <远端名称> <仓库路径>
  ```
  - 远端名称，默认是 origin，取决于远端服务器设置
  - 仓库路径，从远端服务器获取此 URL
  - 例如: git remote add origin git@gitee.com:czbk_zhang_meng/git_test.git
- 查看远程仓库
  ```bash
  git remote
  ```
- 本地仓库推送到远程仓库

  ```bash
  git push [-f] [-u] [远端名称 [本地分支名][:远端分支名] ]
  ```

  - options:
    - -f 强制推送
    - -u (或--set-upstream) 推送到远端的同时并且建立起和远端分支的关联关系
  - 如果远程分支名和本地分支名称相同，则可以只写本地分支
    ```bash
    git push origin master
    ```
  - 如果当前分支已经和远端分支关联，则可以省略分支名和远端名

    ```bash
    git push
    ```

- 删除远程分支
  ```bash
  git push origin -d 分支名
  ```
