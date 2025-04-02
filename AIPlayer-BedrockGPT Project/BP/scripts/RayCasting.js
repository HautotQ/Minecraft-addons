// This code is related to Minecraft modding using JavaScript

class RayCasting {
    static checkOutput = "";
 
    static detect(bot) {
       RayCasting.detectBlocks(bot);
       return RayCasting.checkOutput;
    }
 
    static detectBlocks(bot) {
       const botPosition = bot.method_19538();
       const getDirection = bot.method_5735();
       const botDirection = class_243.method_24954(getDirection.method_10163());
       const rayLength = 15.0;
       const rayEnd = botPosition.method_1019(botDirection.method_1021(rayLength));
       const raycastContext = new class_3959(botPosition, rayEnd, class_3960.field_17558, class_242.field_1347, bot);
       const hitResult = bot.method_37908().method_17742(raycastContext);
       
       if (hitResult.method_17783() === class_240.field_1332) {
          console.log("Block detected at: " + String(hitResult.method_17777()));
          const blockX = hitResult.method_17777().method_10263();
          RayCasting.checkOutput = "Block detected in front at " + blockX + ", " + hitResult.method_17777().method_10264() + ", " + hitResult.method_17777().method_10260();
          const player = bot.method_5671().method_9217().method_9230(4);
          ChatUtils.sendChatMessages(player, "Block detected in front at " + blockX + ", " + hitResult.method_17777().method_10264() + ", " + hitResult.method_17777().method_10260());
       } else if (hitResult.method_17783() === class_240.field_1333) {
          console.log("Nothing detected in front by raycast");
          RayCasting.checkOutput = "No block detected in front";
          ChatUtils.sendChatMessages(bot.method_5671().method_9217().method_9230(4), "No block detected in front");
       }
    }
 }