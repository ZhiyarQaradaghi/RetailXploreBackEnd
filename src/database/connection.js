const { MongoClient } = require("mongodb");

class DatabaseConnection {
  constructor() {
    this.uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    this.dbName = "retailxplore";
    this.client = null;
  }

  async connect() {
    if (!this.client) {
      this.client = new MongoClient(this.uri); 
      let retries = 5; // can change maybe 

      // retry connection
      while (retries > 0) {
        try {
          await this.client.connect();
          console.log("Connected to MongoDB");
          return this.client.db(this.dbName);
        } catch (error) {
          retries--;
          if (retries === 0) {
            console.error("Failed to connect to MongoDB after 5 attempts");
            throw error;
          }
          console.log(`Retrying connection... (${retries} attempts remaining)`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }
    return this.client.db(this.dbName);
  }

  async getCollection(collectionName) {
    const db = await this.connect();
    return db.collection(collectionName);
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log("Database connection closed");
    }
  }
}

// singleton instance
module.exports = new DatabaseConnection();
