// 模拟ccr code的请求来测试Gemini Balance集成
const http = require('http');

async function simulateCcrCodeRequest() {
  console.log('🎯 模拟ccr code请求测试...\n');
  
  // 模拟ccr code发送的典型请求格式
  const testRequest = {
    model: 'gemini-balance,gemini-2.5-flash',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '测试ccr code与Gemini Balance的集成'
          }
        ]
      }
    ],
    temperature: 1,
    system: [
      {
        type: 'text',
        text: 'You are Claude Code, Anthropic\'s official CLI for Claude.',
        cache_control: {
          type: 'ephemeral'
        }
      }
    ],
    stream: true  // ccr code通常使用流式响应
  };
  
  console.log('📤 发送模拟ccr code请求...');
  console.log('🔧 请求配置:');
  console.log(`   📋 模型: ${testRequest.model}`);
  console.log(`   📋 流式: ${testRequest.stream}`);
  console.log(`   📋 消息: ${testRequest.messages[0].content[0].text}`);
  
  try {
    const response = await makeAnthropicRequest(testRequest);
    
    if (response.statusCode === 200) {
      console.log('\n✅ 模拟ccr code请求成功!');
      console.log('📄 响应状态:', response.statusCode);
      console.log('📋 响应头:', JSON.stringify(response.headers, null, 2));
      
      // 分析流式响应
      if (response.data.includes('event: message_start')) {
        console.log('🔄 检测到流式响应格式');
        const lines = response.data.split('\n').filter(line => line.trim());
        console.log(`📊 流式数据行数: ${lines.length}`);
        
        // 查找消息内容
        const contentLines = lines.filter(line => 
          line.includes('content_block_delta') || 
          line.includes('message_start')
        );
        console.log(`💬 内容相关行数: ${contentLines.length}`);
        
        if (contentLines.length > 0) {
          console.log('📝 前几行内容:');
          contentLines.slice(0, 5).forEach((line, index) => {
            console.log(`   ${index + 1}: ${line.substring(0, 100)}...`);
          });
        }
      } else {
        console.log('📝 响应内容前500字符:', response.data.substring(0, 500));
      }
    } else {
      console.log(`❌ 请求失败: HTTP ${response.statusCode}`);
      console.log(`📄 错误内容: ${response.data.substring(0, 300)}...`);
    }
  } catch (error) {
    console.log(`💥 请求异常: ${error.message}`);
  }
  
  console.log('\n🏁 模拟测试完成!');
  console.log('\n💡 如果看到流式响应和正确的内容，说明ccr code集成应该正常工作');
}

function makeAnthropicRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: '127.0.0.1',
      port: 3456,
      path: '/v1/messages',  // Anthropic格式的端点
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'test',  // ccr code使用的API key
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(postData)
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
          headers: res.headers,
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
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
simulateCcrCodeRequest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
