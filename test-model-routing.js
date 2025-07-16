// 测试模型路由问题
const http = require('http');

async function testModelRouting() {
  console.log('🔍 测试模型路由问题...\n');
  
  // 测试1: 检查可用模型
  console.log('1️⃣ 检查可用模型...');
  try {
    const modelsResponse = await makeRequest('/v1/models', 'GET');
    if (modelsResponse.statusCode === 200) {
      const models = JSON.parse(modelsResponse.data);
      console.log('✅ 可用模型:');
      models.data.forEach(model => {
        if (model.id.includes('gemini')) {
          console.log(`   📋 ${model.id} (provider: ${model.provider})`);
        }
      });
    } else {
      console.log('❌ 获取模型列表失败:', modelsResponse.statusCode);
    }
  } catch (error) {
    console.log('💥 获取模型列表异常:', error.message);
  }
  
  console.log('\n─'.repeat(60));
  
  // 测试2: 直接使用模型名
  const testCases = [
    {
      name: '使用完整格式: gemini-balance,gemini-2.5-flash',
      model: 'gemini-balance,gemini-2.5-flash'
    },
    {
      name: '使用模型名: gemini-2.5-flash',
      model: 'gemini-2.5-flash'
    },
    {
      name: '使用错误格式: gemini-balance:gemini-2.5-flash',
      model: 'gemini-balance:gemini-2.5-flash'
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${i + 2}️⃣ ${testCase.name}`);
    console.log('─'.repeat(50));
    
    try {
      const response = await makeRequest('/v1/messages', 'POST', {
        model: testCase.model,
        messages: [
          {
            role: 'user',
            content: '简短回答：你好'
          }
        ],
        max_tokens: 50
      });
      
      if (response.statusCode === 200) {
        const data = JSON.parse(response.data);
        console.log('✅ 成功!');
        console.log(`📝 响应模型: ${data.model || 'unknown'}`);
        console.log(`💬 响应内容: ${data.content?.[0]?.text || '无内容'}`);
        console.log(`🆔 请求ID: ${data.id || '无ID'}`);
      } else {
        console.log(`❌ 失败: HTTP ${response.statusCode}`);
        console.log(`📄 错误: ${response.data.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`💥 异常: ${error.message}`);
    }
    
    // 等待1秒
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 测试完成!');
  console.log('\n💡 分析结果:');
  console.log('- 如果只有模型名成功，说明provider,model格式有问题');
  console.log('- 如果都失败，说明gemini-balance provider没有正确注册');
  console.log('- 如果完整格式成功，说明路由工作正常');
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3456,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'test'
      }
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData
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
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 运行测试
testModelRouting()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
