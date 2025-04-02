class ConfigManager extends class_437 {
    static LOGGER = LoggerFactory.getLogger("ai-player");
    parent;
    dropdownMenuWidget;
    aiPlayerConfigModel = new AIPlayerConfigModel();

    constructor(title, parent) {
        super(title);
        this.parent = parent;
    }

    method25426() {
        let modelList = [];

        try {
            modelList = getLanguageModels.get();
        } catch (error) {
            ConfigManager.LOGGER.error("{}", error);
        }
        
        

        const dropdownMenuWidget = new DropdownMenuWidget(100, 40, 200, 20, class_2561.method30163("List of available models"), modelList);
        this.dropdownMenuWidget = dropdownMenuWidget;
        this.method25429(dropdownMenuWidget);
        
        const closeButton = class_4185.method46430(class_2561.method30163("Close"), (btn) => {
            this.method25419();
        }).method46434(this.field_22789 - 120, 40, 120, 20).method46431();
        
        const saveButton = class_4185.method46430(class_2561.method30163("Save"), (btn) => {
            this.saveToFile();
            if (this.field_22787 != null) {
                this.field_22787.method1566().method1999(class_370.method29047(this.field_22787, class_9037.field_47583, class_2561.method30163("Settings saved!"), class_2561.method30163("Saved settings.")));
            }
        }).method46434(this.field_22789 - 150, 200, 120, 20).method46431();
        
        this.method37063(closeButton);
        this.method37063(dropdownMenuWidget);
        this.method37063(saveButton);
    }

    method25394(context, mouseX, mouseY, delta) {
        super.method25394(context, mouseX, mouseY, delta);
        const yellow = -256;
        const white = -1;
        const green = -16711936;
        const red = -65536;
        const contextField = this.field_22793;

        context.method51433(contextField, "AI-Player Mod configuration Menu", 140, 20 - 9 - 10, white, true);
        context.method51433(contextField, "Select Language Model", 5, this.dropdownMenuWidget.method46427() + 5, yellow, true);
        context.method51433(contextField, "Currently selected language model: " + AIPlayer.CONFIG.selectedLanguageModel(), 100, this.dropdownMenuWidget.method46427() + 30, green, true);
        context.method51433(contextField, "After changing the selected language model, you will need to restart the game!", 20, this.dropdownMenuWidget.method46427() + 60, red, true);
    }

    method25419() {
        if (this.field_22787 != null) {
            this.field_22787.method1507(this.parent);
        }
    }

    saveToFile() {
        const modelName = this.dropdownMenuWidget.getSelectedOption();
        console.log(modelName);
        this.aiPlayerConfigModel.setSelectedLanguageModel(modelName);
        AIPlayer.CONFIG.selectedLanguageModel(modelName);
        AIPlayer.CONFIG.save();
        this.method25419();

        if (this.field_22787 != null) {
            this.field_22787.method1507(new ConfigManager(class_2561.method43473(), this.parent));
        }
    }
}