const database = require("./connection");
const products = require("../data/products.json");

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
    console.log("Database initialized successfully");
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    await database.close();
    process.exit(1);
  }
}

initializeDatabase();
