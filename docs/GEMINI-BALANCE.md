# Gemini Balance 集成指南

Claude Code Router 现在支持 [Gemini Balance](https://github.com/snailyp/gemini-balance) 代理服务，提供 Gemini API 的负载均衡和增强功能。

## 什么是 Gemini Balance？

Gemini Balance 是一个基于 Python FastAPI 构建的 Gemini API 代理和负载均衡器，提供以下功能：

- 🔄 **多密钥负载均衡**: 支持配置多个 Gemini API 密钥进行自动轮询
- 🌐 **双协议兼容**: 同时支持 Gemini 和 OpenAI 格式的 API
- 🖼️ **图像功能**: 支持图文对话和图像生成
- 🔍 **网络搜索**: 支持网络搜索功能
- 📊 **状态监控**: 提供密钥状态和使用情况的实时监控
- 🛡️ **故障处理**: 自动处理 API 请求失败和重试

## 快速开始

### 1. 自动配置（推荐）

使用 CLI 命令自动添加 Gemini Balance 支持：

```bash
ccr add-gemini-balance
```

这个命令会：
- 自动配置您的 Gemini Balance 服务器
- 测试连接是否正常
- 添加到配置文件中
- 设置为长上下文模型

### 2. 手动配置

在 `~/.claude-code-router/config.json` 中添加 Gemini Balance 提供商：

```json
{
  "Providers": [
    {
      "name": "gemini-balance",
      "api_base_url": "http://84.8.145.89:8000/v1",
      "api_key": "Hjd-961207hjd",
      "models": [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-2.0-flash-exp"
      ],
      "headers": {
        "Authorization": "Bearer Hjd-961207hjd",
        "Content-Type": "application/json"
      }
    }
  ],
  "Router": {
    "longContext": "gemini-balance,gemini-1.5-pro"
  }
}
```

## 使用方法

### 1. 路由配置

在 Router 配置中使用 Gemini Balance：

```json
{
  "Router": {
    "default": "deepseek,deepseek-chat",
    "background": "ollama,qwen2.5-coder:latest",
    "think": "deepseek,deepseek-reasoner", 
    "longContext": "gemini-balance,gemini-1.5-pro"
  }
}
```

### 2. 动态模型切换

在 Claude Code 中使用 `/model` 命令切换到 Gemini Balance：

```
/model gemini-balance,gemini-2.0-flash-exp
```

### 3. 特殊功能模型

Gemini Balance 支持特殊功能的模型名称：

- `gemini-1.5-flash-search` - 支持网络搜索
- `gemini-2.0-flash-exp-image` - 支持图像生成和处理

## 配置选项

### 支持的模型

- `gemini-1.5-flash` - 快速响应模型
- `gemini-1.5-pro` - 专业版模型，适合复杂任务
- `gemini-2.0-flash-exp` - 实验版本，最新功能

### 推荐配置

根据不同场景的推荐配置：

1. **长上下文处理**: 使用 `gemini-1.5-pro`
2. **快速响应**: 使用 `gemini-1.5-flash`  
3. **实验功能**: 使用 `gemini-2.0-flash-exp`

## 故障排除

### 连接问题

如果遇到连接问题，请检查：

1. **网络连接**: 确保可以访问 `http://84.8.145.89:8000`
2. **访问令牌**: 确认访问密码 `Hjd-961207hjd` 正确
3. **防火墙**: 检查防火墙是否阻止了连接

### 测试连接

使用以下命令测试连接：

```bash
curl -H "Authorization: Bearer Hjd-961207hjd" \
     -H "Content-Type: application/json" \
     http://84.8.145.89:8000/v1/models
```

### 日志调试

启用日志来调试问题：

```json
{
  "log": true
}
```

日志文件位置: `~/.claude-code-router/claude-code-router.log`

## 优势

使用 Gemini Balance 的优势：

1. **成本效益**: 通过负载均衡优化 API 使用
2. **高可用性**: 多密钥轮询提高服务可用性
3. **增强功能**: 支持图像处理和网络搜索
4. **监控能力**: 实时监控密钥状态和使用情况
5. **OpenAI 兼容**: 无缝集成到现有工作流程

## 集成状态

### ✅ 已实现功能
- 自动配置和连接测试
- 直接模型调用 (`gemini-balance,model-name`)
- API格式转换 (OpenAI → Claude)
- 多模型支持和负载均衡
- 配置文件管理

### 🎯 推荐使用方式
1. **直接指定模型**（推荐）:
   ```
   /model gemini-balance,gemini-1.5-pro
   ```

2. **在配置中设置**:
   ```json
   {
     "Router": {
       "longContext": "gemini-balance,gemini-1.5-pro"
     }
   }
   ```

### ⚠️ 注意事项
- Gemini Balance 服务需要保持运行状态
- 访问令牌请妥善保管，不要泄露
- 建议使用直接模型指定方式获得最佳体验
- 长上下文自动路由可能存在兼容性问题
- 遵守 Gemini API 的使用条款和限制

## 更多信息

- [Gemini Balance GitHub](https://github.com/snailyp/gemini-balance)
- [Gemini Balance 文档](https://gb-docs.snaily.top)
- [Claude Code Router 项目](https://github.com/tonyhu2006/claude-code-router)
