<<<<<<<
/**



 * Gemini Schema Transformer



 * 



 * 解决 Gemini API 不支持 JSON Schema 中的 additionalProperties 和 $schema 字段的问题



 * 这个 transformer 会在请求发送到 Gemini API 之前清理这些不兼容的字段



 */







export interface Transformer {



  name: string;



  transformRequestIn(request: any): any;



  transformResponseOut?(response: Response): Promise<Response>;



}







/**



 * 递归清理 JSON Schema 对象，移除 Gemini API 不支持的字段



 * @param schema - 要清理的 schema 对象



 * @returns 清理后的 schema 对象



 */



function cleanGeminiSchema(schema: any): any {



  if (!schema || typeof schema !== 'object') {



    return schema;



  }







  // 如果是数组，递归处理每个元素



  if (Array.isArray(schema)) {



    return schema.map(item => cleanGeminiSchema(item));



  }







  // 创建新对象，排除不支持的字段



  const cleaned: any = {};



  



  for (const [key, value] of Object.entries(schema)) {



    // 跳过 Gemini API 不支持的字段



    if (key === 'additionalProperties' || key === '$schema') {



      continue;



    }



    



    // 递归清理嵌套对象



    if (typeof value === 'object' && value !== null) {



      cleaned[key] = cleanGeminiSchema(value);



    } else {



      cleaned[key] = value;



    }



  }



  



  return cleaned;



}







/**



 * 清理工具定义中的 schema



 * @param tools - 工具定义数组



 * @returns 清理后的工具定义数组



 */



function cleanToolsSchema(tools: any[]): any[] {



  if (!Array.isArray(tools)) {



    return tools;



  }







  return tools.map(tool => {



    if (!tool || typeof tool !== 'object') {



      return tool;



    }







    const cleanedTool = { ...tool };







    // 清理 input_schema (Anthropic 格式)



    if (cleanedTool.input_schema) {



      cleanedTool.input_schema = cleanGeminiSchema(cleanedTool.input_schema);



    }







    // 清理 function.parameters (OpenAI 格式)



    if (cleanedTool.function?.parameters) {



      cleanedTool.function.parameters = cleanGeminiSchema(cleanedTool.function.parameters);



    }







    // 清理 function_declarations (Gemini 格式)



    if (cleanedTool.function_declarations) {



      cleanedTool.function_declarations = cleanedTool.function_declarations.map((decl: any) => {



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







export class GeminiSchemaTransformer implements Transformer {



  name = "gemini-schema-cleaner";







  transformRequestIn(request: any): any {



    // 创建请求的深拷贝以避免修改原始对象



    const cleanedRequest = JSON.parse(JSON.stringify(request));







    // 清理工具定义中的 schema



    if (cleanedRequest.tools && Array.isArray(cleanedRequest.tools)) {



      cleanedRequest.tools = cleanToolsSchema(cleanedRequest.tools);



    }







    return cleanedRequest;



  }







  async transformResponseOut(response: Response): Promise<Response> {



    // 对于 Gemini API，通常不需要修改响应



    // 但保留这个方法以备将来需要



    return response;



  }



}







export default GeminiSchemaTransformer;



=======
/**

 * Gemini Schema Transformer

 * 

 * 解决 Gemini API 不支持 JSON Schema 中的 additionalProperties 和 $schema 字段的问题

 * 这个 transformer 会在请求发送到 Gemini API 之前清理这些不兼容的字段

 */



export interface Transformer {

  name: string;

  transformRequestIn(request: any): any;

  transformResponseOut?(response: Response): Promise<Response>;

}



/**

 * 递归清理 JSON Schema 对象，移除 Gemini API 不支持的字段

 * @param schema - 要清理的 schema 对象

 * @returns 清理后的 schema 对象

 */

function cleanGeminiSchema(schema: any): any {

  if (!schema || typeof schema !== 'object') {

    return schema;

  }



  // 如果是数组，递归处理每个元素

  if (Array.isArray(schema)) {

    return schema.map(item => cleanGeminiSchema(item));

  }



  // 创建新对象，排除不支持的字段

  const cleaned: any = {};

  

  for (const [key, value] of Object.entries(schema)) {

    // 跳过 Gemini API 不支持的字段

    if (key === 'additionalProperties' || key === '$schema') {

      continue;

    }

    

    // 递归清理嵌套对象

    if (typeof value === 'object' && value !== null) {

      cleaned[key] = cleanGeminiSchema(value);

    } else {

      cleaned[key] = value;

    }

  }

  

  return cleaned;

}



/**

 * 清理工具定义中的 schema

 * @param tools - 工具定义数组

 * @returns 清理后的工具定义数组

 */

function cleanToolsSchema(tools: any[]): any[] {

  if (!Array.isArray(tools)) {

    return tools;

  }



  return tools.map(tool => {

    if (!tool || typeof tool !== 'object') {

      return tool;

    }



    const cleanedTool = { ...tool };



    // 清理 input_schema (Anthropic 格式)

    if (cleanedTool.input_schema) {

      cleanedTool.input_schema = cleanGeminiSchema(cleanedTool.input_schema);

    }



    // 清理 function.parameters (OpenAI 格式)

    if (cleanedTool.function?.parameters) {

      cleanedTool.function.parameters = cleanGeminiSchema(cleanedTool.function.parameters);

    }



    // 清理 function_declarations (Gemini 格式)

    if (cleanedTool.function_declarations) {

      cleanedTool.function_declarations = cleanedTool.function_declarations.map((decl: any) => {

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



export class GeminiSchemaTransformer implements Transformer {

  name = "gemini-schema-cleaner";



  transformRequestIn(request: any): any {

    // 创建请求的深拷贝以避免修改原始对象

    const cleanedRequest = JSON.parse(JSON.stringify(request));



    // 清理工具定义中的 schema

    if (cleanedRequest.tools && Array.isArray(cleanedRequest.tools)) {

      cleanedRequest.tools = cleanToolsSchema(cleanedRequest.tools);

    }



    return cleanedRequest;

  }



  async transformResponseOut(response: Response): Promise<Response> {

    // 对于 Gemini API，通常不需要修改响应

    // 但保留这个方法以备将来需要

    return response;

  }

}



export default GeminiSchemaTransformer;

>>>>>>>
