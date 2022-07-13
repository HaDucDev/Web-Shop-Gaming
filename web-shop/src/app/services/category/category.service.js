import HttpService from "../http-service";

class CategoryService extends HttpService {
  async getAllCategory(payload) {
    try {
      const response = await this.get("/categories", {
        params: {
          all: payload
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createNewCategory(categoryName) {
    try {
      const response = await this.post("/categories", {
        body: {
          categoryName
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteCategory(payload) {
    try {
      const response = await this.delete(`/categories/${payload}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async editCategory(payload, value) {
    try {
      const response = await this.patch(`/categories/${payload}`, {
        body: {
          categoryName: value
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getCategoryById(payload) {
    try {
      const response = await this.get(`/categories/${payload}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new CategoryService();