const {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProductById,
  editProductById,
  DEFAULT_PRODUCT_LIMIT,
} = require("./product.service"); // Sesuaikan dengan jalur file yang sesuai
const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("./product.repository"); // Sesuaikan dengan jalur file yang sesuai

jest.mock("./product.repository"); // Memock repositori

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Menghapus semua mock sebelum setiap test
  });

  describe("getAllProducts", () => {
    it("should return products with default limit", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ];
      
      findProducts.mockResolvedValue(mockProducts); // Memock fungsi repositori

      const result = await getAllProducts(); // Memanggil fungsi tanpa parameter

      expect(findProducts).toHaveBeenCalledWith(DEFAULT_PRODUCT_LIMIT, 0); // Memeriksa pemanggilan dengan default limit dan offset
      expect(result).toEqual(mockProducts); // Memeriksa hasil yang diharapkan
    });

    it("should return products with specified limit and page", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ];
      
      findProducts.mockResolvedValue(mockProducts); // Memock fungsi repositori

      const result = await getAllProducts(2, 10); // Memanggil fungsi dengan halaman 2 dan limit 10

      expect(findProducts).toHaveBeenCalledWith(10, 10); // Memeriksa pemanggilan dengan limit 10 dan offset 10 (halaman 2)
      expect(result).toEqual(mockProducts); // Memeriksa hasil yang diharapkan
    });

    it("should handle no products found", async () => {
      findProducts.mockResolvedValue([]); // Memock tidak ada produk

      const result = await getAllProducts(1); // Memanggil fungsi dengan halaman 1

      expect(findProducts).toHaveBeenCalledWith(DEFAULT_PRODUCT_LIMIT, 0); // Memeriksa pemanggilan dengan default limit
      expect(result).toEqual([]); // Memeriksa hasil yang diharapkan
    });
  });

  describe("getProductById", () => {
    it("should return product by id", async () => {
      const mockProduct = { id: 1, name: "Product 1" };
      findProductById.mockResolvedValue(mockProduct); // Memock produk yang ditemukan

      const result = await getProductById(1); // Memanggil fungsi dengan id

      expect(findProductById).toHaveBeenCalledWith(1); // Memeriksa pemanggilan fungsi
      expect(result).toEqual(mockProduct); // Memeriksa hasil yang diharapkan
    });

    it("should throw an error if product is not found", async () => {
      findProductById.mockResolvedValue(null); // Memock produk tidak ditemukan

      await expect(getProductById(1)).rejects.toThrow("Product not found"); // Memeriksa apakah error dilempar
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const newProduct = { name: "New Product" };
      const mockProduct = { id: 1, ...newProduct };
      insertProduct.mockResolvedValue(mockProduct); // Memock hasil produk baru

      const result = await createProduct(newProduct); // Memanggil fungsi untuk membuat produk

      expect(insertProduct).toHaveBeenCalledWith(newProduct); // Memeriksa pemanggilan fungsi
      expect(result).toEqual(mockProduct); // Memeriksa hasil yang diharapkan
    });
  });

  describe("deleteProductById", () => {
    it("should delete a product by id", async () => {
      const mockProduct = { id: 1, name: "Product 1" };
      findProductById.mockResolvedValue(mockProduct); // Memock produk ditemukan
      deleteProduct.mockResolvedValue(); // Memock penghapusan berhasil

      await deleteProductById(1); // Memanggil fungsi untuk menghapus produk

      expect(findProductById).toHaveBeenCalledWith(1); // Memeriksa pemanggilan fungsi
      expect(deleteProduct).toHaveBeenCalledWith(1); // Memeriksa pemanggilan penghapusan
    });

    it("should throw an error if product is not found", async () => {
      findProductById.mockResolvedValue(null); // Memock produk tidak ditemukan

      await expect(deleteProductById(1)).rejects.toThrow("Product not found"); // Memeriksa apakah error dilempar
    });
  });

  describe("editProductById", () => {
    it("should edit a product by id", async () => {
      const mockProduct = { id: 1, name: "Product 1" };
      const updatedProduct = { name: "Updated Product" };
      findProductById.mockResolvedValue(mockProduct); // Memock produk ditemukan
      editProduct.mockResolvedValue({ ...mockProduct, ...updatedProduct }); // Memock hasil pengeditan

      const result = await editProductById(1, updatedProduct); // Memanggil fungsi untuk mengedit produk

      expect(findProductById).toHaveBeenCalledWith(1); // Memeriksa pemanggilan fungsi
      expect(editProduct).toHaveBeenCalledWith(1, updatedProduct); // Memeriksa pemanggilan edit
      expect(result).toEqual({ ...mockProduct, ...updatedProduct }); // Memeriksa hasil yang diharapkan
    });

    it("should throw an error if product is not found", async () => {
      findProductById.mockResolvedValue(null); // Memock produk tidak ditemukan

      await expect(editProductById(1, {})).rejects.toThrow("Product not found"); // Memeriksa apakah error dilempar
    });
  });
});
