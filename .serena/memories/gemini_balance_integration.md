# Gemini Balance 集成详情

## 集成背景
项目已成功集成 Gemini Balance 支持，这是一个 Gemini API 代理服务，部署在 http://84.8.145.89:8000。

## 技术实现

### 自定义 Transformer
创建了 `GeminiSchemaTransformer` 类来解决 Gemini API 的兼容性问题：
- **位置**: `src/utils/geminiSchemaTransformer.ts`
- **功能**: 清理 JSON Schema 中 Gemini API 不支持的字段
- **清理字段**: `additionalProperties`, `$schema`

### 支持的工具格式
- **Anthropic 格式**: `tool.input_schema`
- **OpenAI 格式**: `tool.function.parameters`  
- **Gemini 格式**: `tool.function_declarations[].parameters`

### 配置示例
```json
{
  "Providers": [
    {
      "name": "gemini-balance",
      "api_base_url": "http://84.8.145.89:8000",
      "api_key": "Hjd-961207hjd",
      "models": ["gemini-2.5-flash", "gemini-2.5-pro"],
      "transformer": {
        "use": ["gemini", "gemini-schema-cleaner"]
      }
    }
  ],
  "Router": {
    "default": "gemini-balance,gemini-2.5-flash",
    "longContext": "gemini-balance,gemini-2.5-pro"
  }
}
```

## 已知问题和解决方案

### 问题1: JSON Schema 兼容性
- **症状**: API 返回 400 错误，提示 "Unknown name additionalProperties"
- **原因**: Gemini API 不支持某些 JSON Schema 字段
- **解决**: 使用 GeminiSchemaTransformer 自动清理

### 问题2: 模型支持
- **当前支持**: gemini-2.5-flash, gemini-2.5-pro
- **已移除**: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash-exp
- **原因**: 用户的 Gemini Balance 服务器仅支持 2.5 系列模型

## 测试验证
- **测试文件**: `test-gemini-balance.js`, `test-direct-gemini-balance.js`
- **验证点**: API 连接、Schema 清理、响应处理
- **状态**: 基本功能正常，但响应显示仍有问题

## 当前状态
- ✅ API 连接正常
- ✅ Schema 清理工作正常
- ✅ 模型路由正确
- ❓ 响应消息显示问题（显示 '{}' 而非实际内容）

## 后续改进方向
1. 调试响应流处理问题
2. 优化错误处理和日志记录
3. 添加更多测试用例
4. 考虑支持更多 Gemini 特性