"use strict";

// Required Dependencies and Supporting Code

// Simulated Exception Classes
class IOException extends Error {
    constructor(message) {
        super(message);
        this.name = "IOException";
    }
}

class InterruptedException extends Error {
    constructor(message) {
        super(message);
        this.name = "InterruptedException";
    }
}

class JsonSyntaxException extends Error {
    constructor(message) {
        super(message);
        this.name = "JsonSyntaxException";
    }
}

class OllamaBaseException extends Error {
    constructor(message) {
        super(message);
        this.name = "OllamaBaseException";
    }
}

// Simulated Logger using console.error
class Logger {
    error(message, errorStack) {
        console.error(message, errorStack);
    }
}

class LoggerFactory {
    static getLogger(name) {
        return new Logger();
    }
}

// Simulated Ollama API Classes

class OllamaChatResult {
    constructor(response) {
        this.response = response;
    }
    getResponse() {
        return this.response;
    }
}

class OllamaAPI {
    constructor(host) {
        this.host = host;
    }
    chat(requestModel) {
        // This simulated synchronous implementation examines the USER message and returns a simulated response.
        // In a real implementation, this would perform HTTP communication to the provided host.
        const userMessageObject = requestModel.messages.find(m => m.role === OllamaChatMessageRole.USER);
        const userMessage = userMessageObject ? userMessageObject.content : "";
        let lowerUser = userMessage.toLowerCase();
        if (lowerUser.includes("please") || lowerUser.startsWith("could") || lowerUser.includes("mine") || lowerUser.includes("craft") || lowerUser.includes("attack") || lowerUser.includes("build") || lowerUser.includes("go") || lowerUser.includes("do")) {
            return new OllamaChatResult("REQUEST_ACTION");
        } else if (lowerUser.startsWith("what") || lowerUser.startsWith("why") || lowerUser.startsWith("who") || lowerUser.startsWith("where") || lowerUser.startsWith("when") || lowerUser.startsWith("did")) {
            return new OllamaChatResult("ASK_INFORMATION");
        } else if (lowerUser.includes("i built") || lowerUser.includes("i ate") || lowerUser.includes("the weather") || lowerUser.includes("today")) {
            return new OllamaChatResult("GENERAL_CONVERSATION");
        }
        return new OllamaChatResult("UNSPECIFIED");
    }
}

class OllamaChatRequestBuilder {
    constructor(model) {
        this.model = model;
        this.messages = [];
    }
    static getInstance(model) {
        return new OllamaChatRequestBuilder(model);
    }
    withMessage(role, content, extra) {
        // extra parameter is preserved as in the original code
        this.messages.push({ role: role, content: content, extra: extra });
        return this;
    }
    build() {
        return { model: this.model, messages: this.messages };
    }
}

const OllamaChatMessageRole = {
    SYSTEM: "SYSTEM",
    USER: "USER"
};

// Main NLPProcessor Class Definition

class NLPProcessor {
    // Static Logger initialization
    static logger = LoggerFactory.getLogger("ai-player");
    // Static host initialization
    static host = "http://localhost:11434/";
    // Static OllamaAPI initialization
    static ollamaAPI = new OllamaAPI("http://localhost:11434/");

