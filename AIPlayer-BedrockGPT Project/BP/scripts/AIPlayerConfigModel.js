// This code is translated from Java to JavaScript using a class-based structure.
class AIPlayerConfigModel {
    constructor() {
        this.modelList = [];
        this.selectedLanguageModel = '';
        AIPlayerConfigModel.selectedModel = '';
        this.BotGameProfile = new Map();

        try {
            this.modelList = this.getLanguageModels();
            AIPlayerConfigModel.selectedModel = this.modelList[0];
            this.selectedLanguageModel = AIPlayerConfigModel.selectedModel;
        } catch (error) {
            console.error(error.message);
        }
    }

    getLanguageModels() {
        // This method should return a list of language models.
        // Implement the logic to fetch language models here.
        return ['model1', 'model2', 'model3'];
    }

    getSelectedLanguageModel() {
        return this.selectedLanguageModel;
    }

    setSelectedLanguageModel(selectedLanguageModel) {
        AIPlayerConfigModel.selectedModel = selectedLanguageModel;
    }

    getBotGameProfile() {
        return this.BotGameProfile;
    }

    setBotGameProfile(botGameProfile) {
        this.BotGameProfile = botGameProfile;
    }
}