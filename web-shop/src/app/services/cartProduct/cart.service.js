import HttpService from "../http-service";

class CartService extends HttpService {
  async getAllCart(payload) {
    try {
      const response = await this.get(`/carts/${payload}/product`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createNewCart(productId, userId, quantity) {
    try {
      const response = await this.post(`/carts`, {
        body: {
          productId,
          userId,
          quantity,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteCart(productId, userId) {
    try {
      const response = await this.delete(`/carts`, {
        body: {
          productId,
          userId
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new CartService();
