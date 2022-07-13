import HttpService from "./http-service";

class AuthService extends HttpService {
  async login(username, password) {
    try {
      const response = await this.post("/auth/login", {
        body: {
          username,
          password,
        },
      });

      return response.data;
    } catch (error) {
      alert("Đăng nhập lỗi")
      throw new Error(error.message);
    }
  }
  async signUp({ email, fullName, phone, username, address }) {
    try {
      const response = await this.post("/auth/signup", {
        body: {
          avatar: null,
          email,
          fullName,
          phone,
          username,
          address
        },
      });

      return response.data;
    } catch (error) {
      alert(error.response.data.message);
      throw new Error(error.message);
    }
  }
  async forgotPassword(email) {
    try {
      const response = await this.get("/auth/generate-token-pass", {
        params: {
          email,
        },
      });

      return response.data;
    } catch (error) {
      alert("Lấy mã xác nhận không thành công. Bạn vui lòng kiểm tra lại email đã nhập")
      throw new Error(error.message);
    }
  }
  async forgotPasswordConfirm({ username, newPassword, token }) {
    try {
      const response = await this.post("/auth/new-password", {
        body: {
          username,
          newPassword,
          token,
        },
      });

      return response.data;
    } catch (error) {
      alert("Không thành công")
      throw new Error(error.message);
    }
  }
  async changePassword({ username, password, newPassword }) {
    try {
      const response = await this.post("/auth/change-password", {
        body: {
          username,
          password,
          newPassword,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new AuthService();
