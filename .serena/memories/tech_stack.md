# 技术栈

## 核心技术
- **Node.js**: 运行时环境
- **TypeScript**: 主要开发语言，严格类型检查
- **esbuild**: 构建工具，用于打包和编译

## 主要依赖
- **@musistudio/llms**: 核心 LLM 库，版本 ^1.0.5
- **tiktoken**: Token 计数库，用于计算上下文长度
- **uuid**: UUID 生成库
- **dotenv**: 环境变量管理

## 开发依赖
- **TypeScript**: ^5.8.2
- **esbuild**: ^0.25.1 (构建工具)
- **shx**: ^0.4.0 (跨平台 shell 命令)

## TypeScript 配置
- 目标: ES2022
- 模块系统: CommonJS
- 严格模式: 启用
- 源码映射: 启用
- 声明文件: 启用
- 输出目录: ./dist
- 源码目录: ./src

## 构建系统
- 使用 esbuild 进行快速构建
- 支持 Node.js 平台
- 自动复制 tiktoken WebAssembly 文件
- 生成单一可执行文件 (dist/cli.js)