# 代码风格和约定

## TypeScript 风格
- **严格模式**: 启用所有 TypeScript 严格检查
- **类型注解**: 优先使用显式类型注解
- **接口定义**: 使用 interface 定义对象结构
- **异步处理**: 使用 async/await 而非 Promise.then()

## 命名约定
- **文件名**: 使用 camelCase (如 geminiSchemaTransformer.ts)
- **函数名**: 使用 camelCase (如 getUseModel, cleanToolsSchema)
- **常量**: 使用 UPPER_SNAKE_CASE (如 CONFIG_FILE, DEFAULT_CONFIG)
- **类名**: 使用 PascalCase (如 GeminiSchemaTransformer)
- **接口**: 使用 PascalCase，可选择 I 前缀

## 代码组织
- **模块导出**: 优先使用具名导出
- **工具函数**: 集中在 utils/ 目录下
- **常量定义**: 集中在 constants.ts 文件中
- **类型定义**: 与使用它们的模块放在一起

## 错误处理
- **异步函数**: 使用 try-catch 包装
- **日志记录**: 使用统一的 log() 函数
- **进程退出**: 使用适当的退出码 (0 成功, 1 失败)

## 注释风格
- **函数注释**: 简洁描述功能和参数
- **复杂逻辑**: 添加行内注释说明
- **TODO**: 使用 // TODO: 标记待办事项

## 文件结构模式
```typescript
// 导入顺序：Node.js 内置模块 -> 第三方模块 -> 本地模块
import { readFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { log } from './log';

// 常量定义
const CONSTANT_VALUE = 'value';

// 类型定义
interface ConfigType {
  // ...
}

// 主要功能实现
export function mainFunction() {
  // ...
}
```

## 配置文件格式
- **JSON**: 使用标准 JSON 格式，支持注释（在示例中）
- **缩进**: 使用 2 个空格
- **属性命名**: 使用 camelCase 或 PascalCase