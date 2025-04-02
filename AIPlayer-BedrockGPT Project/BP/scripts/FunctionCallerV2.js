import { OllamaAPI } from "ollama-api"; // Placeholder for actual import
import { SQLiteDB } from "./SQLiteDB"; // Placeholder for actual import
import { GoTo } from "./GoTo"; // Placeholder for actual import
import { Logger } from "some-logger-library"; // Placeholder for actual import
import { JsonUtils } from "./JsonUtils"; // Placeholder for actual import

const logger = new Logger("ai-player");
let botSource = null;
const DB_URL = "sqlite:./sqlite_databases/memory_agent.db";
const host = "http://localhost:11434/";
const ollamaAPI = new OllamaAPI("http://localhost:11434/");
let functionOutput = null;

class FunctionCallerV2 {
    constructor(source) {
        botSource = source;
        ollamaAPI.setRequestTimeoutSeconds(90);
    }

    static getCurrentDateandTime() {
        return new Date().toISOString();
    }

    static getMovementOutput(movementMethod) {
        functionOutput = String(movementMethod);
    }

    static getBlockCheckOutput(blockCheckMethod) {
        functionOutput = String(blockCheckMethod);
    }

    static toolBuilder() {
        const functions = [];
        functions.push(this.buildFunction("goTo", "Move to a specific set of x y z coordinates", [
            this.buildParameter("x", "The x-axis coordinate"),
            this.buildParameter("y", "The y-axis coordinate"),
            this.buildParameter("z", "The z-axis coordinate"),
        ]));
        functions.push(this.buildFunction("searchBlock", "Check or search for a block in a particular direction", [
            this.buildParameter("direction", "The direction to check (front, behind, left, right)"),
        ]));
        const toolMap = { functions };
        return JSON.stringify(toolMap);
    }

    static buildFunction(name, description, parameters) {
        return { name, description, parameters };
    }

    static buildParameter(name, description) {
        return { name, description, required: true };
    }

    static buildPrompt(toolString) {
        return `You are a first-principles reasoning function caller AI agent that takes a question/user prompt from a minecraft player and finds the most appropriate tool or tools to execute, along with the parameters required to run the tool in the context of minecraft. Here are some example prompts that you may receive: 
        1. Could you check if there is a block in front of you? 
        2. Look around for any hostile mobs, and report to me if you find any. 
        3. Could you mine some stone and bring them to me? 
        4. Craft a set of iron armor. 

        A few more variations of the prompts may be: 
        "Could you search for blocks in front of you?"
        "Do you see if there is a block in front of you?"
        "Can you mine some stone and bring them to me?"
        "Please move to 10 -60 20." or "Please go to the coords 10 -60 20" or "Please go to 10 -60 20" and so on... 

        PLEASE REMEMBER TO CORRECTLY ANALYZE THE PROMPT. You have a history of committing silly mistakes like producing a json output which calls the movement method when the user asks you to check something.

        To minimize such errors, you must focus on the keywords to look for in the user prompts and then match them against the tool names that you have been provided.

        Such keywords include:
        move, go, walk, run, navigate, travel, step, approach, advance, mine, dig, excavate, collect, gather, break, harvest, attack, fight, defend, slay, kill, vanquish, destroy, battle, craft, create, make, build, forge, assemble, trade, barter, exchange, buy, sell, explore, discover, find, search, locate, scout, construct, erect, place, set, farm, plant, grow, cultivate, use, utilize, activate, employ, operate, handle, check, search 

        Some of the above keywords are synonyms of each other. (e.g check -> search, kill -> vanquish, gather->collect)

        So you must be on the lookout for the synonyms of such keywords as well.

        These keywords fall under the category of action-verbs. Since your purpose is to design the output that will call a function, which will trigger an action, you need to know what a verb is and what action-verbs are to further your ease in selecting the appropriate function.

        A verb is a a word used to describe an action, state, or occurrence, and forming the main part of the predicate of a sentence, such as hear, become, happen.

        An action verb (also called a dynamic verb) describes the action that the subject of the sentence performs (e.g., “I  run”).

        Example of action verbs:
        We "traveled" to Spain last summer.
        My grandfather "walks" with a stick.
        The train "arrived" on time.
        I "ate" a sandwich for lunch.

        All the verbs within quotations cite actions that were caused/triggered.
        
        So when you are supplied with a prompt that contain the *keywords* which is provided earlier, know that these are actions which correspond to a particular tool within the provided tools.
        
        Respond as JSON using the following schema: 
        {"functionName": "function name", "parameters": [{"parameterName": "name of parameter", "parameterValue": "value of parameter"}]}
        Return the json with proper indentation so that there are no parsing errors. DO NOT modify the json field names. It is absolutely imperative that the field names are NOT MODIFIED. 
        The tools are: ${toolString} 
        While returning the json output, do not say anything else. By anything else, I mean any other word at all. 
        Do not worry about actually executing this function, that will be taken care of by another system by analyzing your JSON output. 
        Thus it is imperative that you output only the JSON, and nothing else.`;
    }

