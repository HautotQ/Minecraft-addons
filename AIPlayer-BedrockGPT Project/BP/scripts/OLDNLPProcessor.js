// Package: net.shasankp000.ChatUtils

// No external dependencies are required for this JavaScript implementation.

// Define the OldNLPProcessor class
class OldNLPProcessor {
    // Translate: public static final Map<String, String> INTENT_KEYWORDS = Map.ofEntries(new Entry[]{...});
    static INTENT_KEYWORDS = new Map([
        ["move", "REQUEST_ACTION"],
        ["go", "REQUEST_ACTION"],
        ["walk", "REQUEST_ACTION"],
        ["run", "REQUEST_ACTION"],
        ["navigate", "REQUEST_ACTION"],
        ["travel", "REQUEST_ACTION"],
        ["step", "REQUEST_ACTION"],
        ["approach", "REQUEST_ACTION"],
        ["advance", "REQUEST_ACTION"],
        ["mine", "REQUEST_ACTION"],
        ["dig", "REQUEST_ACTION"],
        ["excavate", "REQUEST_ACTION"],
        ["collect", "REQUEST_ACTION"],
        ["gather", "REQUEST_ACTION"],
        ["break", "REQUEST_ACTION"],
        ["harvest", "REQUEST_ACTION"],
        ["attack", "REQUEST_ACTION"],
        ["fight", "REQUEST_ACTION"],
        ["defend", "REQUEST_ACTION"],
        ["slay", "REQUEST_ACTION"],
        ["kill", "REQUEST_ACTION"],
        ["vanquish", "REQUEST_ACTION"],
        ["destroy", "REQUEST_ACTION"],
        ["battle", "REQUEST_ACTION"],
        ["craft", "REQUEST_ACTION"],
        ["create", "REQUEST_ACTION"],
        ["make", "REQUEST_ACTION"],
        ["build", "REQUEST_ACTION"],
        ["forge", "REQUEST_ACTION"],
        ["assemble", "REQUEST_ACTION"],
        ["trade", "REQUEST_ACTION"],
        ["barter", "REQUEST_ACTION"],
        ["exchange", "REQUEST_ACTION"],
        ["buy", "REQUEST_ACTION"],
        ["sell", "REQUEST_ACTION"],
        ["explore", "REQUEST_ACTION"],
        ["discover", "REQUEST_ACTION"],
        ["find", "REQUEST_ACTION"],
        ["search", "REQUEST_ACTION"],
        ["locate", "REQUEST_ACTION"],
        ["scout", "REQUEST_ACTION"],
        ["construct", "REQUEST_ACTION"],
        ["erect", "REQUEST_ACTION"],
        ["place", "REQUEST_ACTION"],
        ["set", "REQUEST_ACTION"],
        ["farm", "REQUEST_ACTION"],
        ["plant", "REQUEST_ACTION"],
        ["grow", "REQUEST_ACTION"],
        ["cultivate", "REQUEST_ACTION"],
        ["use", "REQUEST_ACTION"],
        ["utilize", "REQUEST_ACTION"],
        ["activate", "REQUEST_ACTION"],
        ["employ", "REQUEST_ACTION"],
        ["operate", "REQUEST_ACTION"],
        ["handle", "REQUEST_ACTION"],
        ["what", "ASK_INFORMATION"],
        ["how", "ASK_INFORMATION"],
        ["why", "ASK_INFORMATION"],
        ["when", "ASK_INFORMATION"],
        ["who", "ASK_INFORMATION"],
        ["check", "ASK_INFORMATION"],
        ["hello", "GENERAL_CONVERSATION"],
        ["hi", "GENERAL_CONVERSATION"],
        ["hey", "GENERAL_CONVERSATION"],
        ["greetings", "GENERAL_CONVERSATION"],
        ["great", "GENERAL_CONVERSATION"],
        ["wow", "GENERAL_CONVERSATION"],
        ["marvelous", "GENERAL_CONVERSATION"],
        ["fascinating", "GENERAL_CONVERSATION"],
        ["good", "GENERAL_CONVERSATION"],
        ["so", "GENERAL_CONVERSATION"],
        ["let's", "GENERAL_CONVERSATION"],
        ["therefore", "GENERAL_CONVERSATION"]
    ]);

