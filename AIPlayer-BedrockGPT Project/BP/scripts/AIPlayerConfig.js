// Framework: JavaScript

class AIPlayerConfig {
    constructor(janksonBuilder = null) {
        this.keys = new AIPlayerConfig.Keys();
        this.modelList = this.optionForKey(this.keys.modelList);
        this.selectedLanguageModel = this.optionForKey(this.keys.selectedLanguageModel);
        this.selectedModel = this.optionForKey(this.keys.selectedModel);
        this.LOGGER = this.optionForKey(this.keys.LOGGER);
        this.BotGameProfile = this.optionForKey(this.keys.BotGameProfile);

        if (janksonBuilder) {
            // Apply the janksonBuilder if provided
            janksonBuilder(this);
        }
    }

    static createAndLoad() {
        const wrapper = new AIPlayerConfig();
        wrapper.load();
        return wrapper;
    }

    static createAndLoadWithBuilder(janksonBuilder) {
        const wrapper = new AIPlayerConfig(janksonBuilder);
        wrapper.load();
        return wrapper;
    }

    modelList() {
        return this.modelList.value();
    }

    setModelList(value) {
        this.modelList.set(value);
    }

    selectedLanguageModel() {
        return this.selectedLanguageModel.value();
    }

    setSelectedLanguageModel(value) {
        this.selectedLanguageModel.set(value);
    }

    selectedModel() {
        return this.selectedModel.value();
    }

    setSelectedModel(value) {
        this.selectedModel.set(value);
    }

    getLogger() {
        return this.LOGGER.value();
    }

    setLogger(value) {
        this.LOGGER.set(value);
    }

    getBotGameProfile() {
        return this.BotGameProfile.value();
    }

    setBotGameProfile(value) {
        this.BotGameProfile.set(value);
    }

    static Keys = class {
        constructor() {
            this.modelList = new Key("modelList");
            this.selectedLanguageModel = new Key("selectedLanguageModel");
            this.selectedModel = new Key("selectedModel");
            this.LOGGER = new Key("LOGGER");
            this.BotGameProfile = new Key("BotGameProfile");
        }
    }
}