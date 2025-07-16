// 最终并发测试 - 验证修复效果
const http = require('http');

async function finalConcurrentTest() {
  console.log('🎯 最终并发测试 - 验证修复效果\n');
  
  const requests = [
    {
      model: 'ollama,qwen2.5-coder:7b',
      messages: [{ role: 'user', content: [{ type: 'text', text: '用一句话介绍Python' }] }],
      stream: true,
      label: 'Python介绍'
    },
    {
      model: 'ollama,qwen2.5-coder:7b', 
      messages: [{ role: 'user', content: [{ type: 'text', text: '用一句话介绍JavaScript' }] }],
      stream: true,
      label: 'JavaScript介绍'
    },
    {
      model: 'gemini-balance,gemini-2.5-flash',
      messages: [{ role: 'user', content: [{ type: 'text', text: '用一句话介绍Go语言' }] }],
      stream: true,
      label: 'Go语言介绍'
    }
  ];
  
  console.log('📤 发送3个并发请求...');
  console.log('- Ollama: Python介绍');
  console.log('- Ollama: JavaScript介绍'); 
  console.log('- Gemini Balance: Go语言介绍\n');
  
  try {
    const results = await Promise.all(
      requests.map((req, index) => makeRequest(req, index + 1))
    );
    
    console.log('\n🎯 测试结果:');
    results.forEach((result, index) => {
      console.log(`请求${index + 1} (${requests[index].label}): ${result.statusCode}`);
    });
    
    const allSuccess = results.every(r => r.statusCode === 200);
    
    if (allSuccess) {
      console.log('\n✅ 所有请求都成功!');
      console.log('\n📊 响应内容分析:');
      
      results.forEach((result, index) => {
        const content = extractContent(result.data);
        console.log(`\n${requests[index].label}:`);
        console.log(`长度: ${content.length} 字符`);
        console.log(`预览: ${content.substring(0, 100)}...`);
      });
      
      console.log('\n🎉 并发处理修复验证成功!');
    } else {
      console.log('\n❌ 部分请求失败');
    }
    
  } catch (error) {
    console.error('💥 测试异常:', error.message);
  }
}

function extractContent(streamData) {
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

function makeRequest(requestData, requestNum) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestData);
    
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
    
    console.log(`🚀 发送请求${requestNum}...`);
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ 请求${requestNum}完成`);
        resolve({
          statusCode: res.statusCode,
          data: responseData
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ 请求${requestNum}错误:`, error.message);
      reject(error);
    });
    
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error(`请求${requestNum} timeout`));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
finalConcurrentTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
