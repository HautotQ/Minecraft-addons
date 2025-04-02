const LOGGER = console; // Using console for logging
const MAX_CHAT_LENGTH = 100;

function chooseFormatterRandom() {
    const givenList = ["§9", "§b", "§d", "§e", "§6", "§5", "§c", "§7"];
    const rand = Math.floor(Math.random() * givenList.length);
    return givenList[rand];
}

function splitMessage(message) {
    const messages = [];
    const sentences = message.split(/(?<=[.!?])\s*/);
    let currentMessage = "";

    for (const sentence of sentences) {
        if (currentMessage.length + sentence.length + 1 > MAX_CHAT_LENGTH) {
            messages.push(currentMessage.trim());
            currentMessage = "";
        }

        if (currentMessage) {
            currentMessage += " ";
        }

        currentMessage += sentence;
    }

    if (currentMessage) {
        messages.push(currentMessage.trim());
    }

    return messages;
}

function sendChatMessages(source, message) {
    const messages = splitMessage(message);
    const sendMessages = async () => {
        for (const msg of messages) {
            try {
                const formatter = chooseFormatterRandom();
                await source.method_9211().method_3734().method_44252(source, "/say " + formatter + msg);
                await new Promise(resolve => setTimeout(resolve, 2500));
            } catch (error) {
                LOGGER.error(error.message);
            }
        }
    };
    sendMessages();
}