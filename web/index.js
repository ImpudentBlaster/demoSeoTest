import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import sqlite3 from "sqlite3";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://spuspam111:Sp123456@cluster0.0taaaup.mongodb.net/scripttag?retryWrites=true&w=majority"
);
const scriptUrl = "https://server-page-xo9v.onrender.com/newschema-script.js";
const Shop = mongoose.model(
  "Shop",
  new mongoose.Schema({
    shop: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    isEnabled: { type: String, default: "false" },
    collection_isEnabled: { type: String, default: "false" },
    article_isEnabled: { type: String, default: "false" },
    organization_isEnabled: { type: String, default: "false" },
    breadcrumb_isEnabled: { type: String, default: "false" },
    video_isEnabled: { type: String, default: "false" },
    searchbox_isEnabled: { type: String, default: "false" },
    recipe_isEnabled: { type: String, default: "false" },
  })
);

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);
console.log(
  `server is running at ${
    process.env.BACKEND_PORT || process.env.PORT || "3000"
  }`
);
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.use(cors());
const DB_PATH = `${process.cwd()}/database.sqlite`;
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);
app.use(express.json());
/////-----API to get every page-----/////
app.get("/api/seoAudit", async (req, res) => {
  const arrayOfPages = ["products", "custom_collections", "blogs", "pages"];

  try {
    const shopData = await accessToken(req.query.shop);
    console.log(shopData);
    const promises = arrayOfPages.map((url) =>
      getUrlData(url, shopData.shop, shopData.accessToken)
    );
    const result = await Promise.all(promises);

    const structuredResult = {
      products: result[0],
      collections: result[1],
      blogs: result[2],
      pages: result[3],
    };

    const count =
      structuredResult.products[0].count +
      structuredResult.blogs[0].count +
      structuredResult.collections[0].count +
      structuredResult.pages[0].count;
    res.send({ ...structuredResult, totalPages: count });
  } catch (error) {
    res.status(500).send("Failed to fetch data");
  }
});

async function getUrlData(urlEndpoint, shop, accessToken) {
  try {
    console.log(urlEndpoint, shop, accessToken);
    const pagesResponse = await axios.get(
      `https://${shop}/admin/api/2024-10/${urlEndpoint}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    const result = await Promise.all(
      pagesResponse.data[urlEndpoint].map(async (item) => {
        const pageUrl =
          urlEndpoint === "custom_collections"
            ? `https://${shop}/collections/${item.handle}`
            : `https://${shop}/${urlEndpoint}/${item.handle}`;

        return {
          id: item.id,
          handle: item.handle,
          title: item.title,
          pageUrl: pageUrl,
          count: pagesResponse.data[urlEndpoint].length,
        };
      })
    );

    return result;
  } catch (error) {
    console.error(`Error fetching data for ${urlEndpoint}:`, error.message);
    return [];
  }
}
/////-----API to get every page-----/////

