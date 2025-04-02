"use strict";

// Required dependencies and imports
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const LoggerFactory = require("winston"); // Using winston as a stand-in for slf4j
const class_310 = require("net.minecraft.class_310"); // Preserved import for external dependency

// Logger setup (simulate SLF4J logger with winston)
const logger = LoggerFactory.createLogger({
   level: "error",
   transports: [
      new LoggerFactory.transports.Console()
   ]
});

// Helper classes to simulate JDBC-like behavior

class ResultSet {
   constructor(rows) {
      this.rows = rows;
      this.index = -1;
   }
   next() {
      if (this.index + 1 < this.rows.length) {
         this.index++;
         return true;
      }
      return false;
   }
   getCurrentRow() {
      if (this.index >= 0 && this.index < this.rows.length) {
         return this.rows[this.index];
      }
      return null;
   }
}

class Statement {
   constructor(db) {
      this.db = db;
   }
   executeQuery(query) {
      let stmt = this.db.prepare(query);
      let rows = stmt.all();
      return new ResultSet(rows);
   }
   executeUpdate(query) {
      let stmt = this.db.prepare(query);
      let info = stmt.run();
      return info.changes;
   }
   close() {
      // In better-sqlite3, statements do not need explicit closure.
   }
}

class PreparedStatement {
   constructor(stmt) {
      this.stmt = stmt;
      this.parameters = [];
   }
   setString(index, value) {
      // index in JDBC is 1-based; adjust to 0-based array index.
      this.parameters[index - 1] = value;
   }
   executeUpdate() {
      let info = this.stmt.run(this.parameters);
      return info.changes;
   }
   close() {
      // In better-sqlite3, prepared statements can be explicitly finalized, but it's optional.
      this.stmt = null;
      this.parameters = [];
   }
}

class ConnectionWrapper {
   constructor(db) {
      this.db = db;
   }
   createStatement() {
      return new Statement(this.db);
   }
   prepareStatement(sql) {
      let stmt = this.db.prepare(sql);
      return new PreparedStatement(stmt);
   }
   isValid(timeout) {
      // Simulate validation by always returning true if db is open.
      return !this.db.closed;
   }
   close() {
      try {
         this.db.close();
      } catch (e) {
         // Ignore errors on close.
      }
   }
}

class DriverManager {
   static getConnection(dbUrl) {
      // Remove the "jdbc:sqlite:" prefix to get the file path.
      const prefix = "jdbc:sqlite:";
      let filePath = dbUrl.startsWith(prefix) ? dbUrl.substring(prefix.length) : dbUrl;
      // Open the database connection using better-sqlite3
      let db = new Database(filePath);
      db.closed = false;
      // Override close to set closed flag
      const originalClose = db.close.bind(db);
      db.close = () => {
         originalClose();
         db.closed = true;
      };
      return new ConnectionWrapper(db);
   }
}

// Main class SQLiteDB with static members and methods
class SQLiteDB {
   // Preserved logger as static constant (already defined above)
   static logger = logger;
   static dbExists = false;
   static dbEmpty = false;

   static createDB() {
      const gameDir = class_310.method_1551().field_1697.getAbsolutePath();
      const dbDir = new fs.Dir ? new fs.Dir(path.join(gameDir, "sqlite_databases")) : null;
      let dbDirPath = path.join(gameDir, "sqlite_databases");
      if (!fs.existsSync(dbDirPath)) {
         try {
            fs.mkdirSync(dbDirPath, { recursive: true });
            console.log("Database directory created.");
         } catch (err) {
            console.error("Error creating database directory:", err);
         }
      } else {
         console.log("Database directory already exists, ignoring...");
      }

      const dbUrl = "jdbc:sqlite:" + path.join(gameDir, "sqlite_databases", "memory_agent.db");
      console.log("Connecting to database at: " + dbUrl);

      let connection = null;
      try {
         connection = DriverManager.getConnection(dbUrl);
         let statement = null;
         try {
            statement = connection.createStatement();
            try {
               if (connection.isValid(30)) {
                  console.log("Connection to database valid.");
               }
               if (connection !== null) {
                  console.log("Connection to SQLite has been established.");
               }
               const checkTableQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name='conversations'";
               let tableResultSet = statement.executeQuery(checkTableQuery);
               if (!tableResultSet.next()) {
                  const createTableQuery1 = "CREATE TABLE conversations (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, prompt TEXT NOT NULL, response TEXT NOT NULL, prompt_embedding BLOB, response_embedding BLOB)";
                  const createTableQuery2 = "CREATE TABLE events (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, event TEXT NOT NULL, event_context TEXT NOT NULL, event_result TEXT NOT NULL, event_embedding BLOB, event_context_embedding BLOB, event_result_embedding BLOB)";
                  statement.executeUpdate(createTableQuery1);
                  statement.executeUpdate(createTableQuery2);
                  console.log("Setting up memory database...done.");
                  SQLiteDB.dbExists = true;
                  SQLiteDB.dbEmpty = true;
               }
            } catch (var11) {
               if (statement !== null) {
                  try {
                     statement.close();
                  } catch (var10) {
                     // Add suppressed error (not directly supported in JS)
                     var11.suppressed = var11.suppressed || [];
                     var11.suppressed.push(var10);
                  }
               }
               throw var11;
            }
            if (statement !== null) {
               statement.close();
            }
         } catch (var12) {
            if (connection !== null) {
               try {
                  connection.close();
               } catch (var9) {
                  var12.suppressed = var12.suppressed || [];
                  var12.suppressed.push(var9);
               }
            }
            throw var12;
         }
         if (connection !== null) {
            connection.close();
         }
      } catch (var13) {
         SQLiteDB.logger.error("Caught SQLException: " + var13.stack);
      }
   }

