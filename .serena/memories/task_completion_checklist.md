# 任务完成检查清单

## 代码更改后必须执行的步骤

### 1. 构建和编译
```bash
# 构建项目
npm run build

# 检查构建输出
ls -la dist/
```

### 2. 测试验证
```bash
# 运行相关测试脚本
node test-gemini-balance.js
node test-claude-code-stream.js
node final-integration-test.js

# 测试服务启动
ccr stop
ccr start
ccr status
```

### 3. 功能验证
- **服务启动**: 确认服务能正常启动在 3456 端口
- **配置加载**: 验证配置文件正确加载
- **模型路由**: 测试不同模型的路由逻辑
- **API 兼容性**: 确认与 Claude Code 的兼容性

### 4. 日志检查
```bash
# 查看服务日志
tail -f ~/.claude-code-router/claude-code-router.log

# 检查错误信息
grep -i error ~/.claude-code-router/claude-code-router.log
```

### 5. 配置验证
- **示例配置**: 更新配置示例文件
- **文档同步**: 确保 README.md 和配置文档同步
- **向后兼容**: 验证配置格式的向后兼容性

### 6. 特殊检查项

#### Gemini Balance 集成
- **Schema 清理**: 验证 Gemini Schema Transformer 正常工作
- **API 调用**: 测试与 Gemini Balance 服务的连接
- **错误处理**: 确认 400 错误已修复

#### 模型路由
- **Token 计数**: 验证 tiktoken 正确计算上下文长度
- **长上下文**: 测试超过 32K token 的请求路由
- **背景任务**: 验证 claude-3-5-haiku 模型的路由

### 7. 发布前检查
- **版本号**: 更新 package.json 中的版本号
- **变更日志**: 记录重要更改
- **文档更新**: 更新 README.md 和相关文档
- **测试覆盖**: 确保新功能有对应的测试

### 8. 部署验证
```bash
# 全局安装测试
npm install -g @musistudio/claude-code-router

# 验证 CLI 命令
ccr --version
ccr --help

# 测试完整流程
ccr start
ccr code --help
ccr stop
```

## 常见问题排查
- **端口冲突**: 检查 3456 端口是否被占用
- **配置错误**: 验证 JSON 格式和必需字段
- **依赖问题**: 确认所有依赖正确安装
- **权限问题**: 检查配置文件和日志文件的读写权限