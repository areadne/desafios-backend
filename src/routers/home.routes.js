import { Router } from "express";
import "/Users/luis_/OneDrive/Documents/Areadne/Backend/Handlebars-y-websocket/products.json" assert { type: "json" };
import fs from "fs";

const router = Router();

router.get("/", async (request, response) => {
  const products = JSON.parse(
    await fs.promises.readFile(
      "/Users/luis_/OneDrive/Documents/Areadne/Backend/Handlebars-y-websocket/products.json",
      "utf-8"
    )
  );

  response.render("home", { products });
});

export default router;
