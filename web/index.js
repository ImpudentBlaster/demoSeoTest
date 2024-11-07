import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);
console.log(`server is running at ${process.env.BACKEND_PORT || process.env.PORT || "3000"}`)
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();


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

/////-----Function to get accessToken and shop-----/////
const shopData = (shop) => {
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
app.get('/api/getShopData' , async(req,res)=>{
  try {
    const data = await shopData(req.query.shop);
    res.status(200).send(data)
  } catch (error) {
    res.status(404).send(error.message)
  }
})

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
