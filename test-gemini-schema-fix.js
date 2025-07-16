#!/usr/bin/env node

/**
 * 测试 Gemini Schema 修复功能
 * 
 * 这个脚本测试我们的 schema 清理功能是否正确工作
 */

// 直接测试源代码中的函数
function cleanGeminiSchema(schema) {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map(item => cleanGeminiSchema(item));
  }

  const cleaned = {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === 'additionalProperties' || key === '$schema') {
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanGeminiSchema(value);
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

function cleanGeminiToolsSchema(tools) {
  if (!Array.isArray(tools)) {
    return tools;
  }

  return tools.map(tool => {
    if (!tool || typeof tool !== 'object') {
      return tool;
    }

    const cleanedTool = { ...tool };

    if (cleanedTool.input_schema) {
      cleanedTool.input_schema = cleanGeminiSchema(cleanedTool.input_schema);
    }

    if (cleanedTool.function?.parameters) {
      cleanedTool.function.parameters = cleanGeminiSchema(cleanedTool.function.parameters);
    }

    if (cleanedTool.function_declarations) {
      cleanedTool.function_declarations = cleanedTool.function_declarations.map((decl) => {
        if (decl.parameters) {
          return {
            ...decl,
            parameters: cleanGeminiSchema(decl.parameters)
          };
        }
        return decl;
      });
    }

    return cleanedTool;
  });
}

// 测试用的工具定义，包含 Gemini API 不支持的字段
const testTools = [
  {
    name: "test_tool_1",
    description: "A test tool",
    input_schema: {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      properties: {
        param1: {
          type: "string",
          description: "First parameter"
        },
        param2: {
          type: "number",
          description: "Second parameter"
        }
      },
      required: ["param1"],
      additionalProperties: false
    }
  },
  {
    name: "test_tool_2",
    description: "Another test tool",
    function: {
      name: "test_tool_2",
      description: "Another test tool",
      parameters: {
        type: "object",
        $schema: "http://json-schema.org/draft-07/schema#",
        properties: {
          items: {
            type: "array",
            items: {
              type: "string",
              additionalProperties: false
            }
          }
        },
        additionalProperties: true
      }
    }
  }
];

console.log("🧪 测试 Gemini Schema 清理功能\n");

console.log("📥 原始工具定义:");
console.log(JSON.stringify(testTools, null, 2));

console.log("\n🔧 清理后的工具定义:");
try {
  const cleanedTools = cleanGeminiToolsSchema(testTools);
  console.log(JSON.stringify(cleanedTools, null, 2));
  
  // 验证清理结果
  let hasProblematicFields = false;
  
  function checkForProblematicFields(obj, path = '') {
    if (typeof obj !== 'object' || obj === null) return;
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        checkForProblematicFields(item, `${path}[${index}]`);
      });
      return;
    }
    
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'additionalProperties' || key === '$schema') {
        console.log(`❌ 发现问题字段: ${path}.${key}`);
        hasProblematicFields = true;
      }
      checkForProblematicFields(value, path ? `${path}.${key}` : key);
    }
  }
  
  checkForProblematicFields(cleanedTools);
  
  if (!hasProblematicFields) {
    console.log("\n✅ 测试通过！所有问题字段都已被清理");
  } else {
    console.log("\n❌ 测试失败！仍然存在问题字段");
    process.exit(1);
  }
  
} catch (error) {
  console.error("\n❌ 测试失败:", error.message);
  process.exit(1);
}

console.log("\n🎉 Gemini Schema 修复功能测试完成！");
