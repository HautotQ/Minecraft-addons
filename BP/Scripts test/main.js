import {
    world,
    system
  } from "@minecraft/server";

function mainTick() {
  if (system.currentTick % 200 === 0) {
    world.sendMessage("All systems GO!");
    world.sendMessage("Hello world !");
  }
  system.run(mainTick);
}

system.run(mainTick);