   static storeConversationWithEmbedding(DB_URL, prompt, response, prompt_embedding, response_embedding) {
      // Convert list of numbers to comma separated strings
      const promptEmbeddingString = prompt_embedding.map(String).join(",");
      const responseEmbeddingString = response_embedding.map(String).join(",");
      let connection = null;
      try {
         connection = DriverManager.getConnection(DB_URL);
         let pstmt = null;
         try {
            pstmt = connection.prepareStatement("INSERT INTO conversations (prompt, response, prompt_embedding, response_embedding) VALUES (?, ?, ?, ?)");
            try {
               pstmt.setString(1, prompt);
               pstmt.setString(2, response);
               pstmt.setString(3, promptEmbeddingString);
               pstmt.setString(4, responseEmbeddingString);
               pstmt.executeUpdate();
               console.log("SYSTEM: Conversation saved to database.");
               SQLiteDB.dbEmpty = false;
            } catch (var13) {
               if (pstmt !== null) {
                  try {
                     pstmt.close();
                  } catch (var12) {
                     var13.suppressed = var13.suppressed || [];
                     var13.suppressed.push(var12);
                  }
               }
               throw var13;
            }
            if (pstmt !== null) {
               pstmt.close();
            }
         } catch (var14) {
            if (connection !== null) {
               try {
                  connection.close();
               } catch (var11) {
                  var14.suppressed = var14.suppressed || [];
                  var14.suppressed.push(var11);
               }
            }
            throw var14;
         }
         if (connection !== null) {
            connection.close();
         }
      } catch (err) {
         throw err;
      }
   }

   static storeEventWithEmbedding(DB_URL, event, event_context, event_result, event_embedding, event_context_embedding, event_result_embedding) {
      const eventEmbeddingString = event_embedding.map(String).join(",");
      const eventContextEmbeddingString = event_context_embedding.map(String).join(",");
      const eventResultEmbeddingString = event_result_embedding.map(String).join(",");
      let connection = null;
      try {
         connection = DriverManager.getConnection(DB_URL);
         let pstmt = null;
         try {
            pstmt = connection.prepareStatement("INSERT INTO events (event, event_context, event_result, event_embedding, event_context_embedding, event_result_embedding) VALUES (?, ?, ?, ?, ?, ?)");
            try {
               pstmt.setString(1, event);
               pstmt.setString(2, event_context);
               pstmt.setString(3, event_result);
               pstmt.setString(4, eventEmbeddingString);
               pstmt.setString(5, eventContextEmbeddingString);
               pstmt.setString(6, eventResultEmbeddingString);
               pstmt.executeUpdate();
               console.log("SYSTEM: Event data saved to database.");
               SQLiteDB.dbEmpty = false;
            } catch (var16) {
               if (pstmt !== null) {
                  try {
                     pstmt.close();
                  } catch (var15) {
                     var16.suppressed = var16.suppressed || [];
                     var16.suppressed.push(var15);
                  }
               }
               throw var16;
            }
            if (pstmt !== null) {
               pstmt.close();
            }
         } catch (var17) {
            if (connection !== null) {
               try {
                  connection.close();
               } catch (var14) {
                  var17.suppressed = var17.suppressed || [];
                  var17.suppressed.push(var14);
               }
            }
            throw var17;
         }
         if (connection !== null) {
            connection.close();
         }
      } catch (err) {
         throw err;
      }
   }
}

module.exports = SQLiteDB;
