# 代码结构

## 目录结构
```
src/
├── cli.ts                          # CLI 入口点，处理命令行参数
├── index.ts                        # 主服务入口，启动 HTTP 代理服务
├── constants.ts                    # 常量定义（配置文件路径等）
└── utils/
    ├── close.ts                    # 服务关闭逻辑
    ├── codeCommand.ts              # Claude Code 命令执行
    ├── geminiSchemaTransformer.ts  # Gemini API Schema 清理器
    ├── index.ts                    # 工具函数集合
    ├── log.ts                      # 日志记录
    ├── processCheck.ts             # 进程管理和检查
    ├── router.ts                   # 请求路由逻辑
    └── status.ts                   # 服务状态检查
```

## 核心模块

### CLI 模块 (cli.ts)
- **main()**: 主命令处理函数
- **waitForService()**: 等待服务启动
- 支持命令: start, stop, status, code, version, help

### 服务模块 (index.ts)
- **run()**: 启动代理服务
- **initializeClaudeConfig()**: 初始化 Claude 配置
- 进程管理和信号处理

### 路由模块 (router.ts)
- **router()**: 主路由中间件
- **getUseModel()**: 模型选择逻辑
- Token 计数和上下文长度检查

### Gemini 集成 (geminiSchemaTransformer.ts)
- **GeminiSchemaTransformer**: 自定义 Transformer 类
- **cleanToolsSchema()**: 清理工具定义
- **cleanGeminiSchema()**: 清理 JSON Schema

## 关键文件
- **package.json**: 项目配置和依赖
- **tsconfig.json**: TypeScript 编译配置
- **config.json**: 运行时配置文件
- **config-gemini-balance-example.json**: Gemini Balance 配置示例