class ModelNameChecker {
    static LOGGER = console; // Using console for logging
 
    static isValidModelName(modelName) {
       const fields = Object.keys(OllamaModelType); // Assuming OllamaModelType is an object
       for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
 
          try {
             if (OllamaModelType[field] === modelName) {
                return true;
             }
          } catch (error) {
             ModelNameChecker.LOGGER.error("Model does not exist: " + error.message);
          }
       }
 
       return false;
    }
 }