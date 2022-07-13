import HttpService from "../http-service";

class OrderService extends HttpService {
  async getAllOrders(page) {
    try {
      const response = await this.get("/orders", {
        params: {
            "page": page
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async nextStatusOrders(payload) {
    try {
      const response = await this.post(`/orders/${payload}/status`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async cancelStatusOrders(payload) {
    try {
      const response = await this.post(`/orders/${payload}/status-cancel`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createNewOrders(userId, orderProductDTOS, {address, phoneNumber}) {
    try {
      const response = await this.post(`/orders/${userId}`, {
        body: {
          address,
          note: null,
          orderProductDTOS,
          phoneNumber,
          statusOrder: null
        }
      });

      return response.data;
    } catch (error) {
      alert("Số lượng hàng đã hết")
      throw new Error(error.message);
    }
  }
  async createNewOrdersPayment(userId, orderProductDTOS, {address, phoneNumber}, statusCode) {
    try {
      const response = await this.post(`/orders/${userId}/order`, {
        body: {
          address,
          note: null,
          orderProductDTOS,
          phoneNumber,
          statusOrder: null,
          statusCode
        }
      });

      return response.data;
    } catch (error) {
      alert("Số lượng hàng đã hết")
      throw new Error(error.message);
    }
  }
  async getAllOdersByUserId(payload) {
    try {
      const response = await this.get(`/orders/${payload}/user`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getRevenue(start, end) {
    try {
      const response = await this.get(`/orders/date-revenue/${start}/${end}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getRevenueByYear(year) {
    try {
      const response = await this.get(`/orders/year-revenue`, {
        params: {
          year
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteOrder(id) {
    try {
      const response = await this.delete(`/orders/delete/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getOrderByFilter(page, type) {
    try {
      const response = await this.get(`/orders/filter`, {
        params: {
          page, type
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new OrderService();