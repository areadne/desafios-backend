import fs, { read } from "fs";

export class ProductManager {
    #path
    #format
    #array
  constructor(path) {
    this.#path = path;
    this.#format = "utf-8";
    this.#array = [];
  }

  validateData = (argumentToValidate, stringToShow) => {
    if (argumentToValidate) {
      console.log(stringToShow);
      return;
    }
  };

  orderArray = (arrayToOrder) => {
    arrayToOrder.sort((a, b) => {
        if (a.id > b.id) {
          return 1;
        }

        if (a.id < b.id) {
          return -1;
        }

        return 0;
      });

      this.writeFileFunction(arrayToOrder);
  }

  readJSON = async () => {
    return JSON.parse(await fs.promises.readFile(this.#path, this.#format));
  };

  writeFileFunction = async (array) => {
    await fs.promises.writeFile(this.#path, JSON.stringify(array, null, "\t"));
  };

  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status
  ) => {
    let id;

    let readFile = await this.readJSON();

    id = readFile.length === 0 ? 1 : readFile[readFile.length - 1].id + 1;

    let array = [];

    array.push({
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    });

    const nuevoItem = {
      id: id,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      category: category,
      status: status,
    };
    let newArray;

    if (readFile.length === 0) {
      try {
        this.writeFileFunction(array);
      } catch (error) {
        console.error("ha ocurrido un error con el archivo", error);
      }
    } else {
      newArray = [...readFile, nuevoItem];

      this.orderArray(newArray)

      this.writeFileFunction(newArray);
    }
  };

  getProduct = async () => {
    this.validateData(!fs.existsSync(this.#path), "file not found");

    try {
      let readFile = await this.readJSON();
      console.log(readFile);
    } catch (error) {
      console.error(error);
    }
  };

  getProductById = async (id) => {
    this.validateData(!fs.existsSync(this.#path), "file not found");

    let readFile = await this.readJSON();

    let search = readFile.find((el) => el.id === id);

    search ? search : (search = "Not found");

    return search;
  };

  updateProduct = async (
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status
  ) => {
    this.validateData(!fs.existsSync(this.#path), "file not found");

    let readdFileToUpdate = await this.readJSON();

    const itemFounded = readdFileToUpdate.filter((item) => item.id === id);

    this.validateData(!itemFounded, "id not found");

    const nuevoItem = {
      id: id,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      category: category,
      status: status,
    };

    const otherItemInArray = readdFileToUpdate.filter((item) => item.id != id);

    let newArray;

    if (otherItemInArray.length === 0) {
      newArray = [nuevoItem];

      this.writeFileFunction(newArray);

      this.getProduct();
    } else {
      newArray = [...otherItemInArray, nuevoItem];

      this.orderArray(newArray)

    }
  };

  deleteProduct = async (id) => {
    this.validateData(!fs.existsSync(this.#path), "file not found");

    const readFile = await this.readJSON();

    const deleteItem = readFile.find((item) => item.id === id);

    if (!deleteItem) {
      return "Not found";
    }

    let newArray = readFile.filter((item) => item.id != id);

    this.#array.push(newArray);

    this.writeFileFunction(newArray);
  };
}