    static async generatePromptContext(userPrompt) {
        const sysPrompt = `You are a context generation AI agent in terms of minecraft. This means that you will have a prompt from a user, who is the player and you need to analyze the context of the player's prompts, i.e what the player means by the prompt. Here are some example player prompts you may receive: 
        1. Could you check if there is a block in front of you? 
        2. Look around for any hostile mobs, and report to me if you find any. 
        3. Could you mine some stone and bring them to me? 
        4. Craft a set of iron armor. 
        5. Please go to coordinates 10 -60 20. 

        A few more variations of the prompts may be: 
        "Could you search for blocks in front of you?"
        "Do you see if there is a block in front of you?"
        "Can you mine some stone and bring them to me?"
        "Please move to 10 -60 20." or "Please go to the coords 10 -60 20" or "Please go to 10 -60 20" and so on... 

        Here are some examples of the format in which you MUST answer.
        1. The player asked you to check whether there is a block in front of you or not. 
        2. The player asked you to search for hostile mobs around you, and to report to the player if you find any such hostile mob. 
        3. The player asked you to mine some stone and then bring the stone to the player. 
        4. The player asked you to craft a set of iron armor. 
        5. The player asked you to go to coordinates 10 -60 20. You followed the instructions and began movement to the coordinates.
        
        Remember that all the context you generate should be in the past tense, since it is being recorded after the deed has been done.
        
        Remember that when dealing with prompts that ask the bot to go to a specific set of x y z coordinates, you MUST NOT alter the coordinates, they SHOULD BE the exact same as in the prompt given by the player.
        
        Now, remember that you must only generate the context as stated in the examples, nothing more, nothing less. DO NOT add your own opinions/statements/thinking to the context you generate. 

        Remember that if you generate incorrect context then the bot will not be able to understand what the user has asked of it.`;
        
        const requestModel = {
            messages: [
                { role: "system", content: sysPrompt },
                { role: "user", content: `Player prompt: ${userPrompt}` }
            ]
        };
        
        try {
            const chatResult = await ollamaAPI.chat(requestModel);
            return chatResult.response;
        } catch (error) {
            logger.error(error);
        }
    }

    static async run(userPrompt) {
        const systemPrompt = this.buildPrompt(this.toolBuilder());
        const requestModel = {
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        };

        try {
            const chatResult = await ollamaAPI.chat(requestModel);
            const response = chatResult.response;
            this.executeFunction(userPrompt, response);
        } catch (error) {
            logger.error("Error while running function caller task: ", error);
        }
    }

