import { OpenAI } from 'openai';
export default defineEventHandler(async (event) => {
    const body = await readMultipartFormData(event);
    const config = useRuntimeConfig()
    const apiKey =config.public.deepseekApiKey
    console.log(body,apiKey);    
    if (!body || !apiKey) {
      throw createError({ statusCode: 400, message: "无效请求" });
    }
  
    const file = body.find((part) => part.name === 'file');
    const client = new OpenAI({ apiKey, baseURL: 'https://api.deepseek.com/v1',dangerouslyAllowBrowser: true});
    try {
      const response = await client.files.create({
        file: new File([file?.data || new Uint8Array()], file?.filename || 'unknown'),
        purpose: 'assistants',
      });
      return response;
    } catch (error) {
        console.log('error',error);
    }
  });