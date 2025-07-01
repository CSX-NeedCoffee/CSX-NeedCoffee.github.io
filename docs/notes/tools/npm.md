---
title: npm手册
outline: deep
createTime: 2025/06/30 21:19:42
permalink: /tools/ru1irjdf/
---

### 1. 配置相关

#### 1.1. 网络代理配置

```bash
# 设置代理
npm config set proxy http://proxy.example.com:8080
npm config set https-proxy http://proxy.example.com:8080

# 删除代理
npm config delete proxy
npm config delete https-proxyee
```

#### 1.2. 仓库镜像配置

```bash
# 设置为淘宝镜像
npm config set registry https://registry.npmmirror.com

# 恢复官方镜像
npm config set registry https://registry.npmjs.org

# 查看当前镜像
npm config get registry
```

#### 1.3. 全局配置

```bash
# 查看所有配置
npm config list

# 设置全局安装路径
npm config set prefix "D:\nodejs\npm_global"

# 设置缓存路径
npm config set cache "D:\nodejs\npm_cache"
```

### 2. 发布包相关

#### 2.1. 发布到私服（Verdaccio）

- 部署 verdaccio

  ```bash
  # 安装 Verdaccio
  npm install -g verdaccio
  # 启动服务（默认端口4873）
  verdaccio
  ```

- 发布包到私服

  ```bash
  # 1. 注册私服
  npm adduser --registry http://localhost:4873

  # 2. 登录私服
  npm login --registry http://localhost:4873

  # 3. 发布包
  npm publish --registry http://localhost:4873

  # 4. 取消发布
  npm unpublish <package> --registry http://localhost:4873
  ```

#### 2.2. 发布到 Git 仓库

- 发布到分支（实时更新）
  1. 将打包之后的代码包上传到发布分支(可编写脚本自动完成)
  2. npm i `git+./<repo>#<branch>`
- 发布到 tag（固定版本）
  1. 使用 git tag 锁定某个提交版本
  2. npm i `git+./<repo>#<tag>`

### 3. npm link

```bash
# 1. 在包目录创建全局link
cd /path/to/your-package
npm link

# 2. 在项目目录使用link包
cd /path/to/your-project
npm link your-package

# 3. 查看本地link的包
npm ls -g --link

# 4. 解除link
npm unlink your-package
```

### 4. monorepo

#### 4.1 初始化项目

```bash
# 1. 全局安装pnpm
npm install -g pnpm

# 2. 初始化项目
mkdir monorepo && cd monorepo
pnpm init

# 3. 创建packages目录
mkdir packages
```

#### 4.2 创建 package

```json title="package.json"
{
  "workspaces": ["packages/*"]
}
```

#### 4.3 模块之间的引用

```json title="package.json"
// packages/pkg-a/package.json
{
  "dependencies": {
    "pkg-b": "workspace:*"
  }
}
```

#### 4.4 常用命令

```bash
# 安装所有依赖
pnpm install

# 为指定包添加依赖
pnpm add lodash --filter package-a

# 运行指定包的dev脚本
pnpm --filter package-a run dev
```

### 5. 工具

#### 5.1 NVM

```bash
# 安装Node版本
nvm install 18.16.0

# 切换版本
nvm use 18.16.0

# 查看已安装版本
nvm list

# 设置默认版本
nvm alias default 18.16.0
```

#### 5.2 NRM

```bash
# 安装
npm install -g nrm

# 查看可用源
nrm ls

# 切换源
nrm use taobao

# 测试源速度
nrm test
```