    // Translate: public static final Map<String, Integer> KEYWORD_CONFIDENCE = Map.ofEntries(new Entry[]{...});
    static KEYWORD_CONFIDENCE = new Map([
        ["check", 90],
        ["move", 91],
        ["attack", 92],
        ["jump", 89],
        ["sneak", 93],
        ["look", 94],
        ["turn", 94],
        ["interact", 95],
        ["wood", 80],
        ["stone", 80],
        ["iron", 80],
        ["diamond", 90],
        ["gold", 80],
        ["emerald", 85],
        ["obsidian", 85],
        ["lava", 70],
        ["water", 70],
        ["axe", 80],
        ["pickaxe", 80],
        ["shovel", 80],
        ["sword", 85],
        ["bow", 75],
        ["hoe", 70],
        ["shield", 80],
        ["armor", 80],
        ["axes", 80],
        ["pickaxes", 80],
        ["shovels", 80],
        ["swords", 85],
        ["bows", 75],
        ["hoes", 70],
        ["shields", 80],
        ["armors", 80],
        ["zombie", 85],
        ["skeleton", 85],
        ["creeper", 85],
        ["spider", 80],
        ["enderman", 90],
        ["blaze", 90],
        ["ender dragon", 95],
        ["villager", 80],
        ["pillager", 85],
        ["zombies", 85],
        ["skeletons", 85],
        ["creepers", 85],
        ["spiders", 80],
        ["endermen", 90],
        ["blazes", 90],
        ["villagers", 80],
        ["pillagers", 85],
        ["house", 70],
        ["village", 75],
        ["fortress", 85],
        ["stronghold", 90],
        ["portal", 85],
        ["tower", 75],
        ["houses", 70],
        ["villages", 75],
        ["fortresses", 85],
        ["strongholds", 90],
        ["portals", 85],
        ["towers", 75],
        ["nether", 85],
        ["end", 90],
        ["overworld", 70],
        ["mine", 80],
        ["cave", 80],
        ["build", 80],
        ["craft", 80],
        ["explore", 75],
        ["fight", 85],
        ["trade", 80],
        ["farm", 75],
        ["defend", 80],
        ["use", 75],
        ["coordinates", 90]
    ]);

    // Translate: public static final Map<String, Set<String>> SYNONYM_MAP = new HashMap();
    static SYNONYM_MAP = new Map();

    // public static Map<OldNLPProcessor.Intent, List<String>> runNlpTask(String userInput)
    static runNlpTask(userInput) {
        // Map<OldNLPProcessor.Intent, List<String>> intentsAndEntities = new HashMap();
        let intentsAndEntities = {};
        let recognizedIntent = OldNLPProcessor.recognizeIntent(userInput);
        let entitiesFromPrompt = OldNLPProcessor.extractEntities(userInput);
        intentsAndEntities[recognizedIntent] = entitiesFromPrompt;
        return intentsAndEntities;
    }

    // public static OldNLPProcessor.Intent recognizeIntent(String userInput)
    static recognizeIntent(userInput) {
        let words = userInput.split(/\s+/);
        // Map<String, Integer> intentScores = new HashMap();
        let intentScores = new Map();
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            // Iterator over INTENT_KEYWORDS.entrySet()
            for (let [keyword, intent] of OldNLPProcessor.INTENT_KEYWORDS.entries()) {
                let score = OldNLPProcessor.calculateConfidenceScore(word, keyword);
                intentScores.set(intent, (intentScores.get(intent) || 0) + score);
                if (score === 100) {
                    break;
                }
            }
        }

