const database = require("../database/connection");
const bcrypt = require("bcryptjs");

class Admin {
  static async findByEmail(email) {
    const collection = await database.getCollection("admins");
    return collection.findOne({ email });
  }
  static async createAdmin(adminData) {
    const collection = await database.getCollection("admins");
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    const admin = {
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(admin);
    return admin;
  }
}

module.exports = Admin;
