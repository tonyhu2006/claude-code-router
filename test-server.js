// 简单的测试服务器来诊断Claude Code连接问题
const http = require('http');

const server = http.createServer((req, res) => {
  console.log('\n🔍 收到请求:');
  console.log(`📡 方法: ${req.method}`);
  console.log(`🌐 URL: ${req.url}`);
  console.log(`📋 Headers:`);
  Object.entries(req.headers).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    if (body) {
      console.log(`📄 Body:`);
      console.log(body);
    }
    
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, anthropic-version, x-api-key');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    if (req.url === '/v1/messages' && req.method === 'POST') {
      console.log('✅ 这是一个Claude API请求!');
      
      // 解析请求体
      let requestData;
      try {
        requestData = JSON.parse(body);
        console.log(`💬 用户消息: ${requestData.messages?.[0]?.content || '无内容'}`);
      } catch (error) {
        console.log('❌ 无法解析请求体');
      }
      
      // 检查是否是流式请求
      const isStream = requestData?.stream === true;
      console.log(`🌊 流式请求: ${isStream ? '是' : '否'}`);
      
      if (isStream) {
        // 返回流式响应
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.writeHead(200);
        
        // 发送流式事件
        res.write('event: message_start\n');
        res.write('data: {"type":"message_start","message":{"id":"test-123","type":"message","role":"assistant","content":[],"model":"test-model","stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":1,"output_tokens":1}}}\n\n');
        
        res.write('event: content_block_start\n');
        res.write('data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}\n\n');
        
        res.write('event: content_block_delta\n');
        res.write('data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello! 这是来自测试服务器的响应。"}}\n\n');
        
        res.write('event: content_block_stop\n');
        res.write('data: {"type":"content_block_stop","index":0}\n\n');
        
        res.write('event: message_delta\n');
        res.write('data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"input_tokens":1,"output_tokens":10}}\n\n');
        
        res.write('event: message_stop\n');
        res.write('data: {"type":"message_stop"}\n\n');
        
        res.end();
        console.log('✅ 发送了流式响应');
      } else {
        // 返回非流式响应
        const response = {
          id: 'test-123',
          type: 'message',
          role: 'assistant',
          model: 'test-model',
          content: [
            {
              type: 'text',
              text: 'Hello! 这是来自测试服务器的响应。'
            }
          ],
          stop_reason: 'end_turn',
          stop_sequence: null,
          usage: {
            input_tokens: 1,
            output_tokens: 10
          }
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(response));
        console.log('✅ 发送了非流式响应');
      }
    } else {
      console.log('❓ 未知请求');
      res.writeHead(404);
      res.end('Not Found');
    }
    
    console.log('─'.repeat(60));
  });
});

server.listen(3456, '127.0.0.1', () => {
  console.log('🧪 测试服务器启动在 http://127.0.0.1:3456');
  console.log('📡 等待Claude Code的连接...');
  console.log('💡 请在Claude Code中发送消息来测试连接');
  console.log('─'.repeat(60));
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 关闭测试服务器...');
  server.close(() => {
    console.log('✅ 测试服务器已关闭');
    process.exit(0);
  });
});
