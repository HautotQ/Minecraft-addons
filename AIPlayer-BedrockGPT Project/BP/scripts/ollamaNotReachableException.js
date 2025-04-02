class OllamaNotReachableException extends Error {
    constructor(message) {
        super(message);
        this.name = "OllamaNotReachableException";
    }
}