
import * as mc from "@minecraft/server";
import { pathfinding } from "./pathfinding.js";
import { actions } from "./actions.js";

export const AIPlayer = {
    start() {
        mc.system.run(() => {
            let entity = mc.world.getDimension("overworld").spawnEntity("minecraft:player", new mc.Vector3(0, 64, 0));
            entity.nameTag = "AI Player";
            AIPlayer.entity = entity;
            AIPlayer.think();
        });
    },
    stop() {
        if (AIPlayer.entity) {
            AIPlayer.entity.kill();
        }
    },
    think() {
        if (!AIPlayer.entity) return;
        let target = pathfinding.findNearestBlock(AIPlayer.entity, "minecraft:diamond_ore");
        if (target) {
            actions.moveTo(AIPlayer.entity, target);
        }
        mc.system.runTimeout(() => AIPlayer.think(), 20);
    }
};
