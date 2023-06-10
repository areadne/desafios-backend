import express from "express";
import handlebars from "express-handlebars";
import homeRouter from "./routers/home.routes.js";
import "/Users/luis_/OneDrive/Documents/Areadne/Backend/Handlebars-y-websocket/products.json" assert { type: "json" };
import { ProductManager } from "./class/productManager.js";
import fs from "fs";

import { Server } from "socket.io";

const app = express();
const httpServer = app.listen(8080, () => {
  console.log("server up");
});
const io = new Server(httpServer);

const manager = new ProductManager(
  "/Users/luis_/OneDrive/Documents/Areadne/Backend/Handlebars-y-websocket/products.json"
);

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));


io.on("connection", (socket) => {
  console.log("handshake");

  socket.on("formulario", (data) => {
    const { title, description, price, thumbnail, code, stock, category, status } = data;

    manager.addProduct( title, description, price, thumbnail, code, stock, category, status );
  });

  const promesa = async () => {
    const productosArchivo = await manager.readJSON();

    const productosArchivoJSON = JSON.stringify(productosArchivo);

    socket.emit("productos", productosArchivoJSON);
  };

  promesa();

  socket.on("delete", data => {

    const idToDelete = Number(data)
    manager.deleteProduct(idToDelete)

})
});

app.use("/home", homeRouter);
