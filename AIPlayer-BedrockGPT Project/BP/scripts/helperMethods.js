import { system, world } from "@minecraft/server";

// Formatters pour les dates
function formatDateTime1(date) {
  return `${date.getFullYear()}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}

function formatDateTime2(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}

// Vérifier si une date est récente
function isRecentTimestamp(timestamp, currentDateTime) {
  const conversationTime = new Date(timestamp);
  const currentTime = new Date(currentDateTime);
  return conversationTime > new Date(currentTime.getTime() - 60 * 60 * 1000);
}

// Trouver la similarité maximale
function findMaxSimilarity(set) {
  let maxSimilarity = Number.MIN_VALUE;
  for (const item of set) {
    if (item.similarity > maxSimilarity) {
      maxSimilarity = item.similarity;
    }
  }
  return maxSimilarity;
}

// Vérifie si la similarité est élevée
function isHighSimilarity(similarityScore, maxSimilarity) {
  return similarityScore === maxSimilarity;
}

// Obtenir l'heure actuelle
function getCurrentDateAndTime() {
  return formatDateTime1(new Date());
}

// Création de requêtes (simulation de l'appel API, pas d'IA ici)
async function createQueries(prompt) {
  // Simule un appel à un modèle local
  const vectorDBQueries = [
    `Query based on: ${prompt}`,
    "Autre requête pertinente ici...",
  ];
  return vectorDBQueries;
}

// Classification des requêtes
async function classifyQueries(queryList, prompt) {
  // Simulation simple
  const eventKeywords = ["mine", "attack", "go", "harvest", "explore"];
  const lowerPrompt = prompt.toLowerCase();
  const isEvent = eventKeywords.some((keyword) =>
    lowerPrompt.includes(keyword)
  );
  return isEvent ? "events" : "conversations";
}

// Classification des événements
async function classifyEvents(dateTime, prompt, context) {
  const relevanceKeywords = prompt.split(" ");
  let isRelevant = relevanceKeywords.some((word) =>
    context.toLowerCase().includes(word.toLowerCase())
  );
  return isRelevant;
}

// Exemple d'utilisation dans Minecraft
system.run(() => {
  const dateNow = getCurrentDateAndTime();
  const timestamp = formatDateTime2(new Date());

  const isRecent = isRecentTimestamp(timestamp, dateNow);
  console.warn("Est récent:", isRecent);

  const similaritySet = [
    { similarity: 0.5 },
    { similarity: 0.8 },
    { similarity: 0.9 },
  ];
  const maxSim = findMaxSimilarity(similaritySet);
  console.warn("Max Similarity:", maxSim);

  createQueries("How can I build a farm?").then((queries) => {
    console.warn("Generated queries:", queries);
    classifyQueries(queries, "How can I build a farm?").then((type) => {
      console.warn("Query type:", type);
    });
  });

  classifyEvents(
    dateNow,
    "Go to coordinates 10 20 30",
    "The player asked to go to coordinates 10 20 30."
  ).then((relevant) => {
    console.warn("Event Relevant:", relevant);
  });
});
