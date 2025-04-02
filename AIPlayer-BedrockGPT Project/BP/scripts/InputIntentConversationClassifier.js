"use strict";

// Required dependencies and imports
const fetch = require('node-fetch'); // For HTTP requests

// Simulated dependency: com.google.gson.JsonSyntaxException
// In JavaScript, we will use the built-in SyntaxError as an equivalent.

// Simulated dependency: io.github.amithkoujalgi.ollama4j.core.OllamaAPI
class OllamaAPI {
    constructor(host) {
        this.host = host;
    }

    async chat(requestModel) {
        // Construct the URL for the chat endpoint
        const url = this.host + "chat";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestModel)
            });
            if (!response.ok) {
                throw new Error("Network response was not ok: " + response.statusText);
            }
            const data = await response.json();
            // Assuming the API response contains a property "response"
            return new OllamaChatResult(data.response);
        } catch (error) {
            // Wrap any error in an OllamaBaseException
            throw new OllamaBaseException(error.message);
        }
    }
}

// Simulated dependency: io.github.amithkoujalgi.ollama4j.core.exceptions.OllamaBaseException
class OllamaBaseException extends Error {
    constructor(message) {
        super(message);
        this.name = "OllamaBaseException";
    }
}

// Simulated dependency: io.github.amithkoujalgi.ollama4j.core.models.chat.OllamaChatMessageRole
const OllamaChatMessageRole = {
    SYSTEM: "SYSTEM",
    USER: "USER"
};

// Simulated dependency: io.github.amithkoujalgi.ollama4j.core.models.chat.OllamaChatRequestBuilder
class OllamaChatRequestBuilder {
    constructor(modelName) {
        this.modelName = modelName;
        this.messages = [];
    }

    static getInstance(modelName) {
        return new OllamaChatRequestBuilder(modelName);
    }

    withMessage(role, content, extras) {
        // extras is an array of strings; stored as provided
        this.messages.push({ role: role, content: content, extras: extras });
        return this;
    }

    build() {
        return new OllamaChatRequestModel(this.modelName, this.messages);
    }
}

// Simulated dependency: io.github.amithkoujalgi.ollama4j.core.models.chat.OllamaChatRequestModel
class OllamaChatRequestModel {
    constructor(modelName, messages) {
        this.modelName = modelName;
        this.messages = messages;
    }
}

// Simulated dependency: io.github.amithkoujalgi.ollama4j.core.models.chat.OllamaChatResult
class OllamaChatResult {
    constructor(response) {
        this.response = response;
    }
    getResponse() {
        return this.response;
    }
}

// Simple logger implementation similar to org.slf4j.Logger
const logger = {
    error: function(...args) {
        console.error(...args);
    }
};

class InputIntentConversationClassifier {
    // Equivalent to: private static final Logger logger = LoggerFactory.getLogger("ai-player");
    static logger = logger;
    // Equivalent to: private static final String host = "http://localhost:11434/";
    static host = "http://localhost:11434/";
    // Equivalent to: private static final OllamaAPI ollamaAPI = new OllamaAPI("http://localhost:11434/");
    static ollamaAPI = new OllamaAPI("http://localhost:11434/");

