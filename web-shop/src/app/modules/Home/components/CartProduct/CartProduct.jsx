import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Container,
  Table,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { GlobalState } from "../../../../../GlobalState";
import { Constants } from "../../../../commons/Constants";
import cartService from "../../../../services/cartProduct/cart.service";
import orderService from "../../../../services/orders/order.service";
import paymentService from "../../../../services/paymentMOMO/payment.service";
import storageService from "../../../../services/storage.service";
import ItemProduct from "./components/ItemProduct";
import userService from "../../../../services/user/user.service";
import numberWithCommas from "../../../../commons/numberwithCommas";
import "./cart-product.scss";

const arr = [];

const CartProduct = () => {
  const navigate = useNavigate();

  const ctx = useContext(GlobalState);
  const [isRunning, setIsRunning] = useState(false);
  const [carts, setCarts] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  const [orderProductDTOS, setOrderProductDTOS] = useState([]);
  const [cartModal, setCartModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const [value, setValue] = useState({
    address: "",
    phoneNumber: "",
  });
  const [valuePayment, setValuePayment] = useState({
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    let userId = storageService.get(Constants.curUser);
    userService.getUserInfo(userId).then((data) => {
      if (data) {
        setValue((prev) => ({
          ...prev,
          phoneNumber: data.phone,
          address: data.address,
        }));
        setValuePayment((prev) => ({
          ...prev,
          phoneNumber: data.phone,
          address: data.address,
        }));
      }
    });
  }, []);

  const getCart = useCallback(() => {
    let userId = storageService.get(Constants.curUser);
    let loggedIn = storageService.get(Constants.loggedIn);

    if (loggedIn && loggedIn !== undefined) {
      cartService.getAllCart(userId).then((data) => {
        setCarts(data);
      });
    } else {
      setCarts([]);
    }
  }, []);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const handleDeleteProduct = (productId) => {
    let userId = storageService.get(Constants.curUser);

    cartService.deleteCart(productId, Number(userId)).then((data) => {
      if (data) {
        alert("Đã xóa sản phẩm khỏi giỏ");
        getCart();
        ctx.setReload(Math.random());
      }
    });
  };

  const handleShowPayment = () => {
    if(total !==0)
    {
      setShowPayment(!showPayment);
    }
    else
    {
      alert("Số lượng sản phẩm hoặc đơn giá không hợp lệ")
    }
  };

  useEffect(() => {
    carts.length > 0 &&
      carts.map((item) => {
        const allOrders = Object.assign({
          productId: item.productId,
          price: item.unitPrice,
          quality: item.quantity,
        });
        arr.push(allOrders);
        console.log(arr);
        return setOrderProductDTOS(arr);
      });
  }, [carts.length]);

  const handleModalCart = () => {
    setCartModal(!cartModal);
    console.log(orderProductDTOS);
  };

  const handleModalCartPayment = () => {
    setPaymentModal(!paymentModal);
  };

  const handleOrdersCart = () => {
    let userId = storageService.get(Constants.curUser);
    setIsRunning(true);

    console.log(orderProductDTOS);

    orderService
      .createNewOrders(userId, orderProductDTOS, value)
      .then((data) => {
        if (data) {
          alert("Đặt hàng thành công");
          setCartModal(!cartModal);
          setIsRunning(false);
          navigate("/orders");
          window.location.reload();
        }
      });
  };

  const total = carts.reduce(
    (prev, cur) =>
      prev +
      (cur.unitPrice - (cur.discount / 100) * cur.unitPrice) * cur.quantity,
    0
  );
  const handlePayment = () => {
    setIsRunning(true);
    storageService.set(Constants.payment, 1);
    if (total > 50000000) {
      alert('Số tiền quá lớn. Vui lòng thanh toán khi nhận hàng')
      setPaymentModal(!paymentModal);
      setIsRunning(false);
      
    } else {
      paymentService.paymentMomo(total).then((data) => {
          setIsRunning(false);
          setPaymentModal(!paymentModal);
          // window.open(data.payUrl);
          window.location.replace(data.payUrl);
          // navigate("/orders");
      });
    }
  };

  // storageService.set(Constants.total, total);
  storageService.set(Constants.address, valuePayment.address);
  storageService.set(Constants.phoneNumber, valuePayment.phoneNumber);
  console.log("phone: ", valuePayment.phoneNumber)

  return (
    <Container className="mt-5 cardProduct">
      <Table>
        <tbody>
          <tr>
            <th scope="row">STT</th>
            <td className="w-50">Tên hàng</td>
            <td className="flex items-center justify-content-center">Số lượng</td>
            <td>Đơn giá</td>
            <td>Hủy mua</td>
          </tr>
        </tbody>
        {carts.length > 0 &&
          carts.map((item, index) => (
            <ItemProduct
              getCart={getCart}
              item={item}
              index={index}
              handleDeleteProduct={handleDeleteProduct}
            />
          ))}
      </Table>
      {carts.length > 0 && (
        <Button className="bg-success" onClick={handleShowPayment}>
          Đặt hàng
        </Button>
      )}
      {showPayment && carts.length > 0 && (
        <div className="d-flex">
          <Button className="bg-danger me-2" onClick={handleModalCart}>
            Thanh toán khi nhận hàng
          </Button>
          <Button className="bg-danger me-2" onClick={handleModalCartPayment}>
            Thanh toán online
          </Button>
        </div>
      )}
      <Modal
        className="bg-secondary"
        isOpen={cartModal}
        toggle={handleModalCart}
      >
        <ModalHeader toggle={handleModalCart}>
          Thanh toán khi nhận hàng
        </ModalHeader>
        <ModalBody>
          <Label>Địa chỉ</Label>
          <Input
            placeholder="enter address"
            type="text"
            value={value.address}
            onChange={(e) =>
              setValue({
                ...value,
                address: e.target.value,
              })
            }
          />
          <Label>Số điện thoại</Label>
          <Input
            placeholder="enter phone"
            type="text"
            value={value.phoneNumber}
            onChange={(e) =>
              setValue({
                ...value,
                phoneNumber: e.target.value,
              })
            }
          />
          <div className="h-[200px] overflow-y-auto">
            <Table className="text-center bg-white">
              <thead>
                <tr>
                  <th scope="row">STT</th>
                  <td className="w-50">Tên hàng</td>
                  <td>Số lượng</td>
                  <td>Đơn giá</td>
                </tr>
              </thead>
              <tbody>
                {carts.length > 0 &&
                  carts.map((item, index) => (
                    <ItemProduct
                      focus={true}
                      item={item}
                      index={index}
                      handleDeleteProduct={handleDeleteProduct}
                    />
                  ))}
              </tbody>
            </Table>
          </div>
          <div className="text-center text-red-600">
            Tổng số tiền: {numberWithCommas(total)} VND
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-primary"
            color="primary"
            onClick={() => handleOrdersCart()}
          >
            {isRunning && <Spinner color="light" size="sm"></Spinner>}
            Xác nhận
          </Button>
          <Button className="bg-dark" onClick={handleModalCart}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        className="bg-secondary"
        isOpen={paymentModal}
        toggle={handleModalCartPayment}
      >
        <ModalHeader toggle={handleModalCartPayment}>
          Thanh toán điện tử MOMO
        </ModalHeader>
        <ModalBody>
          <Label>Địa chỉ</Label>
          <Input
            placeholder="enter address"
            type="text"
            value={valuePayment.address}
            onChange={(e) =>
              setValuePayment({
                ...valuePayment,
                address: e.target.value,
              })
            }
          />
          <Label>Số điện thoại</Label>
          <Input
            placeholder="enter phone"
            type="text"
            value={valuePayment.phoneNumber}
            onChange={(e) =>
              setValuePayment({
                ...valuePayment,
                phoneNumber: e.target.value,
              })
            }
          />
          <div className="h-[200px] overflow-y-auto">
            <Table>
              <thead>
                <tr>
                  <th scope="row">STT</th>
                  <td className="w-50">Tên hàng</td>
                  <td>Số lượng</td>
                  <td>Đơn giá</td>
                </tr>
              </thead>
              {carts.length > 0 &&
                carts.map((item, index) => (
                  <ItemProduct
                    focus={true}
                    item={item}
                    index={index}
                    handleDeleteProduct={handleDeleteProduct}
                  />
                ))}
            </Table>
          </div>
          <div className="text-center text-red-600">
            Tổng số tiền: {numberWithCommas(total)} VND
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-primary"
            color="primary"
            onClick={() => handlePayment()}
          >
            {isRunning && <Spinner color="light" size="sm"></Spinner>}
            Xác nhận
          </Button>
          <Button className="bg-dark" onClick={handleModalCartPayment}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default CartProduct;
