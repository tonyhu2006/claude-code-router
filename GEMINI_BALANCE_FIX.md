# Gemini Balance 集成问题修复

## 问题描述

在集成 Gemini Balance 服务时，遇到了以下错误：

```
API call failed with status code 400
Invalid JSON payload received. Unknown name "additionalProperties" at 'tools[0].function_declarations[0].parameters': Cannot find field.
Invalid JSON payload received. Unknown name "$schema" at 'tools[0].function_declarations[0].parameters': Cannot find field.
```

## 问题原因

Gemini API 不支持 JSON Schema 中的以下字段：
- `additionalProperties`
- `$schema`

这些字段在 OpenAI/Anthropic 格式中是标准的，但 Gemini API 会拒绝包含这些字段的请求。

## 解决方案

### 1. 创建自定义 Transformer

我们创建了一个专门的 `GeminiSchemaTransformer` 来清理这些不兼容的字段：

**文件位置**: `src/utils/geminiSchemaTransformer.ts`

**主要功能**:
- 递归清理 JSON Schema 对象
- 移除 `additionalProperties` 和 `$schema` 字段
- 支持多种工具定义格式（Anthropic、OpenAI、Gemini）

### 2. 集成到路由器

在 `src/utils/router.ts` 中集成 schema 清理功能：

```typescript
import { cleanGeminiToolsSchema } from "./geminiSchemaTransformer";

// 在路由器中检测 Gemini 提供商并清理 schema
if (model && typeof model === 'string' && model.includes('gemini')) {
  if (req.body.tools && Array.isArray(req.body.tools)) {
    req.body.tools = cleanGeminiToolsSchema(req.body.tools);
    log("Cleaned Gemini tools schema for model:", model);
  }
}
```

### 3. 配置使用

在配置文件中为 Gemini Balance 提供商添加 transformer：

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
    }
  ]
}
```

## 使用方法

### 1. 重新构建项目

```bash
npm run build
```

### 2. 更新配置文件

将 `config-gemini-balance-example.json` 的内容复制到您的 `~/.claude-code-router/config.json` 文件中，并根据需要调整配置。

### 3. 重启服务

```bash
ccr stop
ccr start
```

## 技术细节

### Schema 清理工作原理

1. **路由检测**: 在路由器中检测是否使用 Gemini 相关提供商
2. **自动清理**: 自动清理工具定义中的不兼容字段
3. **透明处理**: 对用户完全透明，无需额外配置

### 支持的工具格式

- **Anthropic 格式**: `tool.input_schema`
- **OpenAI 格式**: `tool.function.parameters`
- **Gemini 格式**: `tool.function_declarations[].parameters`

### 清理的字段

- `additionalProperties`: JSON Schema 扩展属性控制
- `$schema`: JSON Schema 版本标识符

## 验证修复

修复后，Gemini Balance 应该能够正常处理工具调用请求，不再出现 400 错误。

## 注意事项

1. 确保 Gemini Balance 服务器正在运行
2. 检查 API 密钥和基础 URL 配置
3. 如果仍有问题，检查日志文件：`~/.claude-code-router/claude-code-router.log`

## 相关文件

- `src/utils/geminiSchemaTransformer.ts` - 自定义 transformer 实现
- `src/server.ts` - 服务器配置和 transformer 注册
- `config-gemini-balance-example.json` - 示例配置文件
