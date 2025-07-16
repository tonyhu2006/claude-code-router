// 测试简单的hello请求
const http = require('http');

async function testHello() {
  console.log('🧪 测试简单的 "hello" 请求...');
  
  const testData = {
    model: 'gemini-balance,gemini-1.5-flash',
    messages: [
      {
        role: 'user',
        content: 'hello'
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
  
  return new Promise((resolve, reject) => {
    console.log('📤 发送请求...');
    
    const req = http.request(options, (res) => {
      let data = '';
      
      console.log(`📡 状态码: ${res.statusCode}`);
      console.log(`📋 响应头:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
        console.log('📥 接收数据块:', chunk.toString().substring(0, 100) + '...');
      });
      
      res.on('end', () => {
        console.log('🏁 响应结束');
        console.log('📄 完整响应:');
        console.log(data);
        
        try {
          const response = JSON.parse(data);
          console.log('\n✅ 解析成功:');
          console.log(`💬 内容: ${response.content?.[0]?.text || '无内容'}`);
          resolve(response);
        } catch (error) {
          console.log('\n⚠️ JSON解析失败，返回原始数据');
          resolve(data);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ 请求错误:', error);
      reject(error);
    });
    
    req.setTimeout(30000, () => {
      console.error('⏰ 请求超时');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testHello()
  .then(() => {
    console.log('\n✅ 测试完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  });
