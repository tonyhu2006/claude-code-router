// 监控所有到代理服务器的请求
const http = require('http');

console.log('🔍 开始监控代理服务器请求...');
console.log('监听端口: 3456');
console.log('时间:', new Date().toLocaleString());
console.log('─'.repeat(80));

// 创建一个简单的HTTP服务器来拦截请求
const server = http.createServer((req, res) => {
  const timestamp = new Date().toLocaleString();
  
  console.log(`\n📡 [${timestamp}] 收到请求:`);
  console.log(`🔗 方法: ${req.method}`);
  console.log(`🔗 URL: ${req.url}`);
  console.log(`🔗 Headers:`);
  
  Object.entries(req.headers).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    if (body) {
      console.log(`📄 请求体 (前500字符):`);
      console.log(body.substring(0, 500));
      if (body.length > 500) {
        console.log('...(截断)');
      }
    }
    
    console.log('─'.repeat(80));
    
    // 返回一个简单的响应，表示我们收到了请求
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version'
    });
    
    res.end(JSON.stringify({
      message: 'Request received by monitor',
      timestamp: timestamp,
      method: req.method,
      url: req.url
    }));
  });
});

server.listen(3457, () => {
  console.log('🚀 监控服务器启动在端口 3457');
  console.log('💡 要测试ccr code是否发送请求，请：');
  console.log('1. 修改环境变量 ANTHROPIC_API_URL=http://127.0.0.1:3457');
  console.log('2. 重新启动ccr code');
  console.log('3. 发送一个测试消息');
  console.log('\n等待请求...\n');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\n🛑 监控服务器关闭');
  server.close();
  process.exit(0);
});
