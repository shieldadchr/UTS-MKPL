const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("./product.repository");

const favoriteProducts = []; // Array untuk menyimpan ID produk favorit

const getAllProducts = async () => {
  const products = await findProducts();
  return products;
};

const getProductById = async (id) => {
  const product = await findProductById(id);

  if (!product) {
    throw Error("Product not found");
  }

  return product;
};

const createProduct = async (newProductData) => {
  const product = await insertProduct(newProductData);
  return product;
};

const deleteProductById = async (id) => {
  await getProductById(id);
  await deleteProduct(id);
};

const editProductById = async (id, productData) => {
  await getProductById(id);
  const product = await editProduct(id, productData);
  return product;
};

const searchProducts = async (query) => {
  const products = await findProducts();
  return products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );
};


const addFavoriteProduct = (productId) => {
  if (!favoriteProducts.includes(productId)) {
    favoriteProducts.push(productId);
  }
};

const getFavoriteProducts = async () => {
  const products = await findProducts();
  return products.filter(product => favoriteProducts.includes(product.id));
};

const removeFavoriteProduct = (productId) => {
  const index = favoriteProducts.indexOf(productId);
  if (index !== -1) {
    favoriteProducts.splice(index, 1);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
  addFavoriteProduct,
  getFavoriteProducts,
  removeFavoriteProduct,
};