        // Determine the intent with maximum score; if none, default to "UNSPECIFIED"
        let recognizedIntentStr = "UNSPECIFIED";
        let maxScore = -1;
        for (let [intent, score] of intentScores.entries()) {
            if (score > maxScore) {
                maxScore = score;
                recognizedIntentStr = intent;
            }
        }

        // byte var13 = -1;
        let var13 = -1;
        // switch(recognizedIntent.hashCode()) { ... }
        if (recognizedIntentStr === "REQUEST_ACTION") {
            var13 = 0;
        } else if (recognizedIntentStr === "ASK_INFORMATION") {
            var13 = 1;
        } else if (recognizedIntentStr === "GENERAL_CONVERSATION") {
            var13 = 2;
        }

        let var10000;
        switch (var13) {
            case 0:
                var10000 = OldNLPProcessor.Intent.REQUEST_ACTION;
                break;
            case 1:
                var10000 = OldNLPProcessor.Intent.ASK_INFORMATION;
                break;
            case 2:
                var10000 = OldNLPProcessor.Intent.GENERAL_CONVERSATION;
                break;
            default:
                var10000 = OldNLPProcessor.Intent.UNSPECIFIED;
        }
        return var10000;
    }

    // private static List<String> extractEntities(String userInput)
    static extractEntities(userInput) {
        let words = userInput.split(/\s+/);
        // List<String> entities = new ArrayList();
        let entities = [];
        let minConfidenceThreshold = 50;
        let foundCoordinates = false;
        // List<String> coordinates = new ArrayList();
        let coordinates = [];
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            for (let [keyword, conf] of OldNLPProcessor.KEYWORD_CONFIDENCE.entries()) {
                let score = OldNLPProcessor.calculateConfidenceScore(word, keyword);
                if (score >= minConfidenceThreshold) {
                    let coordsSynonymsMap = OldNLPProcessor.SYNONYM_MAP.get("coordinates");
                    let coordsSynonymsList = Array.from(coordsSynonymsMap);
                    let coordsDetected = entities.some(entity => {
                        return coordsSynonymsList.includes(entity.toLowerCase());
                    });
                    if (coordsDetected) {
                        foundCoordinates = true;
                    } else {
                        entities.push(keyword);
                    }
                    break;
                }
            }
            if (foundCoordinates && /^-?\d+$/.test(word)) {
                coordinates.push(word);
            }
        }
        if (coordinates.length > 0) {
            entities.push("coordinates");
            entities = entities.concat(coordinates);
        }
        return entities;
    }

    // private static int calculateConfidenceScore(String word, String keyword)
    static calculateConfidenceScore(word, keyword) {
        if (word.toLowerCase() === keyword.toLowerCase()) {
            return 100;
        } else {
            return OldNLPProcessor.areSynonyms(word, keyword) ? 80 : 0;
        }
    }

    // public static boolean areSynonyms(String word1, String word2)
    static areSynonyms(word1, word2) {
        word1 = word1.toLowerCase();
        word2 = word2.toLowerCase();
        if (word1 === word2) {
            return true;
        } else if (OldNLPProcessor.SYNONYM_MAP.has(word2)) {
            return OldNLPProcessor.SYNONYM_MAP.get(word2).has(word1);
        } else {
            return OldNLPProcessor.SYNONYM_MAP.has(word1) ? OldNLPProcessor.SYNONYM_MAP.get(word1).has(word2) : false;
        }
    }

    // Static initialization block to populate SYNONYM_MAP
    static {
        OldNLPProcessor.SYNONYM_MAP.set("move", new Set(["move", "go", "walk", "run", "travel", "proceed", "advance", "head", "step", "march", "explore"]));
        OldNLPProcessor.SYNONYM_MAP.set("stop", new Set(["halt", "pause", "cease", "stand", "stay", "wait"]));
        OldNLPProcessor.SYNONYM_MAP.set("attack", new Set(["defeat", "fight", "strike", "assault", "hit", "battle", "destroy", "kill", "slay"]));
        OldNLPProcessor.SYNONYM_MAP.set("defend", new Set(["protect", "guard", "shield", "block", "secure"]));
        OldNLPProcessor.SYNONYM_MAP.set("gather", new Set(["collect", "harvest", "pick", "fetch", "acquire", "accumulate", "obtain"]));
        OldNLPProcessor.SYNONYM_MAP.set("mine", new Set(["dig", "excavate", "extract", "gather"]));
        OldNLPProcessor.SYNONYM_MAP.set("craft", new Set(["build", "construct", "make", "create", "forge"]));
        OldNLPProcessor.SYNONYM_MAP.set("explore", new Set(["discover", "search", "find", "locate", "uncover", "reveal", "investigate", "scout"]));
        OldNLPProcessor.SYNONYM_MAP.set("check", new Set(["check", "inspect", "examine", "observe", "survey", "review"]));
        OldNLPProcessor.SYNONYM_MAP.set("use", new Set(["activate", "operate", "apply", "utilize"]));
        OldNLPProcessor.SYNONYM_MAP.set("talk", new Set(["speak", "communicate", "chat", "converse", "discuss"]));
        OldNLPProcessor.SYNONYM_MAP.set("trade", new Set(["exchange", "barter", "buy", "sell", "deal"]));
        OldNLPProcessor.SYNONYM_MAP.set("front", new Set(["ahead", "forward", "in front"]));
        OldNLPProcessor.SYNONYM_MAP.set("back", new Set(["behind", "reverse", "retreat"]));
        OldNLPProcessor.SYNONYM_MAP.set("left", new Set(["port", "side", "to the left"]));
        OldNLPProcessor.SYNONYM_MAP.set("right", new Set(["starboard", "to the right", "side"]));
        OldNLPProcessor.SYNONYM_MAP.set("up", new Set(["above", "over", "ascend", "rise", "elevate"]));
        OldNLPProcessor.SYNONYM_MAP.set("down", new Set(["below", "under", "descend", "drop", "fall"]));
        OldNLPProcessor.SYNONYM_MAP.set("hello", new Set(["hi", "hey", "greetings", "salutations", "howdy"]));
        OldNLPProcessor.SYNONYM_MAP.set("goodbye", new Set(["bye", "farewell", "see you", "later", "take care"]));
        OldNLPProcessor.SYNONYM_MAP.set("thanks", new Set(["thank you", "appreciate it", "grateful", "much obliged"]));
        OldNLPProcessor.SYNONYM_MAP.set("yes", new Set(["yeah", "yep", "affirmative", "sure", "okay"]));
        OldNLPProcessor.SYNONYM_MAP.set("no", new Set(["nope", "negative", "nah", "not really"]));
        OldNLPProcessor.SYNONYM_MAP.set("weather", new Set(["climate", "conditions", "forecast", "temperature"]));
        OldNLPProcessor.SYNONYM_MAP.set("day", new Set(["morning", "afternoon", "sunrise", "sunset"]));
        OldNLPProcessor.SYNONYM_MAP.set("night", new Set(["evening", "dark", "dusk", "midnight"]));
        OldNLPProcessor.SYNONYM_MAP.set("coordinates", new Set(["coordinates", "coords", "co-ordinates"]));
    }

    // public static enum Intent
    static Intent = {
        REQUEST_ACTION: "REQUEST_ACTION",
        ASK_INFORMATION: "ASK_INFORMATION",
        GENERAL_CONVERSATION: "GENERAL_CONVERSATION",
        UNSPECIFIED: "UNSPECIFIED",
        // $FF: synthetic method
        $values: function() {
            return [
                OldNLPProcessor.Intent.REQUEST_ACTION,
                OldNLPProcessor.Intent.ASK_INFORMATION,
                OldNLPProcessor.Intent.GENERAL_CONVERSATION,
                OldNLPProcessor.Intent.UNSPECIFIED
            ];
        }
    }
}

export { OldNLPProcessor };
