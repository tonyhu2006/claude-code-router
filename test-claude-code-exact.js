// 完全模拟Claude Code的请求格式
const http = require('http');

async function testClaudeCodeExact() {
  console.log('🎯 完全模拟Claude Code的请求格式...\n');
  
  // 这是从Claude Code实际发送的请求格式
  const claudeCodeRequest = {
    model: 'gemini-balance,gemini-2.5-flash',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '你好，请用中文简短回答'
          }
        ]
      }
    ],
    temperature: 1,
    system: [
      {
        type: 'text',
        text: 'You are Claude Code, Anthropic\'s official CLI for Claude.',
        cache_control: { type: 'ephemeral' }
      }
    ],
    tools: [],
    metadata: {
      user_id: '2f0def4abb0dca9709af0c3e3b8b124656fb9f09ff12efa582759f00aea0c02c'
    },
    max_tokens: 21333
  };
  
  console.log('📤 发送请求...');
  console.log('🔗 URL: http://127.0.0.1:3456/v1/messages');
  console.log('📋 模型: gemini-balance,gemini-2.5-flash');
  console.log('💬 消息: 你好，请用中文简短回答');
  console.log('─'.repeat(60));
  
  try {
    const response = await makeClaudeCodeRequest(claudeCodeRequest);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log('✅ 成功!');
      console.log(`📝 模型: ${data.model || 'unknown'}`);
      console.log(`💬 响应: ${data.content?.[0]?.text || '无内容'}`);
      console.log(`📊 Token: 输入${data.usage?.input_tokens || 0}, 输出${data.usage?.output_tokens || 0}`);
      console.log(`🆔 请求ID: ${data.id || '无ID'}`);
      
      console.log('\n🎉 Claude Code格式请求成功！');
      console.log('💡 您的Gemini Balance后台应该能看到这个API调用');
      
    } else {
      console.log(`❌ 失败: HTTP ${response.statusCode}`);
      console.log(`📄 错误详情:`);
      console.log(response.data);
      
      console.log('\n🔍 可能的问题:');
      console.log('1. Gemini Balance服务器配置问题');
      console.log('2. 网络连接问题');
      console.log('3. 认证token问题');
    }
  } catch (error) {
    console.log(`💥 异常: ${error.message}`);
    console.log('\n🔍 可能的问题:');
    console.log('1. Claude Code Router服务未启动');
    console.log('2. 端口3456被占用');
    console.log('3. 网络连接问题');
  }
}

function makeClaudeCodeRequest(requestData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestData);
    
    const options = {
      hostname: '127.0.0.1',
      port: 3456,
      path: '/v1/messages?beta=true', // Claude Code实际使用的路径
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Bearer test',
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'claude-code-20250219,fine-grained-tool-streaming-2025-05-14',
        'x-app': 'cli',
        'user-agent': 'claude-cli/1.0.51 (external, cli)',
        'x-stainless-lang': 'js',
        'x-stainless-package-version': '0.55.1',
        'x-stainless-os': 'Windows',
        'x-stainless-arch': 'x64',
        'x-stainless-runtime': 'node',
        'x-stainless-runtime-version': 'v22.11.0'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testClaudeCodeExact()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
