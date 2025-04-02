class PathTracer {
    static LOGGER = console;
    static scheduler = setInterval;
    static WALKING_SPEED = 4.317;
    static extraTime = 9.79;
    static isMoving = false;
  
    static getBotMovementStatus() {
      return PathTracer.isMoving;
    }
  
    static assignPriority(axisPriorityList) {
      const priorityMap = {};
      axisPriorityList.forEach((axis, i) => {
        priorityMap[axis] = i + 1;
      });
      return priorityMap;
    }
  
    static tracePath(server, botSource, botName, path) {
      const axisPriorityList = PathFinder.identifyPrimaryAxis(path);
      const priorityMap = PathTracer.assignPriority(axisPriorityList);
      const manager = new PathTracer.BotMovementManager(server, botSource, botName, path);
  
      Object.entries(priorityMap).forEach(([axis, priority]) => {
        manager.addMovementJob(axis, priority);
      });
  
      manager.processJobs();
    }
  
    static tracePathOutput(server, botSource, botName, path) {
      let output = null;
      const axisPriorityList = PathFinder.identifyPrimaryAxis(path);
      console.log("Primary axis identified.");
      const priorityMap = PathTracer.assignPriority(axisPriorityList);
      const manager = new PathTracer.BotMovementManager(server, botSource, botName, path);
  
      Object.entries(priorityMap).forEach(([axis, priority]) => {
        manager.addMovementJob(axis, priority);
      });
  
      manager.processJobs();
      console.log("Processing movement jobs...");
      const lastPos = path[path.length - 1];
  
      while (PathTracer.isMoving) {
        // Simulate waiting with timeout
        setTimeout(() => {}, 5000);
      }
  
      const currentBotPos = botSource.getPosition();
      console.log(`Last position: ${lastPos}`);
      console.log(`Current position: ${currentBotPos}`);
      if (currentBotPos.x >= lastPos.x && currentBotPos.z > lastPos.z) {
        output = "The bot has reached target position.";
        server.broadcastMessage(`/say I have reached the target destination`);
      } else {
        output = "The bot could not reach the target position. An investigation into the matter is recommended.";
      }
  
      return output;
    }
  
    static calculateDistance(axis, start, end) {
      let result;
      switch (axis) {
        case "x":
          result = Math.abs(end.x - start.x);
          break;
        case "z":
          result = Math.abs(end.z - start.z);
          break;
        default:
          result = 0;
      }
      return result;
    }
  
    static calculateTravelTime(distance) {
      return distance / 4.317;
    }
  
    static makeBotWalkForward(server, botSource, botName, travelTime) {
      const roundedTravelTime = Math.round(travelTime);
      spawnFakePlayer.moveForward(server, botSource, botName);
      setTimeout(() => {
        new BotMovementTask(server, botSource, botName);
      }, roundedTravelTime * 1000);
    }
  
    static getPosNeg(path, primaryAxis) {
      let direction = "";
      const lastPos = path[path.length - 1];
      if (primaryAxis === "x") {
        direction = lastPos.x > 0 ? "positive" : "negative";
      } else if (primaryAxis === "z") {
        direction = lastPos.z > 0 ? "positive" : "negative";
      }
      return direction;
    }
  
    static updateFacing(server, botSource, botName, path, primaryAxis, facingAxis) {
      let posNeg = "";
      if (primaryAxis === facingAxis) {
        posNeg = PathTracer.getPosNeg(path, primaryAxis);
        if (facingAxis === "x" && posNeg === "positive") {
          server.broadcastMessage(`/player ${botName} look east`);
        } else if (facingAxis === "x" && posNeg === "negative") {
          server.broadcastMessage(`/player ${botName} look west`);
        }
  
        if (facingAxis === "z" && posNeg === "positive") {
          server.broadcastMessage(`/player ${botName} look south`);
        } else if (facingAxis === "z" && posNeg === "negative") {
          server.broadcastMessage(`/player ${botName} look north`);
        }
      } else {
        posNeg = PathTracer.getPosNeg(path, primaryAxis);
        if (primaryAxis === "x" && posNeg === "positive") {
          server.broadcastMessage(`/player ${botName} look east`);
          server.broadcastMessage(`/say I am facing east now`);
        } else if (primaryAxis === "x" && posNeg === "negative") {
          server.broadcastMessage(`/player ${botName} look west`);
          server.broadcastMessage(`/say I am facing west now`);
        }
  
        if (primaryAxis === "z" && posNeg === "positive") {
          server.broadcastMessage(`/player ${botName} look south`);
          server.broadcastMessage(`/say I am facing south now`);
        } else if (primaryAxis === "z" && posNeg === "negative") {
          server.broadcastMessage(`/player ${botName} look north`);
          server.broadcastMessage(`/say I am facing north now`);
        }
      }
    }
  
    static BotMovementManager = class {
      constructor(server, botSource, botName, path) {
        this.jobQueue = [];
        this.server = server;
        this.botSource = botSource;
        this.botName = botName;
        this.path = path;
        this.scheduler = setInterval;
      }
  
      addMovementJob(axis, priority) {
        this.jobQueue.push(new PathTracer.MovementJob(axis, priority));
      }
  
      processJobs() {
        if (this.jobQueue.length > 0) {
          const job = this.jobQueue.shift();
          this.executeMovement(job);
          PathTracer.isMoving = true;
        } else {
          PathTracer.isMoving = false;
          PathTracer.LOGGER.info("No more jobs to process");
        }
      }
  
      executeMovement(job) {
        console.log(`${this.botName} is currently facing in ${this.botSource.getPosition().toString()}`);
        PathTracer.updateFacing(this.server, this.botSource, this.botName, this.path, job.axis, this.botSource.getPosition().toString());
        const lastPos = this.path[this.path.length - 1];
        const currentBotPos = this.botSource.getPosition();
        const distance = PathTracer.calculateDistance(job.axis, currentBotPos, lastPos);
        const travelTime = PathTracer.calculateTravelTime(distance);
        const roundedTime = Math.round(travelTime);
        console.log(roundedTime);
        PathTracer.makeBotWalkForward(this.server, this.botSource, this.botName, travelTime);
        PathTracer.isMoving = true;
        console.log(`Marked isMoving: ${PathTracer.isMoving}`);
        console.log(`Executing movement on axis: ${job.axis}`);
        setTimeout(() => {
          this.waitForMovementCompletion(job);
        }, roundedTime * 1000);
      }
  
      waitForMovementCompletion(job) {
        const lastPos = this.path[this.path.length - 1];
        const currentBotPos = this.botSource.getPosition();
        if (this.hasReachedTarget(job.axis, currentBotPos, lastPos)) {
          console.log("Movement job completed");
          PathTracer.isMoving = false;
          this.processJobs();
        } else {
          setTimeout(() => {
            this.waitForMovementCompletion(job);
          }, 100);
        }
      }
  
      hasReachedTarget(axis, currentPos, targetPos) {
        let result = false;
        switch (axis) {
          case "x":
            result = currentPos.x > targetPos.x;
            break;
          case "y":
            result = currentPos.y === targetPos.y;
            break;
          case "z":
            result = currentPos.z > targetPos.z;
            break;
          default:
            result = false;
        }
        return result;
      }
    }
  
    static MovementJob = class {
      constructor(axis, priority) {
        this.axis = axis;
        this.priority = priority;
      }
  
      compareTo(other) {
        return this.priority - other.priority;
      }
    }
  }
