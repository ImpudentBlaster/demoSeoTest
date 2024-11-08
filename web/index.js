import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import sqlite3 from "sqlite3";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import axios from "axios";

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
    console.log('api/getShopData')
    const data = await accessToken(req.query.shop);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(error.message);
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
    