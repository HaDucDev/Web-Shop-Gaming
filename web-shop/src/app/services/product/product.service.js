import HttpService from "../http-service";

class ProductService extends HttpService {
  async getAllProduct(payload) {
    try {
      const response = await this.get("/products", {
        params: {
            "page": payload
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductById(payload) {
    try {
      const response = await this.get(`/products/${payload}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleleProduct(payload) {
    try {
      const response = await this.delete(`/products/${payload}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async changeProduct(payload, {descriptionProduct, discount, productName, quantity, unitPrice}) {
    try {
      const response = await this.patch(`/products/${payload}`, {
        body: {
          descriptionProduct, discount, productName, quantity, unitPrice
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductByCategory(categoryId, supplierId, page) {
    try {
      const response = await this.get(`products/search/final/${categoryId}/${supplierId}`, {
        params: {
          page
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async filterProduct({categoryId, supplierId, start, end}, page) {
    try {
      const response = await this.get(`products/search/final/${categoryId}/${supplierId}/price`, {
        params: {
          end,
          start,
          page,
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductByCategoryId(categoryId, page) {
    try {
      const response = await this.get(`products/${categoryId}/category`, {
        params: {
          page
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductBySupplierId(id, page) {
    try {
      const response = await this.get(`products/${id}/supplier`, {
        params: {
          page
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createNewProduct(cateId, supplierId, {descriptionProduct, discount, productName, quantity, unitPrice}) {
    try {
      const response = await this.post(`/products/${cateId}/${supplierId}`, {
        body: {
          descriptionProduct, discount, productName, quantity, unitPrice
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProductPrice(start, end, page) {
    try {
      const response = await this.get(`/products/price`, {
        params: {
          start,
          end,
          page
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async sreachProduct(search) {
    try {
      const response = await this.get(`/products/search`, {
        params: {
          q: search
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async changeImageProduct(id, file) {
    try {
      const response = await this.patch(`/products/${id}/avt`, {
        params: {
          file: file
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new ProductService();
