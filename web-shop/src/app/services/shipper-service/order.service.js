import HttpService from "../http-service";

class OrderService extends HttpService {
  async getAllOrder(payload) {
    try {
      const response = await this.get(`/orders/shipper/${payload}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async removeOrder(payload) {
    try {
      const response = await this.post(`orders/${payload}/remove-shipper`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async nextOrderStatus(payload) {
    try {
      const response = await this.post(`orders/${payload}/status`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new OrderService();
