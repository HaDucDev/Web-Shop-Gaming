import HttpService from "./http-service";
import hmacSHA256 from "crypto-js/hmac-sha256";
import Hex from "crypto-js/enc-hex";
import storageService from "../storage.service";
import { Constants } from "../../commons/Constants";

const LINK_WEB = "/orders";

let address = storageService.get(Constants.address);
const res = `${window.location.href}`
const linkURL = res.match(/http:\/\/localhost:3000/g)
class PaymentService extends HttpService {
  async paymentMomo(total) {
    const partnerCode = "MOMO7XKJ20220612";
    const partnerName = "Test";
    const storeId = "MoMoTestStore";
    const requestType = "captureWallet";
    const secretkey = "3ByWLLOo708Ptyc5Q5CoWnngNSM4vMEy";
    const ipnUrl = `${linkURL}${LINK_WEB}`;
    const accessKey = "dtwUCifariAsOfO8";
    const requestId = partnerCode + new Date().getTime();
    const orderId = "ID" + new Date().getTime();
    const orderInfo = "Thanh toán đơn hàng của bạn tại " + address;
    const redirectUrl = `${linkURL}${LINK_WEB}`;
    const amount = total > 50000000 ? 50000000 : total;
    const extraData = "";

    const rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    const signature = Hex.stringify(hmacSHA256(rawSignature, secretkey));

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: partnerName,
      storeId: storeId,
      requestType: requestType,
      ipnUrl: ipnUrl,
      redirectUrl: redirectUrl,
      orderId: orderId,
      amount: amount,
      lang: "vi",
      autoCapture: false,
      orderInfo: orderInfo,
      requestId: requestId,
      extraData: extraData,
      signature: signature,
    });
    try {
      const response = await this.post("/v2/gateway/api/create", {
        body: requestBody,
      });

      return response.data;
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thanh toán lại')
      throw new Error(error.message);
    }
  }
}

export default new PaymentService();