/////-----Function to get accessToken and shop-----/////
const accessToken = (shop) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);

    db.all(
      "SELECT shop, accessToken FROM shopify_sessions",
      [],
      (err, rows) => {
        if (err) {
          console.error("Failed to retrieve tokens:", err);
          reject({ error: "failed to retrieve tokens" });
        } else {
          const storeToken = rows.find((row) => row.shop === shop);
          resolve(storeToken);
        }
      }
    );

    db.close();
  });
};
/////-----Function to get accessToken and shop-----/////
app.get("/api/getShopData", async (req, res) => {
  try {
    console.log("api/getShopData");
    const data = await accessToken(req.query.shop);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

async function createScriptTagsForAllStores() {
  const db = new sqlite3.Database(DB_PATH);

  db.all(
    "SELECT shop, accessToken FROM shopify_sessions",
    [],
    async (err, rows) => {
      if (err) {
        console.error("Failed to retrieve store tokens:", err);
        return;
      }

      for (const row of rows) {
        const { shop, accessToken } = row;

        try {
          // Step 1: Check for existing script tags
          const existingResponse = await axios.get(
            `https://${shop}/admin/api/2024-10/script_tags.json`,
            {
              headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
              },
            }
          );

          // Step 2: Normalize URLs to avoid duplicates
          const normalizedScriptUrl = new URL(scriptUrl).href;
          const scriptTagExists = existingResponse.data.script_tags.some(
            (tag) => new URL(tag.src).href === normalizedScriptUrl
          );

          if (!scriptTagExists) {
            // Step 3: Create the script tag if it doesn’t exist
            await axios.post(
              `https://${shop}/admin/api/2024-10/script_tags.json`,
              {
                script_tag: {
                  event: "onload",
                  src: scriptUrl,
                },
              },
              {
                headers: {
                  "X-Shopify-Access-Token": accessToken,
                  "Content-Type": "application/json",
                },
              }
            );

            console.log(`Script tag created for store ${shop}`);
          } else {
            console.log(
              `Script tag with the same URL already exists for store ${shop}`
            );
          }
        } catch (error) {
          console.error(
            `Error creating script tag for store ${shop}:`,
            error.message
          );
        }
      }

      db.close();
    }
  );
}
app.get("/api/create-script-tags", async (req, res) => {
  await createScriptTagsForAllStores();
  res.send("Script tags creation triggered manually.");
});

app.get("/admin/api/products/:handle", async (req, res) => {
  const { handle } = req.params;

  // Open the database connection
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error("Failed to connect to the database:", err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Retrieve the store name and access token from the database
  db.get(
    "SELECT shop, accessToken FROM shopify_sessions LIMIT 1",
    async (err, row) => {
      if (err) {
        console.error("Failed to retrieve store tokens:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (!row) {
        console.error("No store found in the database.");
        return res.status(404).json({ message: "Store not found" });
      }

      const { shop, accessToken } = row;

      try {
        // Make API request to fetch product details by handle
        const response = await fetch(
          `https://${shop}/admin/api/2024-10/products.json?handle=${handle}`,
          {
            method: "GET",
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Check if the response was successful
          if (data.products.length > 0) {
            res.json(data.products[0]); // Return the first product
          } else {
            res.status(404).json({ message: "Product not found" });
          }
        } else {
          console.error("Error fetching product from Shopify:", data);
          res
            .status(response.status)
            .json({ message: data.errors || "Error fetching product" });
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
      } finally {
        // Close the database connection
        db.close();
      }
    }
  );
});

// Manually create script tag from postman:

app.get("/api/create-script-tags", async (req, res) => {
  const db = new sqlite3.Database(DB_PATH);

  db.all(
    "SELECT shop, accessToken FROM shopify_sessions",
    [],
    async (err, rows) => {
      if (err) {
        console.error("Failed to retrieve store tokens:", err);
        return res
          .status(500)
          .json({ error: "Failed to retrieve store tokens" });
      }

      const results = [];

      for (const row of rows) {
        const { shop, accessToken } = row;

        try {
          // Step 1: Check if the script tag already exists
          const existingResponse = await axios.get(
            `https://${shop}/admin/api/2024-10/script_tags.json`,
            {
              headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
              },
            }
          );

          const scriptTagExists = existingResponse.data.script_tags.some(
            (tag) => tag.src === scriptUrl
          );

          if (scriptTagExists) {
            results.push({ shop, status: "Script tag already exists" });
          } else {
            // Step 2: Create a new script tag if it doesn’t exist
            const response = await axios.post(
              `https://${shop}/admin/api/2024-10/script_tags.json`,
              {
                script_tag: {
                  event: "onload",
                  src: scriptUrl,
                },
              },
              {
                headers: {
                  "X-Shopify-Access-Token": accessToken,
                  "Content-Type": "application/json",
                },
              }
            );

            results.push({
              shop,
              status: "Script tag created successfully",
              data: response.data,
            });
          }
        } catch (error) {
          console.error(
            `Error creating script tag for store ${shop}:`,
            error.message
          );
          results.push({
            shop,
            status: "Failed to create script tag",
            error: error.message,
          });
        }
      }

      // Close the database after processing
      db.close();

      // Send the response with all results
      res.status(200).json({ results });
    }
  );
});
app.get("/api/create", async (req, res) => {
  try {
    const response = await axios.post(
      `https://${shopifyStore}.myshopify.com/admin/api/2024-10/script_tags.json`,
      {
        script_tag: {
          event: "onload",
          src: scriptUrl,
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Script tag created:", response.data);
    res.status(200).json({
      message: "Script tag created successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error creating script tag:", error);
    res.status(500).json({ error: "Failed to create script tag" });
  }
});

// Health check route

app.get("/get-script-tags", async (req, res) => {
  try {
    const response = await axios.get(
      `https://${shopifyStore}.myshopify.com/admin/api/2024-10/script_tags.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the script tag exists in the response
    const scriptTagExists = response.data.script_tags.some(
      (tag) => tag.src === scriptUrl
    );

    res.status(200).json({
      message: "Retrieved script tags successfully",
      data: response.data.script_tags,
      scriptTagExists: scriptTagExists,
    });
  } catch (error) {
    console.error("Error retrieving script tags:", error);
    res.status(500).json({ error: "Failed to retrieve script tags" });
  }
});

app.delete("/del-script/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Send a DELETE request to the Shopify API
    const response = await axios.delete(
      `https://${shopifyStore}.myshopify.com/admin/api/2024-10/script_tags/${id}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the deletion was successful
    if (response.status === 200) {
      return res.status(200).json({
        message: "Script tag deleted successfully",
      });
    } else {
      return res
        .status(response.status)
        .json({ message: "Failed to delete script tag" });
    }
  } catch (error) {
    console.error("Error deleting script tag:", error);
    return res.status(500).json({ error: "Failed to delete script tag" });
  }
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