    static executeFunction(userInput, response) {
        const executionDateTime = this.getCurrentDateandTime();

        try {
            const cleanedResponse = JsonUtils.cleanJsonString(response);
            console.log("Cleaned JSON Response: " + cleanedResponse);
            const jsonObject = JSON.parse(cleanedResponse);
            const functionName = jsonObject.functionName;
            const parameters = jsonObject.parameters;
            const parameterMap = new Map();
            const params = [];

            for (const parameter of parameters) {
                const paramName = parameter.parameterName;
                const paramValue = parameter.parameterValue;
                params.push(`${paramName}=${paramValue}`);
                parameterMap.set(paramName, paramValue);
            }

            console.log("Params: " + String(params));
            console.log("Parameter Map: " + String(parameterMap));
            const result = `Executed ${functionName} with parameters ${String(params)}`;
            this.callFunction(functionName, parameterMap).then(() => {
                this.getFunctionResultAndSave(userInput, executionDateTime);
            });
            console.log(result);
        } catch (error) {
            console.error("Error processing JSON response: " + error.message);
        }
    }

    static async getFunctionResultAndSave(userInput, executionDateTime) {
        try {
            const eventContext = await this.generatePromptContext(userInput);
            const eventEmbedding = await ollamaAPI.generateEmbeddings("nomic-embed-text", userInput);
            const eventContextEmbedding = await ollamaAPI.generateEmbeddings("nomic-embed-text", eventContext);

            while (functionOutput == null || typeof functionOutput !== 'string') {
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            console.log("Received output: " + functionOutput);
            const resultEmbedding = await ollamaAPI.generateEmbeddings("nomic-embed-text", functionOutput);
            const executionRecord = new ExecutionRecord(
                executionDateTime,
                userInput,
                eventContext,
                functionOutput,
                eventEmbedding,
                eventContextEmbedding,
                resultEmbedding
            );
            await executionRecord.updateRecords();
            functionOutput = null;
            console.log("Event data saved successfully.");
        } catch (error) {
            logger.error("Error occurred while processing the function result: ", error);
        }
    }

    static callFunction(functionName, paramMap) {
        return new Promise((resolve) => {
            switch (functionName) {
                case "searchBlock":
                    const direction = paramMap.get("direction");
                    this.Tools.searchBlock(direction);
                    break;
                case "goTo":
                    const x = parseInt(paramMap.get("x"));
                    const y = parseInt(paramMap.get("y"));
                    const z = parseInt(paramMap.get("z"));
                    console.log("Calling method: goTo");
                    this.Tools.goTo(x, y, z);
                    break;
            }
            resolve();
        });
    }

    static Tools = class {
        static goTo(x, y, z) {
            console.log("Going to coordinates " + x + " " + y + " " + z);
            if (!botSource) {
                console.log("Bot not found.");
            } else {
                this.getMovementOutput(GoTo.goTo(botSource, x, y, z));
            }
        }

        static searchBlock(direction) {
            switch (direction) {
                case "front":
                    console.log("Checking for block in front");
                    this.getBlockCheckOutput(RayCasting.detect(botSource.method_44023()));
                    break;
                case "behind":
                    console.log("Rotating..");
                    console.log("Checking for block behind");
                    break;
                case "left":
                    console.log("Rotating..");
                    console.log("Checking for block in left");
                    break;
                case "right":
                    console.log("Rotating..");
                    console.log("Checking for block in right");
                    break;
            }
        }
    }
}

class ExecutionRecord {
    constructor(timestamp, command, context, result, eventEmbedding, eventContextEmbedding, eventResultEmbedding) {
        this.timestamp = timestamp;
        this.command = command;
        this.context = context;
        this.result = result;
        this.eventEmbedding = eventEmbedding;
        this.eventContextEmbedding = eventContextEmbedding;
        this.eventResultEmbedding = eventResultEmbedding;
    }

    async updateRecords() {
        try {
            await SQLiteDB.storeEventWithEmbedding(DB_URL, this.command, this.context, this.result, this.eventEmbedding, this.eventContextEmbedding, this.eventResultEmbedding);
        } catch (error) {
            logger.error("Caught exception: ", error);
            throw error;
        }
    }
}