// 最终集成测试脚本
const http = require('http');

async function testGeminiBalanceIntegration() {
  console.log('🎯 Claude Code Router + Gemini Balance 集成测试');
  console.log('═'.repeat(60));
  
  const tests = [
    {
      name: '测试默认模型 (应该自动使用 gemini-balance)',
      model: 'claude-3-5-sonnet-20241022',
      content: 'Hello! Please respond with a simple greeting.'
    },
    {
      name: '直接指定 Gemini Balance 模型',
      model: 'gemini-balance,gemini-1.5-flash',
      content: 'Hello! Please respond with a simple greeting in Chinese.'
    }
  ];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n${i + 1}. ${test.name}`);
    console.log('─'.repeat(40));
    
    try {
      const response = await makeRequest(test.model, test.content);
      
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        console.log('✅ 成功!');
        console.log(`📝 模型: ${data.model || test.model}`);
        console.log(`💬 响应: ${data.content?.[0]?.text || '无内容'}`);
        console.log(`📊 Token使用: 输入${data.usage?.input_tokens || 0}, 输出${data.usage?.output_tokens || 0}`);
      } else {
        console.log(`❌ 失败: HTTP ${response.statusCode}`);
        console.log(`📄 错误: ${response.data}`);
      }
    } catch (error) {
      console.log(`💥 异常: ${error.message}`);
    }
    
    // 等待一秒再进行下一个测试
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 测试完成!');
  console.log('\n💡 使用建议:');
  console.log('   - 在 Claude Code 中使用: /model gemini-balance,gemini-1.5-pro');
  console.log('   - 支持中文对话和多种任务');
  console.log('   - 享受 Gemini Balance 的负载均衡功能');
}

function makeRequest(model, content) {
  return new Promise((resolve, reject) => {
    const testData = {
      model: model,
      messages: [
        {
          role: 'user',
          content: content
        }
      ],
      max_tokens: 150
    };
    
    const postData = JSON.stringify(testData);
    
    const options = {
      hostname: '127.0.0.1',
      port: 3456,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-api-key': 'test'
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
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testGeminiBalanceIntegration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
