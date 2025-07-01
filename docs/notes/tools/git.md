---
title: git手册
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

- 创建无历史记录的分支（孤立分支）

  ```bash
  git checkout --orphan 分支名
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

- 创建新分支并同步到远程仓库

  ```bash
  # 1. 创建并切换到新分支
  git checkout -b 新分支名

  # 2. 推送新分支到远程仓库（自动关联）
  git push -u origin 新分支名
  ```

#### 3.5. Tag 标签操作

Git Tag（标签）用于标记特定的提交（如版本发布），主要有以下作用：

- 重要节点：标记项目里程碑或稳定版本;
- 快速回滚：通过标签直接切换到指定版本代码;
- 如果 node 包通过 git 发布，则可用于标记包版本。（如 esign-ui-vue）

有以下标签分类：

- 轻量标签（Lightweight）：仅是一个指向特定提交的引用；
- 附注标签（Annotated）：包含完整的标签信息（作者、日期、说明等），推荐使用。

##### 3.5.1. 创建标签

```bash
#创建轻量标签：
git tag 标签名
#创建附注标签（推荐）：
git tag -a 标签名 -m "标签说明"
#对历史提交打标签：
git tag -a 标签名 CommitID -m "标签说明"
```

##### 3.5.2. 查看标签

```bash
# 查看所有标签
git tag
#查看标签详情：
git show 标签名
```

##### 3.5.3. 推送标签到远程仓库

```bash
#推送单个标签：
git push origin 标签名
#推送所有未同步的标签：
git push origin --tags
```

##### 3.5.4. 删除标签

```bash
#删除本地标签：
git tag -d 标签名
#删除远程标签：
git push origin :refs/tags/标签名
```

##### 3.5.5. 检出标签

切换到标签对应的代码状态（此时为只读状态，需创建新分支才能修改）：

```bash
git checkout 标签名
```

若需修改，建议基于标签创建分支：

```bash
git checkout -b 新分支名 标签名
```

### 4. [GitHub Actions](https://docs.github.com/zh/actions)

#### 4.1. 简介

GitHub Actions 是 GitHub 提供的**自动化工作流工具**，其内部提供了一个临时虚拟机，可通过编写 YAML 文件定义任务，由临时虚拟机执行，以实现代码构建、测试、部署等流程的自动化（CI/CD）。

- **优势**：免费（公开仓库）、支持多系统（Linux/Windows/macOS）、海量社区插件（Actions）。

#### 4.2. 使用步骤

1. **创建工作流文件**：

   - 在仓库中创建 `.github/workflows/` 目录
   - 新建 YAML 文件（如 `ci.yml`）

2. **基础工作流示例**：

```yaml
# 更多配置及其详解请查阅官方文档
name: CI Pipeline
on: [push, pull_request] # 触发条件

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4 # 拉取代码

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm install && npm run build # 执行命令
```

### 5. [GitHub Pages](https://docs.github.com/zh/pages)

#### 5.1. 简介

GitHub Pages 是 GitHub 的**静态网站托管服务**，自动将指定分支（如 `gh-pages`）或目录中的 HTML/CSS/JS 文件发布为网站。

- **特点**：免费、支持自定义域名、自带 HTTPS、适合博客/文档/项目主页；
- **限制**：仅支持静态内容（无后端），构建需依赖 Jekyll 或外部工具（如 VuePress）。

#### 5.2. 部署步骤

##### 5.2.1. 分支部署

- 原理：将构建产物部署到某个分支中（一般是 gh-pages 分支），供 GitHub Pages 托管。
- 步骤：
  1. 将构建后的资源上传到 gh-pages 分支中；
     - 手动部署：自己将构建后的资源上传到 gh-pages 分支中；选择对应的部署目录；
     - **_结合 actions 部署（推荐）：利用 actions 提供的虚拟机，通过在 `.github/workflows/deploy.yml` 中编写 CI 步骤：自动生成构建产物，并将其发布到 gh-pages 分支中_**；
  2. 在 setting > pages 中配置 gh-pages 分支，并指定分支部署路径为对应的目录（根目录或 docs）。

##### 5.2.2. GitHub Actions 部署 (还未实践，待实践后再补充)
