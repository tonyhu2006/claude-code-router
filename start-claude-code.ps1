# Claude Code Router 启动脚本
Write-Host "🚀 启动 Claude Code Router..." -ForegroundColor Green

# 检查服务是否运行
$status = & node dist/cli.js status 2>$null
if ($LASTEXITCODE -ne 0 -or $status -match "Not Running") {
    Write-Host "📡 启动 Claude Code Router 服务..." -ForegroundColor Yellow
    & node dist/cli.js start
    Start-Sleep -Seconds 3
}

# 设置环境变量
Write-Host "🔧 配置环境变量..." -ForegroundColor Yellow
$env:ANTHROPIC_API_URL = "http://127.0.0.1:3456"
$env:ANTHROPIC_API_KEY = "test"

Write-Host "✅ 环境变量已设置:" -ForegroundColor Green
Write-Host "   ANTHROPIC_API_URL = $env:ANTHROPIC_API_URL" -ForegroundColor Cyan
Write-Host "   ANTHROPIC_API_KEY = $env:ANTHROPIC_API_KEY" -ForegroundColor Cyan

# 启动 Claude Code
Write-Host "🎯 启动 Claude Code..." -ForegroundColor Green
Write-Host "💡 现在您可以在 Claude Code 中使用 Gemini Balance!" -ForegroundColor Magenta
Write-Host "   - 默认使用: gemini-2.5-flash" -ForegroundColor Cyan
Write-Host "   - 手动切换: /model gemini-balance,gemini-2.5-pro" -ForegroundColor Cyan

& node dist/cli.js code
