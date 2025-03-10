const express = require("express");
const app = express();
const port = 3003;
const fs = require("fs");
const path = require("path");

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // put front end url
    credentials: true,
  })
);
app.use(express.json());

// path for product images here
app.use("/images", express.static(path.join(__dirname, "public/images")));

// read product json
let productsData;
try {
  const rawData = fs.readFileSync(
    path.join(__dirname, "products.json"),
    "utf8"
  );
  productsData = JSON.parse(rawData);
} catch (error) {
  console.error("Error loading products:", error);
  productsData = {
    fruits: [],
    drinks: [],
    grains: [],
    dairy: [],
    snacks: [],
    bakery: [],
  };
}

app.get("/home", (req, res) => {
  res.json({
    message: "HOME PAGE HERE",
    greeting: "TESTTTT",
  });
});

app.get("/productlist", (req, res) => {
  // array for products
  const allProducts = [];
  let id = 1; // each product id

  Object.keys(productsData).forEach((category) => {
    productsData[category].forEach((product) => {
      allProducts.push({
        id: id++,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
        rating: product.rating,
        description: product.description,
        isDiscounted: product.isDiscounted,
      });
    });
  });

  res.json({
    message: "Product list data",
    products: allProducts,
  });
});

app.get("/featured", (req, res) => {
  const featured = [];
  let id = 1;

  Object.keys(productsData).forEach((category) => {
    const discounted = productsData[category]
      .filter((product) => product.isDiscounted)
      .slice(0, 1);

    discounted.forEach((product) => {
      featured.push({
        id: id++,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category,
      });
    });
  });

  // only 4 featured products
  res.json({
    message: "Featured products",
    products: featured.slice(0, 4),
  });
});

// search endpoint
app.get("/search", (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query) {
    return res.json({
      message: "Please provide a search query",
      products: [],
    });
  }

  // search across all categories
  const results = [];
  let id = 1;

  Object.keys(productsData).forEach((category) => {
    productsData[category].forEach((product) => {
      if (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      ) {
        results.push({
          id: id++,
          name: product.name,
          image: product.image,
          price: product.price,
          category: product.category,
        });
      }
    });
  });

  res.json({
    message: "Search results",
    searchQuery: query,
    products: results,
  });
});

// incomplete scanner endpoint
app.get("/scanner", (req, res) => {
  res.json({
    message: "Scanner page data",
  });
});

// incomplete shopping cart endpoint
app.get("/shopping", (req, res) => {
  res.json({
    message: "Shopping cart data",
    items: [], // This will eventually contain cart items
  });
});

// incomplete map endpoint
app.get("/map", (req, res) => {
  res.json({
    message: "3D Map data",
  });
});

app.listen(port, () => {
  console.log(`RetailXplore backend is running on port ${port}`);
});
