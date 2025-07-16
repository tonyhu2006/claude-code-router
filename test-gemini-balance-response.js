// 测试Gemini Balance响应格式
const http = require('http');

async function testGeminiBalanceResponse() {
  console.log('🔍 测试Gemini Balance响应格式...\n');
  
  // 测试1: 非流式响应
  console.log('1️⃣ 测试非流式响应...');
  try {
    const response = await makeDirectRequest({
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: '简短回答：你好'
        }
      ],
      max_tokens: 50,
      stream: false  // 非流式
    });
    
    console.log('✅ 非流式响应成功!');
    console.log('📄 响应状态:', response.statusCode);
    console.log('📋 响应头:', JSON.stringify(response.headers, null, 2));
    console.log('📝 响应内容:', response.data.substring(0, 500));
    
    // 解析JSON响应
    try {
      const jsonData = JSON.parse(response.data);
      console.log('🔍 解析后的响应:');
      console.log('   📋 模型:', jsonData.model);
      console.log('   📋 ID:', jsonData.id);
      console.log('   📋 选择数量:', jsonData.choices?.length);
      console.log('   📋 第一个选择:', JSON.stringify(jsonData.choices?.[0], null, 2));
    } catch (parseError) {
      console.log('❌ JSON解析失败:', parseError.message);
    }
  } catch (error) {
    console.log('❌ 非流式请求失败:', error.message);
  }
  
  console.log('\n─'.repeat(60));
  
  // 测试2: 流式响应
  console.log('\n2️⃣ 测试流式响应...');
  try {
    const response = await makeDirectRequest({
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: '简短回答：你好'
        }
      ],
      max_tokens: 50,
      stream: true  // 流式
    });
    
    console.log('✅ 流式响应成功!');
    console.log('📄 响应状态:', response.statusCode);
    console.log('📋 响应头:', JSON.stringify(response.headers, null, 2));
    console.log('📝 流式数据前500字符:', response.data.substring(0, 500));
    
    // 分析流式数据格式
    const lines = response.data.split('\n');
    console.log('🔍 流式数据分析:');
    console.log('   📋 总行数:', lines.length);
    console.log('   📋 前10行:');
    lines.slice(0, 10).forEach((line, index) => {
      console.log(`     ${index + 1}: ${line}`);
    });
    
  } catch (error) {
    console.log('❌ 流式请求失败:', error.message);
  }
  
  console.log('\n🏁 测试完成!');
}

function makeDirectRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: '84.8.145.89',
      port: 8000,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Hjd-961207hjd',
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
testGeminiBalanceResponse()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
