# 建议的开发命令

## 项目构建
```bash
# 构建项目
npm run build

# 安装依赖
npm install
# 或使用 pnpm
pnpm install
```

## 服务管理
```bash
# 启动服务
ccr start
# 或
node dist/cli.js start

# 停止服务
ccr stop

# 查看服务状态
ccr status

# 启动 Claude Code
ccr code
```

## 开发和测试
```bash
# 运行测试脚本
node test-gemini-balance.js
node test-claude-code-stream.js
node final-integration-test.js

# 监控请求
node monitor-requests.js

# 测试特定功能
node test-model-routing.js
node test-streaming-issue.js
```

## Windows 系统命令
```powershell
# 启动 Claude Code (PowerShell 脚本)
.\start-claude-code.ps1

# 测试 Gemini 直连
.\test-direct-gemini.ps1

# 查看进程
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# 查看端口占用
netstat -ano | findstr :3456

# 终止进程
taskkill /PID <进程ID> /F
```

## 配置管理
```bash
# 配置文件位置
~/.claude-code-router/config.json

# 日志文件位置
~/.claude-code-router/claude-code-router.log

# 复制示例配置
cp config-gemini-balance-example.json ~/.claude-code-router/config.json
```

## Docker 相关
```bash
# 构建 Docker 镜像
docker build -t claude-code-router .

# 运行 Docker 容器
docker-compose up -d

# 查看容器日志
docker-compose logs -f
```

## Git 操作
```bash
# 查看状态
git status

# 提交更改
git add .
git commit -m "描述更改"

# 推送到远程
git push origin main

# 查看分支
git branch -a

# 切换分支
git checkout <分支名>
```