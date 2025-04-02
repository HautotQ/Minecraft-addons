class RAGImplementation {
    static logger = console; // Using console for logging
    static gameDir;
    static host = "http://localhost:11434";
    static ollamaAPI;

    static parseEmbedding(embeddingString) {
        const embedding = [];
        if (embeddingString != null) {
            const parts = embeddingString.split(",");
            for (let part of parts) {
                embedding.push(parseFloat(part));
            }
        }
        return embedding;
    }

    static findRelevantConversations(queryEmbedding, conversations, topN) {
        for (let conv of conversations) {
            const promptSimilarity = this.calculateCosineSimilarity(queryEmbedding, conv.promptEmbedding);
            const responseSimilarity = this.calculateCosineSimilarity(queryEmbedding, conv.responseEmbedding);
            conv.similarity = (promptSimilarity + responseSimilarity) / 2.0;
        }

        conversations.sort((c1, c2) => c2.similarity - c1.similarity);
        return conversations.slice(0, Math.min(topN, conversations.length));
    }

    static findRelevantEvents(queryEmbedding, events, topN) {
        for (let event of events) {
            const eventSimilarity = this.calculateCosineSimilarity(queryEmbedding, event.eventEmbedding);
            const eventContextSimilarity = this.calculateCosineSimilarity(queryEmbedding, event.eventContextEmbedding);
            const eventResultSimilarity = this.calculateCosineSimilarity(queryEmbedding, event.eventResultEmbedding);
            event.similarity = (eventSimilarity + eventContextSimilarity + eventResultSimilarity) / 3.0;
        }

        events.sort((c1, c2) => c2.similarity - c1.similarity);
        return events.slice(0, Math.min(topN, events.length));
    }

    static calculateCosineSimilarity(vec1, vec2) {
        if (vec1.length !== vec2.length) {
            this.logger.warn("Vectors are not of same length, possible initial response in the data.");
            return 0.0;
        } else {
            let dotProduct = 0.0;
            let norm1 = 0.0;
            let norm2 = 0.0;

            for (let i = 0; i < vec1.length; i++) {
                dotProduct += vec1[i] * vec2[i];
                norm1 += vec1[i] ** 2;
                norm2 += vec2[i] ** 2;
            }

            return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
        }
    }
}