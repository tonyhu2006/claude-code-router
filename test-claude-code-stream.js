// 测试Claude Code的流式请求
const http = require('http');

async function testClaudeCodeStream() {
  console.log('🧪 测试Claude Code流式请求...');
  
  const testData = {
    model: 'claude-3-5-sonnet-20241022',
    messages: [
      {
        role: 'user',
        content: 'hello'
      }
    ],
    max_tokens: 100,
    stream: true  // 启用流式响应
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
      'x-api-key': 'test',
      'anthropic-version': '2023-06-01'
    }
  };
  
  return new Promise((resolve, reject) => {
    console.log('📤 发送流式请求...');
    
    const req = http.request(options, (res) => {
      console.log(`📡 状态码: ${res.statusCode}`);
      console.log(`📋 响应头:`, res.headers);
      
      let fullResponse = '';
      let eventCount = 0;
      
      res.on('data', (chunk) => {
        const chunkStr = chunk.toString();
        fullResponse += chunkStr;
        eventCount++;
        
        console.log(`📥 事件 ${eventCount}:`);
        console.log(chunkStr);
        console.log('─'.repeat(40));
      });
      
      res.on('end', () => {
        console.log('🏁 流式响应结束');
        console.log(`📊 总共接收到 ${eventCount} 个事件`);
        
        if (fullResponse.includes('message_stop')) {
          console.log('✅ 流式响应完整');
        } else {
          console.log('⚠️ 流式响应可能不完整');
        }
        
        resolve(fullResponse);
      });
      
      res.on('error', (error) => {
        console.error('❌ 响应错误:', error);
        reject(error);
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
testClaudeCodeStream()
  .then(() => {
    console.log('\n✅ 测试完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  });
