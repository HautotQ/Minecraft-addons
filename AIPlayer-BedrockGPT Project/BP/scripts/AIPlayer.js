// This code is related to a Minecraft Fabric mod.
class AIPlayer {
    static LOGGER = console; // Using console for logging
    static CONFIG = AIPlayerConfig.createAndLoad();
 
    onInitialize() {
       AIPlayer.LOGGER.info("Hello Fabric world!");
       spawnFakePlayer.register();
       configCommand.register();
       SQLiteDB.createDB();
       ServerLifecycleEvents.SERVER_STOPPED.register(AutoFaceEntity.onServerStopped);

       // Avertir les joueurs que l'IA est présente
       ServerLifecycleEvents.SERVER_STARTED.register(server => {
           server.getPlayerManager().broadcastChatMessage(
               new LiteralText("§6[IA]§r L'intelligence artificielle est active sur ce serveur!"),
               MessageType.SYSTEM,
               Util.NIL_UUID
           );
       });
    }
}
