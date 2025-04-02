// This code uses OllamaAPI to retrieve language models from the Ollama server.
class GetLanguageModels {
    static async get() {
       const modelSet = new Set();
       if (!ollamaClient.pingOllamaServer()) {
          throw new ollamaNotReachableException("Ollama Server is not reachable!");
       } else {
          const host = "http://localhost:11434/";
          const ollamaAPI = new OllamaAPI(host);
 
          let models;
          try {
             models = await ollamaAPI.listModels();
          } catch (error) {
             throw new Error(error);
          }
 
          for (const model of models) {
             modelSet.add(model.getModelName());
          }
 
          return Array.from(modelSet);
       }
    }
 }