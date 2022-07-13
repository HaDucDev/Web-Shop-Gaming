import axios from "axios";
import storageService from "../storage.service";

class HttpService {
  async get(uri, options = { headers: {}, params: {}, body: {} }) {
    return await this.request("GET", uri, options);
  }

  async post(uri, options = { headers: {}, params: {}, body: {} }) {
    return await this.request("POST", uri, options);
  }

  async request(method, uri, options = { headers: {}, params: {}, body: {} }) {
    return await axios.request({
      method: method,
      baseURL: "https://test-payment.momo.vn",
      url: uri,
      headers: this.generateHttpHeaders(options.headers),
      params: options.params,
      data: options.body,
    });
  }

  generateHttpHeaders(headerInfo) {
    const headers = {
      "Content-Type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "GET, POST, PUT",
      Authorization: `Bearer ${storageService.get("access_token")}`,
    };

    if (headerInfo) {
      for (const item of Object.keys(headerInfo)) {
        headers[item] = headerInfo[item];
      }
    }
    return headers;
  }
}

export default HttpService;
