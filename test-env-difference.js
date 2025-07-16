// 测试环境变量差异
const { spawn } = require('child_process');
const http = require('http');

async function testEnvDifference() {
  console.log('🔍 测试环境变量差异...\n');
  
  // 测试1: 使用ANTHROPIC_API_KEY (我们之前的测试)
  console.log('1️⃣ 测试使用 ANTHROPIC_API_KEY...');
  await testWithEnv({
    ANTHROPIC_API_KEY: 'test',
    ANTHROPIC_BASE_URL: 'http://127.0.0.1:3456'
  });
  
  // 测试2: 使用ANTHROPIC_AUTH_TOKEN (ccr code使用的)
  console.log('\n2️⃣ 测试使用 ANTHROPIC_AUTH_TOKEN...');
  await testWithEnv({
    ANTHROPIC_AUTH_TOKEN: 'test',
    ANTHROPIC_BASE_URL: 'http://127.0.0.1:3456'
  });
  
  // 测试3: 模拟真实的ccr code启动
  console.log('\n3️⃣ 模拟真实的 ccr code 启动...');
  await testRealCcrCode();
}

async function testWithEnv(envVars) {
  return new Promise((resolve) => {
    console.log('📋 环境变量:', envVars);
    
    // 创建一个简单的测试脚本
    const testScript = `
      const http = require('http');
      
      const options = {
        hostname: '127.0.0.1',
        port: 3456,
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test'
        }
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log('Status:', res.statusCode);
          if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log('Success! Response ID:', response.id);
          } else {
            console.log('Error:', data.substring(0, 100));
          }
        });
      });
      
      req.on('error', (error) => {
        console.log('Request error:', error.message);
      });
      
      const requestData = {
        model: 'gemini-balance,gemini-2.5-flash',
        messages: [{ role: 'user', content: 'test env vars' }],
        max_tokens: 50
      };
      
      req.write(JSON.stringify(requestData));
      req.end();
    `;
    
    const child = spawn('node', ['-e', testScript], {
      env: { ...process.env, ...envVars },
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      console.log(`✅ 测试完成，退出码: ${code}`);
      resolve();
    });
  });
}

async function testRealCcrCode() {
  return new Promise((resolve) => {
    console.log('🎯 启动真实的 claude 命令...');
    
    const env = {
      ...process.env,
      ANTHROPIC_AUTH_TOKEN: "test",
      ANTHROPIC_BASE_URL: "http://127.0.0.1:3456",
      API_TIMEOUT_MS: "600000",
    };
    
    console.log('📋 使用的环境变量:');
    console.log('   ANTHROPIC_AUTH_TOKEN:', env.ANTHROPIC_AUTH_TOKEN);
    console.log('   ANTHROPIC_BASE_URL:', env.ANTHROPIC_BASE_URL);
    console.log('   API_TIMEOUT_MS:', env.API_TIMEOUT_MS);
    
    // 尝试启动claude命令（如果安装了的话）
    const claude = spawn('claude', ['--version'], {
      env: env,
      stdio: 'pipe'
    });
    
    let output = '';
    claude.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    claude.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    claude.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Claude 命令可用:', output.trim());
        console.log('💡 这说明环境变量设置正确');
      } else {
        console.log('❌ Claude 命令不可用或有问题');
        console.log('📄 输出:', output.trim());
      }
      resolve();
    });
    
    claude.on('error', (error) => {
      console.log('❌ 无法启动 claude 命令:', error.message);
      console.log('💡 这可能是因为 Claude Code 没有安装或不在 PATH 中');
      resolve();
    });
  });
}

// 运行测试
testEnvDifference()
  .then(() => {
    console.log('\n🏁 所有测试完成！');
    console.log('\n💡 关键发现:');
    console.log('1. ccr code 使用 ANTHROPIC_AUTH_TOKEN 而不是 ANTHROPIC_API_KEY');
    console.log('2. 这可能导致认证方式的差异');
    console.log('3. Claude Code 可能有特殊的请求处理逻辑');
    process.exit(0);
  })
  .catch((error) => {
    console.error('测试失败:', error);
    process.exit(1);
  });
