import HttpService from "../http-service";

class SupplierService extends HttpService {
  async getAllSupplier() {
    try {
      const response = await this.get("/suppliers");

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSupplierById(id) {
    try {
      const response = await this.get(`/suppliers/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createNewSupplier({ supplierName }) {
    try {
      const response = await this.post("/suppliers", {
        body: {
          supplierName,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteSupplier(payload) {
    try {
      const response = await this.delete(`/suppliers/${payload}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async editInforSupplier(payload, { supplierImage, supplierName }) {
    try {
      const response = await this.patch(`/suppliers/${payload}`, {
        body: {
          supplierImage: null,
          supplierName,
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new SupplierService();
