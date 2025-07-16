// 测试更新后的模型配置
const http = require('http');

async function testUpdatedModels() {
  console.log('🧪 测试更新后的Gemini Balance模型配置...\n');
  
  const tests = [
    {
      name: '测试 gemini-2.5-flash',
      model: 'gemini-balance,gemini-2.5-flash',
      content: 'Hello! Please respond briefly.'
    },
    {
      name: '测试 gemini-2.5-pro',
      model: 'gemini-balance,gemini-2.5-pro',
      content: 'Hello! Please respond briefly.'
    },
    {
      name: '测试默认路由 (应该使用 gemini-2.5-flash)',
      model: 'claude-3-5-sonnet-20241022',
      content: 'Hello! Please respond briefly.'
    }
  ];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`${i + 1}. ${test.name}`);
    console.log('─'.repeat(50));
    
    try {
      const response = await makeRequest(test.model, test.content);
      
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        console.log('✅ 成功!');
        console.log(`📝 模型: ${data.model || test.model}`);
        console.log(`💬 响应: ${data.content?.[0]?.text || '无内容'}`);
        console.log(`📊 Token: 输入${data.usage?.input_tokens || 0}, 输出${data.usage?.output_tokens || 0}`);
      } else {
        console.log(`❌ 失败: HTTP ${response.statusCode}`);
        console.log(`📄 错误: ${response.data.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`💥 异常: ${error.message}`);
    }
    
    console.log('');
    // 等待1秒再进行下一个测试
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🏁 测试完成!');
  console.log('\n💡 现在只支持以下模型:');
  console.log('   - gemini-2.5-flash (快速响应)');
  console.log('   - gemini-2.5-pro (专业版本)');
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
      max_tokens: 50
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
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testUpdatedModels()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
