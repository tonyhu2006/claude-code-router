// 直接测试Gemini Balance服务器
const http = require('http');

async function testDirectGeminiBalance() {
  console.log('🎯 直接测试Gemini Balance服务器...\n');
  
  // 直接发送到Gemini Balance的请求
  const directRequest = {
    messages: [
      {
        role: 'user',
        content: '你好，请用中文简短回答'
      }
    ],
    model: 'gemini-2.5-flash',
    max_tokens: 100,
    temperature: 1
  };
  
  console.log('📤 直接发送到Gemini Balance...');
  console.log('🔗 URL: http://84.8.145.89:8000/v1/chat/completions');
  console.log('📋 模型: gemini-2.5-flash');
  console.log('🔑 认证: Bearer Hjd-961207hjd');
  console.log('💬 消息: 你好，请用中文简短回答');
  console.log('─'.repeat(60));
  
  try {
    const response = await makeDirectRequest(directRequest);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      console.log('✅ 直接请求成功!');
      console.log(`📝 模型: ${data.model || 'unknown'}`);
      console.log(`💬 响应: ${data.choices?.[0]?.message?.content || '无内容'}`);
      console.log(`📊 Token: 输入${data.usage?.prompt_tokens || 0}, 输出${data.usage?.completion_tokens || 0}`);
      console.log(`🆔 请求ID: ${data.id || '无ID'}`);
      
      console.log('\n🎉 直接请求Gemini Balance成功！');
      console.log('💡 这个请求应该在您的后台管理中显示为成功');
      
    } else {
      console.log(`❌ 直接请求失败: HTTP ${response.statusCode}`);
      console.log(`📄 错误详情:`);
      console.log(response.data);
      
      console.log('\n🔍 这说明问题在Gemini Balance服务器端:');
      console.log('1. 检查Gemini Balance服务器状态');
      console.log('2. 检查访问密码是否正确');
      console.log('3. 检查模型名称是否支持');
    }
  } catch (error) {
    console.log(`💥 直接请求异常: ${error.message}`);
    console.log('\n🔍 可能的问题:');
    console.log('1. 网络连接问题');
    console.log('2. Gemini Balance服务器离线');
    console.log('3. 防火墙阻止连接');
  }
  
  // 等待3秒
  console.log('\n⏳ 等待3秒后测试通过Claude Code Router...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 通过Claude Code Router测试
  console.log('\n📤 通过Claude Code Router发送...');
  console.log('🔗 URL: http://127.0.0.1:3456/v1/messages');
  console.log('─'.repeat(60));
  
  try {
    const routerResponse = await makeRouterRequest();
    
    if (routerResponse.statusCode === 200) {
      const data = JSON.parse(routerResponse.data);
      console.log('✅ 通过Router请求成功!');
      console.log(`📝 模型: ${data.model || 'unknown'}`);
      console.log(`💬 响应: ${data.content?.[0]?.text || '无内容'}`);
      console.log(`📊 Token: 输入${data.usage?.input_tokens || 0}, 输出${data.usage?.output_tokens || 0}`);
      console.log(`🆔 请求ID: ${data.id || '无ID'}`);
      
      console.log('\n🎉 通过Router请求也成功！');
      console.log('💡 两个请求都成功，说明系统工作正常');
      
    } else {
      console.log(`❌ 通过Router请求失败: HTTP ${routerResponse.statusCode}`);
      console.log(`📄 错误详情:`);
      console.log(routerResponse.data);
    }
  } catch (error) {
    console.log(`💥 通过Router请求异常: ${error.message}`);
  }
}

function makeDirectRequest(requestData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestData);
    
    const options = {
      hostname: '84.8.145.89',
      port: 8000,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Bearer Hjd-961207hjd'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
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

function makeRouterRequest() {
  return new Promise((resolve, reject) => {
    const requestData = {
      model: 'gemini-balance,gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: '你好，请用中文简短回答'
        }
      ],
      max_tokens: 100
    };
    
    const postData = JSON.stringify(requestData);
    
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
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
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
testDirectGeminiBalance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
