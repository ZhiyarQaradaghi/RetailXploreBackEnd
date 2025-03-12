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

    // Create indexes for better query performance
    await collection.createIndex({ name: 1 });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ isDiscounted: 1 });
    await collection.createIndex({ price: 1 });

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