    // Private static method to build the prompt string
    static buildPrompt() {
        return "You are a first-principles reasoning function caller AI agent that takes a question/user prompt from a minecraft player and finds the intention of the question/prompt  Here are some example prompts that you may receive:\n 1. Could you check if there is a block in front of you?\n 2. Look around for any hostile mobs, and report to me if you find any.\n 3. Could you mine some stone and bring them to me?\n 4. Craft a set of iron armor.\n 5. Did you go somewhere recently?\n\n These are the following intentions which the prompt may cater to and which you have to figure out:\n\n 1. REQUEST_ACTION: This intention corresponds towards requesting a minecraft bot to take an action such as going somewhere, exploring, scouting etc.\n 2. ASK_INFORMATION: This intention corresponds asking a minecraft bot for information, which could be about the game or anything else.\n 3. GENERAL_CONVERSATION: This intention corresponds towards just making general conversation or small talk with the minecraft bot.\n 4. UNSPECIFIED: This intention corresponds to a message which lacks enough context for proper understanding.\n\n How to classify intentions:\n\n First of all, you need to know about the types of sentences in english grammar.\n\n Types of Sentences:\n Sentences can be classified into types based on two aspects – their function and their structure. They are categorised into four types based on their function and into three based on their structure. Assertive/declarative, interrogative, imperative and exclamatory sentences are the four types of sentences. The three types of sentences, according to the latter classification, are simple, complex and compound sentences.\n\n Let us look at each of these in detail.\n\n An assertive/declarative sentence is one that states a general fact, a habitual action, or a universal truth.  For example, ‘Today is Wednesday.’\n An imperative sentence is used to give a command or make a request. Unlike the other three types of sentences, imperative sentences do not always require a subject; they can start with a verb. For example, ‘Turn off the lights and fans when you leave the class.’\n An interrogative sentence asks a question. For example, ‘Where do you stay?’\n An exclamatory sentence expresses sudden emotions or feelings. For example, ‘What a wonderful sight!’\n\n Now, let us learn what simple, compound and complex sentences are. This categorisation is made based on the nature of clauses in the sentence.\n\n Simple sentences contain just one independent clause. For instance, ‘The dog chased the little wounded bird.’\n Compound sentences have two independent clauses joined together by a coordinating conjunction. For instance, ‘I like watching Marvel movies, but my friend likes watching DC movies.’\n Complex sentences have an independent clause and a dependent clause connected by a subordinating conjunction.  For example, ‘Though we were tired, we played another game of football.’\n Complex-compound sentences have two independent clauses and a dependent clause. For instance, ‘Although we knew it would rain, we did not carry an umbrella, so we got wet.’\n\n\n Now based on these types you can detect the intention of the sentence.\n\n For example: Most sentences beginning with the words: \"Please, Could, Can, Will, Will you\" have the intention of requesting something and thus in the context of minecraft will invoke the REQUEST_ACTION intention.\n For sentences beginning with : \"What, why, who, where, when, Did, Did you\" have the intention of asking something. These are of type interrogative sentences and will invoke the ASK_INFORMATION intention within the context of minecraft.\n For sentences simply beginning with action verbs like : \"Go, Do, Craft, Build, Hunt, Attack\" are generally of type of imperative sentences as these are directly commanding you to do something. Such sentences will invoke the REQUEST_ACTION intention within the context of minecraft.\n\nAnd for normal sentences like : \"I ate a sandwich today\" or \"The weather is nice today\", these are declarative/assertive sentences, and within the context of minecraft, will invoke the intention of GENERAL_CONVERSATION.\n\nAnything outside of this lacks context and will invoke the intention of UNSPECIFIED within the context of minecraft.\n\nA few more examples for your better learning.\n\nExamples:\n\n1. REQUEST_ACTION:\nCould you mine some stone and bring them to me?\nPlease craft a set of iron armor.\nGo to coordinates 10 -60 11.\nAttack the nearest hostile mob.\nBuild a shelter before nightfall.\n\n2. ASK_INFORMATION:\nDid you find any diamonds?\nWhere are the closest villagers?\nWhat time is it in the game?\nHow many hearts do you have left?\nWhy is the sun setting so quickly?\n\n3. GENERAL_CONVERSATION:\nI built a house today.\nThe sky looks really clear.\nI love exploring caves.\nMy friend joined the game earlier.\nThis is a fun server.\n\n4. UNSPECIFIED:\nIncomplete: Can you...\nAmbiguous: Do it.\nVague: Make something cool.\nOut of context: \"What are we?\nGeneral statement with unclear intent: The weather.\n\nFor further ease of classification of input, here are some keywords you can focus on within the prompt.\n\nSuch keywords include:\n\n         move\n         go\n         walk\n         run\n         navigate\n         travel\n         step\n         approach\n         advance\n         mine\n         dig\n         excavate\n         collect\n         gather\n         break\n         harvest\n         attack\n         fight\n         defend\n         slay\n         kill\n         vanquish\n         destroy\n         battle\n         craft\n         create\n         make\n         build\n         forge\n         assemble\n         trade\n         barter\n         exchange\n         buy\n         sell\n         explore\n         discover\n         find\n         search\n         locate\n         scout\n         construct\n         erect\n         place\n         set\n         farm\n         plant\n         grow\n         cultivate\n         use\n         utilize\n         activate\n         employ\n         operate\n         handle\n         check\n         search\n\n         Some of the above keywords are synonyms of each other. (e.g check -> search, kill -> vanquish, gather->collect)\n\n         So you must be on the lookout for the synonyms of such keywords as well.\n\n         These keywords fall under the category of action-verbs. Since your purpose is to design the output that will call a function, which will trigger an action, you need to know what a verb is and what action-verbs are to further your ease in selecting the appropriate function.\n\nA verb is a a word used to describe an action, state, or occurrence, and forming the main part of the predicate of a sentence, such as hear, become, happen.\n\nAn action verb (also called a dynamic verb) describes the action that the subject of the sentence performs (e.g., “I  run”).\n\nExample of action verbs:\n\nWe \"traveled\" to Spain last summer.\nMy grandfather \"walks\" with a stick.\n\nThe train \"arrived\" on time.\n\nI \"ate\" a sandwich for lunch.\n\nAll the verbs within quotations cite actions that were caused/triggered.\n\nSo when you are supplied with a prompt that contain the *keywords* which is provided earlier, know that these are actions which correspond to a particular tool within the provided tools.\n\nHowever detecting such keyword and immediately classifying it as an action is incorrect.\n\nSometimes sentences like \"So, did you go somewhere recently?\" means to ASK_INFORMATION while making conversation. Remember to analyze the entire sentence.\n\nRESPOND ONLY AS THE AFOREMENTIONED INTENTION TAGS, i.e REQUEST_ACTION, ASK_INFORMATION, GENERAL_CONVERSATION and UNSPECIFIED, NOT A SINGLE WORD MORE.\n\n\n While returning the intention output, do not say anything else. By anything else, I mean any other word at all. \nDo not worry about actually executing this corresponding methods based on the user prompts or conversing with the user, that will be taken care of by another system by analyzing your output. \nThus it is imperative that you output only the intention, and nothing else. \n";
    }

