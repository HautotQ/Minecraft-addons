class GoTo {
    static goTo(botSource, x, y, z) {
       const server = botSource.method_9211();
       const bot = botSource.method_44023();
       if (bot !== null) {
          console.log("Found bot: " + botSource.method_9214());
          let path = PathFinder.calculatePath(bot.method_24515(), new class_2338(x, y, z));
          path = PathFinder.simplifyPath(path);
          return PathTracer.tracePathOutput(server, botSource, botSource.method_9214(), path);
       } else {
          console.log("Bot not found!");
          throw new Error("Bot not found!");
       }
    }
 }