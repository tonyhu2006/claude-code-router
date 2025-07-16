// 测试ccr code的"介绍你自己"请求
const http = require('http');

async function testCcrCodeSelfIntro() {
  console.log('🧪 测试ccr code的"介绍你自己"请求...\n');
  
  // 模拟ccr code发送的请求
  const request = {
    model: 'qwen2.5-coder:7b',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '介绍你自己'
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
    max_tokens: 32000,
    stream: true
  };
  
  console.log('📤 发送"介绍你自己"请求...');
  console.log(`🔧 模型: ${request.model}`);
  console.log(`🔧 消息: ${request.messages[0].content[0].text}`);
  
  try {
    const response = await makeRequest(request);
    
    console.log(`\n📡 响应状态: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      console.log('✅ 请求成功');
      console.log(`📊 响应长度: ${response.data.length} 字符`);
      
      // 检查是否是空响应
      if (response.data.trim() === '{}') {
        console.log('❌ 响应为空JSON对象 {}');
        return;
      }
      
      // 分析流式响应
      const hasMessageStart = response.data.includes('event: message_start');
      const hasMessageStop = response.data.includes('event: message_stop');
      const hasContentDelta = response.data.includes('event: content_block_delta');
      
      console.log(`📋 包含message_start: ${hasMessageStart}`);
      console.log(`📋 包含message_stop: ${hasMessageStop}`);
      console.log(`📋 包含content_delta: ${hasContentDelta}`);
      
      if (hasMessageStart && hasMessageStop && hasContentDelta) {
        console.log('✅ 流式响应完整');
        
        // 提取实际内容
        const content = extractStreamContent(response.data);
        console.log(`\n💬 响应内容:`);
        console.log(`"${content}"`);
        
        if (content.trim() === '') {
          console.log('❌ 提取的内容为空');
        } else {
          console.log('✅ 成功提取到内容');
        }
      } else {
        console.log('⚠️  流式响应不完整');
        
        // 显示原始响应的前500字符
        console.log('\n📄 原始响应前500字符:');
        console.log(response.data.substring(0, 500));
      }
    } else {
      console.log(`❌ 请求失败: ${response.statusCode}`);
      console.log(`📄 错误内容: ${response.data.substring(0, 300)}...`);
    }
  } catch (error) {
    console.log(`💥 请求异常: ${error.message}`);
  }
}

function extractStreamContent(streamData) {
  const lines = streamData.split('\n');
  let content = '';
  
  for (const line of lines) {
    if (line.startsWith('data:')) {
      try {
        const data = JSON.parse(line.substring(5).trim());
        if (data.type === 'content_block_delta' && data.delta?.text) {
          content += data.delta.text;
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }
  
  return content;
}

function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: '127.0.0.1',
      port: 3456,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'test',
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
    
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testCcrCodeSelfIntro()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
