
import * as mc from "@minecraft/server";
import { AIPlayer } from "./ai_logic.js";

mc.system.events.beforeChat.subscribe(event => {
    let message = event.message.toLowerCase();
    if (message === "start ai") {
        mc.system.run(() => {
            AIPlayer.start();
        });
    }
    if (message === "stop ai") {
        mc.system.run(() => {
            AIPlayer.stop();
        });
    }
});
