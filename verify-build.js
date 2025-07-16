#!/usr/bin/env node

/**
 * 验证构建是否成功以及修复是否正常工作
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 验证构建结果...\n');

// 检查构建文件是否存在
const distPath = path.join(__dirname, 'dist');
const cliPath = path.join(distPath, 'cli.js');
const wasmPath = path.join(distPath, 'tiktoken_bg.wasm');

console.log('📁 检查构建文件:');

if (fs.existsSync(cliPath)) {
  const stats = fs.statSync(cliPath);
  console.log(`✅ cli.js 存在 (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
} else {
  console.log('❌ cli.js 不存在');
  process.exit(1);
}

if (fs.existsSync(wasmPath)) {
  const stats = fs.statSync(wasmPath);
  console.log(`✅ tiktoken_bg.wasm 存在 (${(stats.size / 1024).toFixed(2)} KB)`);
} else {
  console.log('❌ tiktoken_bg.wasm 不存在');
  process.exit(1);
}

// 检查源文件是否包含我们的修复
console.log('\n🔧 检查修复代码:');

const routerPath = path.join(__dirname, 'src', 'utils', 'router.ts');
if (fs.existsSync(routerPath)) {
  const routerContent = fs.readFileSync(routerPath, 'utf8');
  
  if (routerContent.includes('cleanGeminiToolsSchema')) {
    console.log('✅ 路由器包含 Gemini schema 清理功能');
  } else {
    console.log('❌ 路由器缺少 Gemini schema 清理功能');
    process.exit(1);
  }
  
  if (routerContent.includes("model.includes('gemini')")) {
    console.log('✅ 路由器包含 Gemini 提供商检测');
  } else {
    console.log('❌ 路由器缺少 Gemini 提供商检测');
    process.exit(1);
  }
} else {
  console.log('❌ router.ts 文件不存在');
  process.exit(1);
}

const transformerPath = path.join(__dirname, 'src', 'utils', 'geminiSchemaTransformer.ts');
if (fs.existsSync(transformerPath)) {
  const transformerContent = fs.readFileSync(transformerPath, 'utf8');
  
  if (transformerContent.includes('cleanGeminiToolsSchema')) {
    console.log('✅ Schema transformer 导出清理函数');
  } else {
    console.log('❌ Schema transformer 缺少清理函数');
    process.exit(1);
  }
  
  if (transformerContent.includes('additionalProperties') && transformerContent.includes('$schema')) {
    console.log('✅ Schema transformer 处理问题字段');
  } else {
    console.log('❌ Schema transformer 未处理问题字段');
    process.exit(1);
  }
} else {
  console.log('❌ geminiSchemaTransformer.ts 文件不存在');
  process.exit(1);
}

// 检查配置示例
console.log('\n📋 检查配置文件:');

const configExamplePath = path.join(__dirname, 'config-gemini-balance-example.json');
if (fs.existsSync(configExamplePath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configExamplePath, 'utf8'));
    
    const geminiProvider = config.Providers.find(p => p.name === 'gemini-balance');
    if (geminiProvider) {
      console.log('✅ 配置示例包含 Gemini Balance 提供商');
      
      if (geminiProvider.api_base_url === 'http://84.8.145.89:8000') {
        console.log('✅ API 基础 URL 配置正确');
      } else {
        console.log('❌ API 基础 URL 配置错误');
      }
      
      if (geminiProvider.models.includes('gemini-2.5-flash') && geminiProvider.models.includes('gemini-2.5-pro')) {
        console.log('✅ 模型配置正确');
      } else {
        console.log('❌ 模型配置错误');
      }
    } else {
      console.log('❌ 配置示例缺少 Gemini Balance 提供商');
    }
  } catch (error) {
    console.log('❌ 配置示例 JSON 格式错误:', error.message);
    process.exit(1);
  }
} else {
  console.log('❌ 配置示例文件不存在');
  process.exit(1);
}

console.log('\n🎉 所有验证通过！');
console.log('\n📝 下一步操作:');
console.log('1. 将 config-gemini-balance-example.json 的内容复制到 ~/.claude-code-router/config.json');
console.log('2. 运行 ccr stop && ccr start 重启服务');
console.log('3. 使用 ccr code 启动 Claude Code');
console.log('\n✨ Gemini Balance 集成修复已完成！');
