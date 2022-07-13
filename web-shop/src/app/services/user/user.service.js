import { Constants } from "../../commons/Constants";
import HttpService from "../http-service";
import storageService from "../storage.service";

class UserService extends HttpService {
  async getAllUser(page) {
    try {
      const response = await this.get(`/users`, {
        params: {
          page: page,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addUser({ username, phone, email, fullName, address, roleId }) {
    try {
      const response = await this.post(`/users`, {
        body: {
          username,
          phone,
          email,
          fullName,
          avatar: null,
          address,
          roleId,
        },
      });

      return response.data;
    } catch (error) {
      //alert(error.response.data.message);
      alert("Thêm người dùng lỗi. Bạn vui lòng thử lại");
      throw new Error(error.message);
    }
  }

  async changeUser(
    payload,
    { username, phone, email, fullName, address, roleId }
  ) {
    try {
      const response = await this.patch(`/users/${payload}`, {
        body: {
          username,
          phone,
          email,
          fullName,
          address,
          roleId
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async changeUserInfoHome(
    payload,
    { username, phone, email, fullName, address }
  ) {
    let roleId = storageService.get(Constants.roleId);
    try {
      const response = await this.patch(`/users/${payload}`, {
        body: {
          username,
          phone,
          email,
          fullName,
          address,
          roleId
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteUser(payload) {
    try {
      const response = await this.delete(`/users/${payload}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getUserInfo(payload) {
    try {
      const response = await this.get(`/users/${payload}`);

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new UserService();