    // private static String buildPrompt() {
    static buildPrompt() {
        return "You are a first-principles reasoning intention classifier tool that takes a question/user prompt from a Minecraft player and finds the intention of the question/prompt. Here are some example prompts that you may receive:\n\n1. Hi there!\n2. Hello!\n3. So, how have you been?\n4. What a marvelous day!\n5. The sky looks beautiful?\n6. Greetings!\n\nYOUR TASK is to classify the user's intention based on their prompt. You will not respond directly to the user prompt, only classify the intention. You must respond with only one of the following tags:\n\n- GENERAL_CONVERSATION: For casual greetings, remarks, or any small talk that does not involve a request or query.\n- ASK_INFORMATION: For prompts that ask for information, typically starting with words like 'what,' 'how,' 'where,' 'when,' etc.\n- REQUEST_ACTION: For commands or requests asking the bot to perform an action, usually starting with verbs like 'go,' 'do,' 'build,' 'craft,' etc.\n- UNSPECIFIED: For prompts that lack sufficient context or are nonsensical.\n\nExamples:\n\n**GENERAL_CONVERSATION:**\n- Hi Steve!\n- The weather is nice today.\n- I built a house earlier.\n\n**ASK_INFORMATION:**\n- Did you find any diamonds?\n- How do I craft a shield?\n- Where are the closest villagers?\n\n**REQUEST_ACTION:**\n- Go to coordinates 10 -60 11.\n- Please craft a set of iron armor.\n- Build a shelter before nightfall.\n\n**UNSPECIFIED:**\n- ?\n- Huh?\n- Bananas\n\nHowever do note that sometimes what may appear to be as something, is usually not what you expect it to be.\n\nFor example, sentences starting with can, could, please and other verbs and ending with a question-mark ? may appear to be of the intention ASK_INFORMATION.\n\nHowever you must analyze the entire sentence.\n\nFor example on the context of block detection, the user may say \"Please detect if there is a block in front of you.\" This may look like ASK_INFORMATION, but in reality it is of type REQUEST_ACTION.\n\nThe fact that the intention's name is REQUEST_ACTION means that you can expect words like Please, Can, Could, Would, anything which prompts a question, even ends with a question mark, to be sometimes of type REQUEST_ACTION.\n\nSo you must analyze the entire sentence very carefully before answering.\n\nONLY respond with the intention tags (GENERAL_CONVERSATION, ASK_INFORMATION, REQUEST_ACTION, UNSPECIFIED).";
    }

    // public static InputIntentConversationClassifier.Intent getConversationIntent(String userPrompt) {
    static async getConversationIntent(userPrompt) {
        let builder = OllamaChatRequestBuilder.getInstance("gemma2");
        let systemPrompt = InputIntentConversationClassifier.buildPrompt();
        let intent = InputIntentConversationClassifier.Intent.UNSPECIFIED;
        
        try {
            let requestModel = builder
                .withMessage(OllamaChatMessageRole.SYSTEM, systemPrompt, [])
                .withMessage(OllamaChatMessageRole.USER, userPrompt, [])
                .build();
            let chatResult = await InputIntentConversationClassifier.ollamaAPI.chat(requestModel);
            let response = chatResult.getResponse();
            console.log(response);
            if (response.toLowerCase() !== "general_conversation" && !response.includes("GENERAL_CONVERSATION")) {
                if (response.toLowerCase() !== "request_action" && !response.includes("REQUEST_ACTION")) {
                    if (response.toLowerCase() === "ask_information" || response.includes("ASK_INFORMATION")) {
                        intent = InputIntentConversationClassifier.Intent.ASK_INFORMATION;
                    }
                } else {
                    intent = InputIntentConversationClassifier.Intent.REQUEST_ACTION;
                }
            } else {
                intent = InputIntentConversationClassifier.Intent.GENERAL_CONVERSATION;
            }
        } catch (var7) {
            InputIntentConversationClassifier.logger.error("{}", var7.stack);
        }
        return intent;
    }
}

// public static enum Intent {
InputIntentConversationClassifier.Intent = {
    REQUEST_ACTION: "REQUEST_ACTION",
    ASK_INFORMATION: "ASK_INFORMATION",
    GENERAL_CONVERSATION: "GENERAL_CONVERSATION",
    UNSPECIFIED: "UNSPECIFIED",
    // $FF: synthetic method
    $values: function() {
        return [
            InputIntentConversationClassifier.Intent.REQUEST_ACTION,
            InputIntentConversationClassifier.Intent.ASK_INFORMATION,
            InputIntentConversationClassifier.Intent.GENERAL_CONVERSATION,
            InputIntentConversationClassifier.Intent.UNSPECIFIED
        ];
    }
};

module.exports = InputIntentConversationClassifier;
