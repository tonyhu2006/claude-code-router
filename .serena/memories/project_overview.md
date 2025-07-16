# Claude Code Router 项目概述

## 项目目的
Claude Code Router 是一个用于将 Claude Code 请求路由到不同 LLM 提供商的工具。它允许用户在不需要 Anthropic 账户的情况下使用 Claude Code，并可以将请求路由到其他 LLM 提供商（如 DeepSeek、OpenRouter、Ollama、Gemini 等）。

## 主要功能
- **模型路由**: 根据上下文长度、模型类型和任务类型智能路由请求
- **多提供商支持**: 支持 OpenRouter、DeepSeek、Ollama、Gemini、火山引擎等多个 LLM 提供商
- **背景任务优化**: 为背景任务使用成本更低的模型
- **长上下文处理**: 当上下文超过 32K 时自动切换到长上下文模型
- **推理模式**: 支持使用专门的推理模型（如 DeepSeek-R1）
- **GitHub Actions 集成**: 支持在 GitHub Actions 中使用
- **Gemini Balance 集成**: 特别支持 Gemini Balance 代理服务

## 技术架构
- **CLI 工具**: 提供命令行接口用于启动、停止和管理服务
- **HTTP 代理服务**: 在本地 3456 端口运行，拦截和路由 Claude Code 请求
- **配置驱动**: 通过 JSON 配置文件管理提供商和路由规则
- **Transformer 系统**: 支持请求/响应转换以适配不同 API 格式

## 版本信息
- 当前版本: 1.0.18
- 包名: @musistudio/claude-code-router
- 许可证: MIT