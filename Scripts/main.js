import { world, system } from "@minecraft/server";

function mainTick() {
  if (system.currentTick === 400) {
    world.sendMessage("All systems GO!");
  }
  system.run(mainTick);
}

system.run(mainTick);
