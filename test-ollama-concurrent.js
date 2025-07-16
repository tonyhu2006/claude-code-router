// 测试Ollama并发请求问题修复
const http = require('http');

async function testOllamaConcurrent() {
  console.log('🧪 测试Ollama并发请求修复...\n');
  
  // 创建两个并发请求
  const request1 = {
    model: 'ollama,qwen2.5-coder:7b',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '写一个简单的Python函数计算阶乘'
          }
        ]
      }
    ],
    stream: true
  };
  
  const request2 = {
    model: 'ollama,qwen2.5-coder:7b',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '写一个简单的JavaScript函数计算斐波那契数列'
          }
        ]
      }
    ],
    stream: true
  };
  
  console.log('📤 发送两个并发请求...');
  
  try {
    // 并发发送两个请求
    const [response1, response2] = await Promise.all([
      makeRequest(request1, '请求1'),
      makeRequest(request2, '请求2')
    ]);
    
    console.log('\n🎯 测试结果:');
    console.log(`请求1状态: ${response1.statusCode}`);
    console.log(`请求2状态: ${response2.statusCode}`);
    
    if (response1.statusCode === 200 && response2.statusCode === 200) {
      console.log('\n✅ 两个请求都成功!');
      
      // 检查响应内容是否混乱
      const content1 = extractStreamContent(response1.data);
      const content2 = extractStreamContent(response2.data);
      
      console.log('\n📝 请求1内容预览:');
      console.log(content1.substring(0, 200) + '...');
      
      console.log('\n📝 请求2内容预览:');
      console.log(content2.substring(0, 200) + '...');
      
      // 检查内容是否合理
      const content1HasPython = content1.toLowerCase().includes('python') || content1.includes('def ');
      const content2HasJavaScript = content2.toLowerCase().includes('javascript') || content2.includes('function ');
      
      console.log('\n🔍 内容检查:');
      console.log(`请求1包含Python相关内容: ${content1HasPython}`);
      console.log(`请求2包含JavaScript相关内容: ${content2HasJavaScript}`);
      
      if (content1HasPython && content2HasJavaScript) {
        console.log('\n🎉 修复成功! 并发请求内容没有混乱!');
      } else {
        console.log('\n⚠️  内容可能仍有混乱，需要进一步检查');
      }
    } else {
      console.log('\n❌ 部分请求失败');
    }
  } catch (error) {
    console.error('💥 测试异常:', error.message);
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

function makeRequest(data, label) {
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
    
    console.log(`🚀 发送${label}...`);
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ ${label}完成`);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${label}错误:`, error.message);
      reject(error);
    });
    
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error(`${label} timeout`));
    });
    
    req.write(postData);
    req.end();
  });
}

// 运行测试
testOllamaConcurrent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
