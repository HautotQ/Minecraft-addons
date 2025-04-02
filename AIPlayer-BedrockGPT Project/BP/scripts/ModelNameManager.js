function getModelType(modelName) {
    let var2 = -1;

    switch (modelName) {
        case "starcoder":
            var2 = 37;
            break;
        case "medllama2":
            var2 = 39;
            break;
        case "stable-code":
            var2 = 40;
            break;
        case "bakllava":
            var2 = 42;
            break;
        case "nous-hermes2":
            var2 = 56;
            break;
        case "wizardlm-uncensored":
            var2 = 41;
            break;
        case "llama2-uncensored":
            var2 = 12;
            break;
        case "samantha-mistral":
            var2 = 49;
            break;
        case "yarn-llama2":
            var2 = 55;
            break;
        case "orca-mini":
            var2 = 15;
            break;
        case "wizard-math":
            var2 = 31;
            break;
        case "alfred":
            var2 = 66;
            break;
        case "wizardcoder":
            var2 = 24;
            break;
        case "codeup":
            var2 = 38;
            break;
        case "falcon":
            var2 = 30;
            break;
        case "gemma2":
            var2 = 1;
            break;
        case "open-orca-platypus2":
            var2 = 59;
            break;
        case "codebooga":
            var2 = 60;
            break;
        case "codellama":
            var2 = 9;
            break;
        case "codestral":
            var2 = 73;
            break;
        case "llama2":
            var2 = 2;
            break;
        case "llama3":
            var2 = 3;
            break;
        case "sqlcoder":
            var2 = 46;
            break;
        case "meditron":
            var2 = 51;
            break;
        case "vicuna":
            var2 = 18;
            break;
        case "wizardlm":
            var2 = 68;
            break;
        case "xwinlm":
            var2 = 69;
            break;
        case "zephyr":
            var2 = 20;
            break;
        case "nomic-embed-text":
            var2 = 64;
            break;
        case "everythinglm":
            var2 = 43;
            break;
        case "openchat":
            var2 = 28;
            break;
        case "duckdb-nsql":
            var2 = 71;
            break;
        case "tinydolphin":
            var2 = 32;
            break;
        case "wizard-vicuna-uncensored":
            var2 = 19;
            break;
        case "dolphin-mistral":
            var2 = 17;
            break;
        case "dolphin-mixtral":
            var2 = 10;
            break;
        case "all-minilm":
            var2 = 72;
            break;
        case "yi":
            var2 = 34;
            break;
        case "phi":
            var2 = 13;
            break;
        case "phi3":
            var2 = 14;
            break;
        case "qwen":
            var2 = 22;
            break;
        case "llava-phi3":
            var2 = 7;
            break;
        case "gemma":
            var2 = 0;
            break;
        case "llava":
            var2 = 6;
            break;
        case "notus":
            var2 = 70;
            break;
        case "notux":
            var2 = 65;
            break;
        case "orca2":
            var2 = 29;
            break;
        case "qwen2":
            var2 = 23;
            break;
        case "solar":
            var2 = 44;
            break;
        case "phind-codellama":
            var2 = 27;
            break;
        case "goliath":
            var2 = 63;
            break;
        case "yarn-mixtral":
            var2 = 47;
            break;
        case "starling-lm":
            var2 = 36;
            break;
        case "stable-beluga":
            var2 = 45;
            break;
        case "nexusraven":
            var2 = 62;
            break;
        case "stablelm-zephyr":
            var2 = 50;
            break;
        case "neural-chat":
            var2 = 8;
            break;
        case "deepseek-coder":
            var2 = 16;
            break;
        case "llama-pro":
            var2 = 58;
            break;
        case "llama2-chinese":
            var2 = 25;
            break;
        case "megadolphin":
            var2 = 67;
            break;
        case "openhermes":
            var2 = 21;
            break;
        case "deepseek-llm":
            var2 = 57;
            break;
        case "mistral":
            var2 = 4;
            break;
        case "mixtral":
            var2 = 5;
            break;
        case "wizard-vicuna":
            var2 = 52;
            break;
        case "mistral-openorca":
            var2 = 11;
            break;
        case "dolphin-phi":
            var2 = 35;
            break;
        case "nous-hermes":
            var2 = 33;
            break;
        case "tinyllama":
            var2 = 26;
            break;
        case "stablelm2":
            var2 = 53;
            break;
        case "nous-hermes2-mixtral":
            var2 = 48;
            break;
        case "mistrallite":
            var2 = 61;
            break;
        case "magicoder":
            var2 = 54;
            break;
    }

    switch (var2) {
        case 0:
            return "gemma";
        case 1:
            return "gemma2";
        case 2:
            return "llama2";
        case 3:
            return "llama3";
        case 4:
            return "mistral";
        case 5:
            return "mixtral";
        case 6:
            return "llava";
        case 7:
            return "llava-phi3";
        case 8:
            return "neural-chat";
        case 9:
            return "codellama";
        case 10:
            return "dolphin-mixtral";
        case 11:
            return "mistral-openorca";
        case 12:
            return "llama2-uncensored";
        case 13:
            return "phi";
        case 14:
            return "phi3";
        case 15:
            return "orca-mini";
        case 16:
            return "deepseek-coder";
        case 17:
            return "dolphin-mistral";
        case 18:
            return "vicuna";
        case 19:
            return "wizard-vicuna-uncensored";
        case 20:
            return "zephyr";
        case 21:
            return "openhermes";
        case 22:
            return "qwen";
        case 23:
            return "qwen2";
        case 24:
            return "wizardcoder";
        case 25:
            return "llama2-chinese";
        case 26:
            return "tinyllama";
        case 27:
            return "phind-codellama";
        case 28:
            return "openchat";
        case 29:
            return "orca2";
        case 30:
            return "falcon";
        case 31:
            return "wizard-math";
        case 32:
            return "tinydolphin";
        case 33:
            return "nous-hermes";
        case 34:
            return "yi";
        case 35:
            return "dolphin-phi";
        case 36:
            return "starling-lm";
        case 37:
            return "starcoder";
        case 38:
            return "codeup";
        case 39:
            return "medllama2";
        case 40:
            return "stable-code";
        case 41:
            return "wizardlm-uncensored";
        case 42:
            return "bakllava";
        case 43:
            return "everythinglm";
        case 44:
            return "solar";
        case 45:
            return "stable-beluga";
        case 46:
            return "sqlcoder";
        case 47:
            return "yarn-mistral";
        case 48:
            return "nous-hermes2-mixtral";
        case 49:
            return "samantha-mistral";
        case 50:
            return "stablelm-zephyr";
        case 51:
            return "meditron";
        case 52:
            return "wizard-vicuna";
        case 53:
            return "stablelm2";
        case 54:
            return "magicoder";
        case 55:
            return "yarn-llama2";
        case 56:
            return "nous-hermes2";
        case 57:
            return "deepseek-llm";
        case 58:
            return "llama-pro";
        case 59:
            return "open-orca-platypus2";
        case 60:
            return "codebooga";
        case 61:
            return "mistrallite";
        case 62:
            return "nexusraven";
        case 63:
            return "goliath";
        case 64:
            return "nomic-embed-text";
        case 65:
            return "notux";
        case 66:
            return "alfred";
        case 67:
            return "megadolphin";
        case 68:
            return "wizardlm";
        case 69:
            return "xwinlm";
        case 70:
            return "notus";
        case 71:
            return "duckdb-nsql";
        case 72:
            return "all-minilm";
        case 73:
            return "codestral";
        default:
            throw new Error("Unknown model name: " + modelName);
    }
}