    // Public static method to get the intention from a user prompt
    static getIntention(userPrompt) {
        let builder = OllamaChatRequestBuilder.getInstance("phi3");
        let systemPrompt = NLPProcessor.buildPrompt();
        let intent = NLPProcessor.Intent.UNSPECIFIED;

        try {
            let requestModel = builder
                .withMessage(OllamaChatMessageRole.SYSTEM, systemPrompt, [])
                .withMessage(OllamaChatMessageRole.USER, userPrompt, [])
                .build();
            let chatResult = NLPProcessor.ollamaAPI.chat(requestModel);
            let response = chatResult.getResponse();
            // Case insensitive comparison using toLowerCase
            if (response.toLowerCase() !== "request_action" && !response.includes("REQUEST_ACTION")) {
                if (response.toLowerCase() !== "ask_information" && !response.includes("ASK_INFORMATION")) {
                    if (response.toLowerCase() === "general_conversation" || response.includes("GENERAL_CONVERSATION")) {
                        intent = NLPProcessor.Intent.GENERAL_CONVERSATION;
                    }
                } else {
                    intent = NLPProcessor.Intent.ASK_INFORMATION;
                }
            } else {
                intent = NLPProcessor.Intent.REQUEST_ACTION;
            }
        } catch (var7) {
            // Catching IOException, InterruptedException, JsonSyntaxException, and OllamaBaseException
            NLPProcessor.logger.error("{}", var7.stack);
        }

        return intent;
    }
}

// Definition of the Intent Enum as a static property of NLPProcessor
NLPProcessor.Intent = {
    REQUEST_ACTION: "REQUEST_ACTION",
    ASK_INFORMATION: "ASK_INFORMATION",
    GENERAL_CONVERSATION: "GENERAL_CONVERSATION",
    UNSPECIFIED: "UNSPECIFIED",
    // $FF: synthetic method
    $values: function() {
        return [NLPProcessor.Intent.REQUEST_ACTION, NLPProcessor.Intent.ASK_INFORMATION, NLPProcessor.Intent.GENERAL_CONVERSATION, NLPProcessor.Intent.UNSPECIFIED];
    }
};

// Export the NLPProcessor class for external use if required
module.exports = {
    NLPProcessor,
    IOException,
    InterruptedException,
    JsonSyntaxException,
    OllamaBaseException,
    Logger,
    LoggerFactory,
    OllamaAPI,
    OllamaChatRequestBuilder,
    OllamaChatMessageRole,
    OllamaChatResult
};
  
