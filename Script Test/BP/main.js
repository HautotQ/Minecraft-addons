import * as mc from '@minecraft/server';

const AI_NAME = "AIPlayer";
let aiEntity = null;

// Fonction pour créer l'IA si elle n'existe pas encore
function spawnAI() {
    const players = mc.world.getPlayers();
    if (players.length === 0) return;

    const player = players[0]; // Prend le premier joueur
    const dimension = player.dimension;

    aiEntity = dimension.spawnEntity("minecraft:agent", player.location);
    aiEntity.nameTag = AI_NAME;
}

// Fonction pour analyser la commande du joueur
function interpretCommand(message, sender) {
    const lowerMessage = message.toLowerCase();

    // Expressions régulières pour détecter les intentions
    const miningKeywords = /(allons\s)?miner|creuse(r)?|trouve(r)?\s(une\s)?grotte/;
    const buildingKeywords = /(allons\s)?(bâtir|construire)|fais\s(une\s)?maison|édifie(r)?/;
    const gatheringKeywords = /(ramasse|cherche|trouve)\s(du\s)?(bois|pierre|fer|diamant)/;
    const combatKeywords = /(attaque|combat|défends-moi|protége-moi|tue\s(les\s)?mobs)/;
    const explorationKeywords = /(explorons?|trouve\s(quelque\s)?chose|partons\sà\s(la\s)?recherche)/;
    const followKeywords = /(suis(-moi)?|accompagne(-moi)?|reste\savec\s(moi|nous)|viens\savec\s(moi|nous))/;

    // Analyse de l'intention du message
    if (miningKeywords.test(lowerMessage)) {
        sender.sendMessage("D'accord ! Je vais chercher une grotte et commencer à miner.");
        mineSequence(sender);
    } else if (buildingKeywords.test(lowerMessage)) {
        sender.sendMessage("Super idée ! Je vais commencer la construction.");
        startBuilding(sender);
    } else if (gatheringKeywords.test(lowerMessage)) {
        sender.sendMessage("Je vais chercher les ressources demandées.");
        gatherMaterials(sender, lowerMessage);
    } else if (combatKeywords.test(lowerMessage)) {
        sender.sendMessage("Je vais défendre la zone et attaquer les ennemis !");
        startCombat(sender);
    } else if (explorationKeywords.test(lowerMessage)) {
        sender.sendMessage("Allons explorer le monde à la recherche de nouvelles découvertes !");
        startExploration(sender);
    } else if (followKeywords.test(lowerMessage)) {
        sender.sendMessage("Bien sûr ! Je vais te suivre partout.");
        followPlayer(sender);
    } else {
        sender.sendMessage("Je ne comprends pas bien, peux-tu reformuler ?");
    }
}

// Fonction pour que l'IA suive le joueur
function followPlayer(player) {
    if (!aiEntity) spawnAI();

    // L'IA suit le joueur en se téléportant régulièrement
    let interval = setInterval(() => {
        if (!player || !aiEntity) {
            clearInterval(interval);
            return;
        }
        let playerPos = player.location;
        aiEntity.runCommandAsync(`tp @s ${playerPos.x} ${playerPos.y} ${playerPos.z}`);
    }, 2000); // Se téléporte toutes les 2 secondes
}

// Fonction de minage de l'IA
function mineSequence(player) {
    if (!aiEntity) spawnAI();
    
    player.sendMessage("Je commence à creuser !");
    aiEntity.runCommandAsync("tp @s ~ ~-1 ~");
}

// Fonction de collecte de matériaux
function gatherMaterials(player) {
    if (!aiEntity) spawnAI();

    player.sendMessage("Je vais couper du bois.");
    aiEntity.runCommandAsync("give @s minecraft:wood 16");
}

// Événement pour capter les messages du joueur
mc.world.afterEvents.chatSend.subscribe(event => {
    const sender = event.sender;
    const message = event.message;

    if (sender.name !== AI_NAME) {
        interpretCommand(message, sender);
    }
});

// Création automatique de l'IA à la connexion
mc.world.afterEvents.playerJoin.subscribe(event => {
    spawnAI();
});
