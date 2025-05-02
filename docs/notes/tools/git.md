---
title: git
createTime: 2025/05/02 13:29:03
permalink: /tools/zuduacbr/
---

### 1. 安装

官网下载：[https://git-scm.com/download](https://git-scm.com/download)

### 2. 工作流程

<ImageCard image="/notes/tools/git-workflow.png" />

### 3. 常用命令

#### 1. 全局用户信息

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

#### 2. 本地仓库操作

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
