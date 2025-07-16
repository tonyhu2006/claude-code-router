# Gemini Balance 集成部署指南

## 🎯 修复完成状态

✅ **问题已解决**: Gemini API 不支持 `additionalProperties` 和 `$schema` 字段的问题已修复  
✅ **测试通过**: Schema 清理功能正常工作  
✅ **构建成功**: 项目可以正常构建和部署  

## 🚀 快速部署步骤

### 1. 构建项目

```bash
npm install
npm run build
```

### 2. 配置 Gemini Balance

创建或更新您的配置文件 `~/.claude-code-router/config.json`：

```json
{
  "Providers": [
    {
      "name": "gemini-balance",
      "api_base_url": "http://84.8.145.89:8000",
      "api_key": "Hjd-961207hjd",
      "models": ["gemini-2.5-flash", "gemini-2.5-pro"],
      "transformer": {
        "use": ["gemini"]
      }
    },
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "your-deepseek-api-key",
      "models": ["deepseek-chat", "deepseek-reasoner"],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": {
          "use": ["tooluse"]
        }
      }
    },
    {
      "name": "ollama",
      "api_base_url": "http://localhost:11434/v1/chat/completions",
      "api_key": "ollama",
      "models": ["qwen2.5-coder:latest"]
    }
  ],
  "Router": {
    "default": "gemini-balance,gemini-2.5-flash",
    "background": "ollama,qwen2.5-coder:latest",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "gemini-balance,gemini-2.5-pro"
  }
}
```

### 3. 启动服务

```bash
# 停止现有服务（如果有）
ccr stop

# 启动新服务
ccr start

# 或者直接使用 Claude Code
ccr code
```

## 🔧 修复技术细节

### 自动 Schema 清理

修复方案在路由器中间件中实现，当检测到使用 Gemini 相关提供商时，会自动：

1. **检测 Gemini 提供商**: 通过模型名称包含 "gemini" 来识别
2. **清理工具 Schema**: 递归移除 `additionalProperties` 和 `$schema` 字段
3. **保持结构完整**: 只移除问题字段，保持其他 Schema 结构不变
4. **记录日志**: 在日志中记录清理操作

### 支持的工具格式

- ✅ **Anthropic 格式**: `tool.input_schema`
- ✅ **OpenAI 格式**: `tool.function.parameters`  
- ✅ **Gemini 格式**: `tool.function_declarations[].parameters`

## 📊 测试验证

运行测试脚本验证修复：

```bash
node test-gemini-schema-fix.js
```

预期输出：
```
🧪 测试 Gemini Schema 清理功能
✅ 测试通过！所有问题字段都已被清理
🎉 Gemini Schema 修复功能测试完成！
```

## 🐛 故障排除

### 1. 构建失败
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 2. 服务启动失败
```bash
# 检查服务状态
ccr status

# 查看日志
tail -f ~/.claude-code-router/claude-code-router.log
```

### 3. Gemini Balance 连接问题
- 确认服务器地址：`http://84.8.145.89:8000`
- 确认访问密码：`Hjd-961207hjd`
- 检查网络连接

### 4. 工具调用仍然失败
- 检查日志中是否有 "Cleaned Gemini tools schema" 消息
- 确认模型名称包含 "gemini"
- 验证配置文件格式正确

## 📝 配置说明

### 模型路由策略

- **default**: 默认使用 `gemini-2.5-flash`（快速响应）
- **background**: 后台任务使用本地 Ollama（节省成本）
- **think**: 思考任务使用 DeepSeek Reasoner（推理能力强）
- **longContext**: 长上下文使用 `gemini-2.5-pro`（上下文能力强）

### 自定义配置

您可以根据需要调整：
- 更改默认模型
- 添加其他提供商
- 修改路由策略
- 调整 transformer 配置

## 🎉 完成

现在您的 claude-code-router 已经完全支持 Gemini Balance，可以正常处理工具调用而不会出现 JSON Schema 错误！
