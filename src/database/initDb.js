const database = require("./connection");
const products = require("../data/products.json");
const bcrypt = require("bcryptjs");

async function initializeDatabase() {
  try {
    const collection = await database.getCollection("products");
    await collection.deleteMany({});

    // insert all products
    const allProducts = [
      ...products.fruits,
      ...products.drinks,
      ...products.grains,
      ...products.dairy,
      ...products.snacks,
      ...products.bakery,
    ];

    await collection.insertMany(allProducts);

    await collection.createIndex({ name: 1 });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ isDiscounted: 1 });
    await collection.createIndex({ price: 1 });

    // clear carts collection
    const cartsCollection = await database.getCollection("carts");
    await cartsCollection.deleteMany({});
    console.log("Carts collection cleared");

    const adminCollection = await database.getCollection("admins");
    await adminCollection.deleteMany({});

    // this creates a default admin 
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await adminCollection.insertOne({
      name: "Admin User",
      email: "admin@retailxplore.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Database initialized successfully with indexes");
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    await database.close();
    process.exit(1);
  }
}

initializeDatabase();
