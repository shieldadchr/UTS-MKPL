const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  editProductById,
  addFavoriteProduct,
  getFavoriteProducts,
  removeFavoriteProduct,
} = require("../product/product.service");

const {
  findProducts,
  findProductById,
  insertProduct,
  deleteProduct,
  editProduct,
} = require("../product/product.repository");

jest.mock("../product/product.repository");

// Mock product data
const mockProduct = {
  id: 1,
  name: "Test Product",
  price: 10.99,
};

const favoriteProducts = []; // Array untuk menyimpan ID produk favorit

describe("Product Service", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      // Arrange
      const mockProducts = [mockProduct, { ...mockProduct, id: 2 }];
      findProducts.mockResolvedValue(mockProducts);

      // Act
      const result = await getAllProducts();

      // Assert
      expect(findProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe("getProductById", () => {
    it("should return product by ID", async () => {
      // Arrange
      findProductById.mockResolvedValue(mockProduct);

      // Act
      const result = await getProductById(mockProduct.id);

      // Assert
      expect(findProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(result).toEqual(mockProduct);
    });

    it("should throw an error if product is not found", async () => {
      // Arrange
      findProductById.mockResolvedValue(null);

      // Act & Assert
      await expect(getProductById(mockProduct.id)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      // Arrange
      insertProduct.mockResolvedValue(mockProduct);

      // Act
      const result = await createProduct(mockProduct);

      // Assert
      expect(insertProduct).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteProductById", () => {
    it("should delete product by ID", async () => {
      // Arrange
      findProductById.mockResolvedValue(mockProduct);
      deleteProduct.mockResolvedValue(undefined);

      // Act
      await deleteProductById(mockProduct.id);

      // Assert
      expect(findProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(deleteProduct).toHaveBeenCalledWith(mockProduct.id);
    });

    it("should throw an error if product is not found", async () => {
      // Arrange
      findProductById.mockResolvedValue(null);

      // Act & Assert
      await expect(deleteProductById(mockProduct.id)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("editProductById", () => {
    it("should edit product by ID", async () => {
      // Arrange
      findProductById.mockResolvedValue(mockProduct);
      editProduct.mockResolvedValue(mockProduct);

      // Act
      const result = await editProductById(mockProduct.id, mockProduct);

      // Assert
      expect(findProductById).toHaveBeenCalledWith(mockProduct.id);
      expect(editProduct).toHaveBeenCalledWith(mockProduct.id, mockProduct);
      expect(result).toEqual(mockProduct);
    });

    it("should throw an error if product is not found", async () => {
      // Arrange
      findProductById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        editProductById(mockProduct.id, mockProduct)
      ).rejects.toThrow("Product not found");
    });
  });

  // Fitur Favorit Produk
  describe("Favorite Products", () => {
    test("should add a product to favorites", () => {
      addFavoriteProduct(1);
      expect(favoriteProducts).toContain(1);
    });

    test("should not add a duplicate product to favorites", () => {
      addFavoriteProduct(1);
      addFavoriteProduct(1); // Adding again
      expect(favoriteProducts).toHaveLength(1);
    });

    test("should return favorite products", async () => {
      findProducts.mockResolvedValue([
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ]);
      addFavoriteProduct(1);

      const favorites = await getFavoriteProducts();
      expect(favorites).toEqual([{ id: 1, name: "Product 1" }]);
    });

    test("should remove a product from favorites", () => {
      addFavoriteProduct(1);
      removeFavoriteProduct(1);
      expect(favoriteProducts).not.toContain(1);
    });
  });
});
