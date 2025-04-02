"use strict";

// Required dependencies and imports (assuming equivalent modules are available)
const class_1297 = require("net.minecraft.class_1297");
const class_243 = require("net.minecraft.class_243");
const class_3222 = require("net.minecraft.class_3222");

// Helper function to convert radians to degrees
Math.toDegrees = function(radians) {
    return radians * 180.0 / Math.PI;
};

class FaceClosestEntity {
   static faceClosestEntity(bot, entities) {
      if (entities.length !== 0) {
         let closestEntity = null;
         let closestDistance = Number.MAX_VALUE;
         let var5 = entities[Symbol.iterator]();

         while(true) {
            let next = var5.next();
            if (next.done) break;
            let entity = next.value;
            let distance = bot.method_5858(entity);
            if (distance < closestDistance) {
               closestDistance = distance;
               closestEntity = entity;
            }
         }

         if (closestEntity !== null) {
            let botPos = bot.method_19538();
            let entityPos = closestEntity.method_19538();
            let direction = entityPos.method_1020(botPos).method_1029();
            let yaw = Math.toDegrees(Math.atan2(direction.field_1350, direction.field_1352)) - 90.0;
            let pitch = Math.toDegrees(-Math.atan2(direction.field_1351, Math.sqrt(direction.field_1352 * direction.field_1352 + direction.field_1350 * direction.field_1350)));
            bot.method_36456(yaw);
            bot.method_36457(pitch);
         }

      }
   }
}

module.exports = {
    FaceClosestEntity
};
