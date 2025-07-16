// 简单测试请求
const http = require('http');

async function testSimpleRequest() {
  console.log('🧪 测试简单请求到 Gemini Balance...');
  
  const testData = {
    model: 'gemini-balance,gemini-1.5-flash',
    messages: [
      {
        role: 'user',
        content: 'Hello! Please respond with just "Hi" and nothing else.'
      }
    ],
    max_tokens: 10,
    stream: false  // 禁用流式响应
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
    },
    timeout: 30000  // 30秒超时
  };
  
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      console.log(`📡 状态码: ${res.statusCode}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ 响应成功:');
          console.log(`💬 内容: ${response.content?.[0]?.text || '无内容'}`);
          console.log(`📊 模型: ${response.model || '未知'}`);
          resolve(response);
        } catch (error) {
          console.log('📄 原始响应:');
          console.log(data);
          resolve(data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ 请求错误:', error.message);
      reject(error);
    });
    
    req.on('timeout', () => {
      console.error('⏰ 请求超时');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testSimpleRequest()
  .then(() => {
    console.log('\n✅ 测试完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  });
