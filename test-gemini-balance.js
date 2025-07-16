// 测试Gemini Balance集成的简单脚本
const https = require('https');
const http = require('http');

async function testGeminiBalance() {
  console.log('🧪 Testing Gemini Balance integration...\n');
  
  // 测试数据 - 直接指定gemini-balance模型
  const testData = {
    model: 'gemini-balance,gemini-1.5-flash', // 直接指定gemini-balance
    messages: [
      {
        role: 'user',
        content: 'Hello! Please respond with a simple greeting.'
      }
    ],
    max_tokens: 100
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
  
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      console.log(`📡 Status Code: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('\n✅ Response received:');
          console.log(JSON.stringify(response, null, 2));
          resolve(response);
        } catch (error) {
          console.log('\n📄 Raw response:');
          console.log(data);
          resolve(data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testGeminiBalance()
  .then(() => {
    console.log('\n🎉 Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
