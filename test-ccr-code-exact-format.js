// 测试ccr code的确切请求格式
const http = require('http');

async function testCcrCodeExactFormat() {
  console.log('🔍 测试ccr code的确切请求格式...\n');
  
  // 模拟ccr code发送的完整请求（简化版）
  const ccrCodeRequest = {
    model: 'gemini-balance,gemini-2.5-flash',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '简单测试：你好'
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
    tools: [
      {
        name: 'Bash',
        description: 'Executes a given bash command',
        input_schema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'The command to execute'
            }
          },
          required: ['command']
        }
      }
    ],
    metadata: {
      user_id: '2f0def4abb0dca9709af0c3e3b8b124656fb9f09ff12efa582759f00aea0c02c'
    },
    max_tokens: 32000,
    stream: true
  };
  
  console.log('📤 发送模拟ccr code请求...');
  console.log(`🔧 模型: ${ccrCodeRequest.model}`);
  console.log(`🔧 工具数量: ${ccrCodeRequest.tools.length}`);
  console.log(`🔧 最大tokens: ${ccrCodeRequest.max_tokens}`);
  console.log(`🔧 流式: ${ccrCodeRequest.stream}`);
  
  try {
    const response = await makeRequest(ccrCodeRequest);
    
    if (response.statusCode === 200) {
      console.log('\n✅ ccr code格式请求成功!');
      console.log(`📊 响应长度: ${response.data.length} 字符`);
      
      // 检查流式响应完整性
      const hasMessageStart = response.data.includes('event: message_start');
      const hasMessageStop = response.data.includes('event: message_stop');
      const hasContentDelta = response.data.includes('event: content_block_delta');
      
      console.log(`📋 包含message_start: ${hasMessageStart}`);
      console.log(`📋 包含message_stop: ${hasMessageStop}`);
      console.log(`📋 包含content_delta: ${hasContentDelta}`);
      
      if (hasMessageStart && hasMessageStop && hasContentDelta) {
        console.log('✅ 流式响应完整');
        
        // 提取实际内容
        const dataLines = response.data.split('\n')
          .filter(line => line.startsWith('data:'))
          .map(line => line.substring(5).trim())
          .filter(line => line && line !== '[DONE]');
        
        let content = '';
        dataLines.forEach(line => {
          try {
            const data = JSON.parse(line);
            if (data.type === 'content_block_delta' && data.delta?.text) {
              content += data.delta.text;
            }
          } catch (e) {
            // 忽略解析错误
          }
        });
        
        console.log(`💬 响应内容: "${content}"`);
      } else {
        console.log('⚠️  流式响应不完整');
      }
    } else {
      console.log(`❌ ccr code格式请求失败: ${response.statusCode}`);
      console.log(`📄 错误内容: ${response.data.substring(0, 300)}...`);
    }
  } catch (error) {
    console.log(`💥 ccr code格式请求异常: ${error.message}`);
  }
  
  console.log('\n🏁 ccr code格式测试完成!');
  console.log('\n💡 如果这个测试成功，说明问题可能在于：');
  console.log('- ccr code发送的请求过于复杂（太多工具定义）');
  console.log('- 请求超时或网络问题');
  console.log('- 特定的参数组合导致问题');
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
    
    req.setTimeout(120000, () => {  // 2分钟超时
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testCcrCodeExactFormat()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
