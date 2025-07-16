<<<<<<<
import Server from "@musistudio/llms";

=======
import Server from "@musistudio/llms";

import { GeminiSchemaTransformer } from "./utils/geminiSchemaTransformer";

>>>>>>>


<<<<<<<




export const createServer = (config: any): Server => {



  const server = new Server(config);



  return server;



};



=======
export const createServer = (config: any): Server => {

  const server = new Server(config);



  // 注册自定义的 Gemini Schema Transformer

  server.registerTransformer(new GeminiSchemaTransformer());



  return server;

};

>>>>>>>
