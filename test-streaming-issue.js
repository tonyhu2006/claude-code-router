// 专门测试流式响应问题
const http = require('http');

async function testStreamingIssue() {
  console.log('🔍 诊断ccr code流式响应问题...\n');
  
  // 测试1: 简单的非流式请求
  console.log('1️⃣ 测试非流式请求...');
  try {
    const response1 = await makeRequest({
      model: 'gemini-balance,gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '简短回答：你好'
            }
          ]
        }
      ],
      stream: false  // 非流式
    });
    
    if (response1.statusCode === 200) {
      console.log('✅ 非流式请求成功');
      const data = JSON.parse(response1.data);
      console.log(`📝 响应: ${data.content?.[0]?.text || '无内容'}`);
    } else {
      console.log(`❌ 非流式请求失败: ${response1.statusCode}`);
      console.log(`📄 错误: ${response1.data.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`💥 非流式请求异常: ${error.message}`);
  }
  
  console.log('\n─'.repeat(60));
  
  // 测试2: 简单的流式请求
  console.log('\n2️⃣ 测试简单流式请求...');
  try {
    const response2 = await makeRequest({
      model: 'gemini-balance,gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '简短回答：你好'
            }
          ]
        }
      ],
      stream: true  // 流式
    });
    
    if (response2.statusCode === 200) {
      console.log('✅ 简单流式请求成功');
      console.log(`📊 响应长度: ${response2.data.length} 字符`);
      
      // 分析流式数据
      const lines = response2.data.split('\n').filter(line => line.trim());
      console.log(`📋 数据行数: ${lines.length}`);
      
      const eventLines = lines.filter(line => line.startsWith('event:'));
      const dataLines = lines.filter(line => line.startsWith('data:'));
      console.log(`📋 事件行: ${eventLines.length}, 数据行: ${dataLines.length}`);
      
      if (eventLines.length > 0) {
        console.log('📝 前几个事件:');
        eventLines.slice(0, 3).forEach((line, index) => {
          console.log(`   ${index + 1}: ${line}`);
        });
      }
    } else {
      console.log(`❌ 简单流式请求失败: ${response2.statusCode}`);
      console.log(`📄 错误: ${response2.data.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`💥 简单流式请求异常: ${error.message}`);
  }
  
  console.log('\n─'.repeat(60));
  
  // 测试3: 复杂的ccr code风格流式请求
  console.log('\n3️⃣ 测试复杂ccr code风格流式请求...');
  try {
    const response3 = await makeRequest({
      model: 'gemini-balance,gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '测试ccr code流式响应'
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
    });
    
    if (response3.statusCode === 200) {
      console.log('✅ 复杂流式请求成功');
      console.log(`📊 响应长度: ${response3.data.length} 字符`);
      
      // 检查是否包含完整的流式结束标记
      const hasMessageStop = response3.data.includes('event: message_stop');
      const hasContentBlockStop = response3.data.includes('event: content_block_stop');
      
      console.log(`📋 包含message_stop: ${hasMessageStop}`);
      console.log(`📋 包含content_block_stop: ${hasContentBlockStop}`);
      
      if (!hasMessageStop || !hasContentBlockStop) {
        console.log('⚠️  流式响应可能不完整');
      }
    } else {
      console.log(`❌ 复杂流式请求失败: ${response3.statusCode}`);
      console.log(`📄 错误: ${response3.data.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`💥 复杂流式请求异常: ${error.message}`);
  }
  
  console.log('\n🏁 流式响应诊断完成!');
  console.log('\n💡 分析结果:');
  console.log('- 如果非流式成功但流式失败，说明流式处理有问题');
  console.log('- 如果简单流式成功但复杂流式失败，说明复杂参数导致问题');
  console.log('- 如果流式响应不完整，说明连接过早断开');
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
    
    req.setTimeout(60000, () => {  // 增加超时时间
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testStreamingIssue()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
