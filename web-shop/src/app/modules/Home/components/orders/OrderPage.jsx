import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";
import React, { Fragment, useCallback, useEffect, useState } from "react";

import { Container } from "reactstrap";
import { Constants } from "../../../../commons/Constants";
import numberWithCommas from "../../../../commons/numberwithCommas";
import orderService from "../../../../services/orders/order.service";
import storageService from "../../../../services/storage.service";
import reviewService from "../../../../services/reviews/review.service";
import "./order-page.scss";
import { Rating } from "@mui/material";
import cartService from "../../../../services/cartProduct/cart.service";
// import { useQuery, useQueryClient } from "react-query";
// import { useLocation } from "react-router-dom";

const arr = [];
const OrderPage = () => {
  const listOrderStatus = [
    {
      tab: 1,
      title: "|Đơn hàng chưa xác nhận|",
    },
    {
      tab: 2,
      title: "|Đơn hàng đang giao|",
    },
    {
      tab: 3,
      title: "|Đơn hàng đã giao hàng|",
    },
    {
      tab: 4,
      title: "|Đơn hàng đã hủy|",
    },
  ];
  //const resultCode = useLocation();
  const [ordersPage, setOrdersPage] = useState([]);
  const [ordersPageUpdate, setOrdersPageUpdate] = useState([]);
  const [showBtnReview, setShowBtnReview] = useState(false);
  const [modal, setModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [arrProduct, setArrProduct] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [productId, setProductId] = useState("");
  const [selectTab, setSelectTab] = useState(0);
  const [orderProductDTOS, setOrderProductDTOS] = useState([]);

  const [selectedOrder, setselectedOrder] = useState(Object);
  const [modalConfirmDeleteShow, setModalConfirmDeleteShow] = useState(false);
  const handleClose = () => setModalConfirmDeleteShow(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAllOrders = useCallback(() => {
    const userId = storageService.get(Constants.curUser);
    orderService.getAllOdersByUserId(userId).then((data) => {
      if (data) {
        setOrdersPage(data);
        setIsRunning(true);
        console.log(data);
      }
    });
  }, []);

  useEffect(() => {
    let userId = storageService.get(Constants.curUser);

    getAllOrders();

    cartService.getAllCart(userId).then((data) => {
      data.map((item) => {
        const allOrders = Object.assign({
          productId: item.productId,
          price: item.unitPrice,
          quality: item.quantity,
        });
        arr.push(allOrders);
        console.log(arr);
        return setOrderProductDTOS(arr);
      });
    });
  }, [getAllOrders]);

  const location = window.location.href;

  const getResultCode = (str) => {
    let s = str.split("&").filter((item) => item.includes("resultCode"));

    let res = s && s.length > 0 ? s[0] : null;

    if (res) {
      return res.split("=")[1];
    }
    return null;
  };

  useEffect(() => {
    let payment = storageService.get(Constants.payment);

    if (+payment === 1) {
      let userId = storageService.get(Constants.curUser);
      let address = storageService.get(Constants.address);
      let phoneNumber = storageService.get(Constants.phoneNumber);
      const resultCode = getResultCode(location);
      orderService
        .createNewOrdersPayment(
          userId,
          orderProductDTOS,
          { address, phoneNumber },
          Number(resultCode)
        )
        .then((data) => {
          getAllOrders();
        });
      storageService.set(Constants.payment, 0);
    }
  }, [orderProductDTOS, location]);

  const showButtonReview = () => {
    setShowBtnReview(!showBtnReview);
  };

  const handleDeleteOrder = (orderId) => {
    orderService.cancelStatusOrders(orderId).then((data) => {
      setIsSubmitting(true);
      if (data) {
        setIsSubmitting(false);
        setModalConfirmDeleteShow(false);
        window.location.reload();
        alert("Đã hủy đơn hàng");
        getAllOrders();
      }
    });
  };

  const handleShowProductOrder = (orderId) => {
    const arrProduct = ordersPage.filter((item) => item.orderId === orderId);
    setArrProduct(arrProduct);
    setShowPopup(true);
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const [valueReviewInput, setValueReviewInput] = useState({
    comments: "",
    rating: 3,
  });

  const handleAddReview = () => {
    const orderId = arrProduct[0].orderId;
    const userId = arrProduct[0].user.userId;
    reviewService
      .createNewReview(valueReviewInput, orderId, userId, productId)
      .then((data) => {
        if (data) {
          alert("Đã đánh giá thành công");
          setModal(!modal);
        }
      });
  };

  useEffect(() => {
    const orderUpdate = [...ordersPage];
    const ordersDelivered = orderUpdate.filter(
      (item) => item.statusOrder === "Delivered"
    );
    const ordersNotApp = orderUpdate.filter(
      (item) => item.statusOrder === "Not approved"
    );
    const ordersApp = orderUpdate.filter(
      (item) => item.statusOrder === "Approved"
    );
    const ordersCancel = orderUpdate.filter(
      (item) => item.statusOrder === "Cancelled"
    );
    switch (selectTab) {
      case 3:
        setOrdersPageUpdate(ordersDelivered);
        break;
      case 1:
        setOrdersPageUpdate(ordersNotApp);
        break;
      case 2:
        setOrdersPageUpdate(ordersApp);
        break;
      case 4:
        setOrdersPageUpdate(ordersCancel);
        break;
      default:
        setOrdersPageUpdate(ordersPage);
        break;
    }
  }, [selectTab]);

  console.log(orderProductDTOS);

  const orderArr =
    ordersPageUpdate.length === 0 ? ordersPage : ordersPageUpdate;


  const onButtonDeleteClick = (order) => {
    setselectedOrder(order);
    setModalConfirmDeleteShow(true);
  };
  return (
    <Fragment>
      {!isRunning ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <Container className="w-full mt-5 flex items-center flex-wrap">
          <div className="bg-gray-600 flex rounded-base z-10 text-white justify-around mt-8">
            {listOrderStatus.map((item, idx) => (
              <div
                key={idx}
                className="block p-4 transition-all duration-100 hover:bg-brand-dark cursor-pointer"
                onClick={() => setSelectTab(item.tab)}
              >
                {item.title}
              </div>
            ))}
          </div>
          <Table bordered hover className="mt-4 bg-white">
            <thead>
              <tr>
                <th>STT</th>
                <th>Ngày tạo</th>
                <th>Note</th>
                <th>Đơn hàng</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orderArr.map((item, idx) => (
                <tr>
                  <td>{item.orderId}</td>
                  <td>{item.date}</td>
                  <td>{item.note}</td>
                  <td>Đơn hàng số {idx + 1}</td>
                  <td>{numberWithCommas(item.totalAmount)}</td>
                  <td>
                    {item.statusOrder === "Delivered"
                      ? "Đã giao hàng"
                      : item.statusOrder === "Not approved"
                        ? "Chưa phê duyệt"
                        : item.statusOrder === "Approved"
                          ? "Đã phê duyệt"
                          : "Đã hủy"}
                  </td>
                  <td
                    className="underline text-blue-600 hover:text-blue-600 cursor-pointer"
                    onClick={() => handleShowProductOrder(item.orderId)}
                  >
                    Chi tiết
                  </td>
                  {item.statusOrder === "Not approved" && (
                    <td
                      className="underline text-red-600 hover:text-blue-600 cursor-pointer"
                      // onClick={() => handleDeleteOrder(item.orderId)}
                      onClick={
                        () =>
                          onButtonDeleteClick({
                            id: item.orderId,
                            //name: item.user.fullName,
                          })
                      }
                    >
                      Hủy đơn hàng
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <Modal className="bg-secondary" isOpen={modal} toggle={handleModal}>
            <ModalHeader toggle={handleModal}>Đánh giá sản phẩm</ModalHeader>
            <ModalBody>
              <div className="mr-10">
                <label className="mr-4">Comment</label>
                <input
                  type="text"
                  className="w-full"
                  onChange={(e) =>
                    setValueReviewInput({
                      ...valueReviewInput,
                      comments: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mt-2">
                <div className="mr-4">Rating</div>
                <Rating
                  name="size-large"
                  value={valueReviewInput.rating}
                  onChange={(event, newValue) =>
                    setValueReviewInput({
                      ...valueReviewInput,
                      rating: newValue,
                    })
                  }
                  size="large"
                  sx={{
                    fontSize: "10rem",
                  }}
                />
              </div>
              <div className="my-2">Chọn sản phẩm đánh giá</div>
              <Input
                type={"select"}
                size="3"
                value={null}
                onChange={(e) => setProductId(e.target.value)}
                required
                className="h-[150px] overflow-y-auto"
              >
                {arrProduct[0] &&
                  arrProduct[0].products.map((item, idx) => (
                    <option value={item.productId}>{item.productName}</option>
                  ))}
              </Input>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-primary"
                color="primary"
                onClick={() => handleAddReview()}
              >
                Xác nhận
              </Button>
              <Button className="bg-dark" onClick={handleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          {showPopup && (
            <div className="fixed bg-gray-500 h-screen w-screen inset-0 flex items-center justify-center z-30">
              <div className="relative w-[1000px] min-h-[500px] bg-white p-4 rounded-lg">
                <div
                  className="absolute top-0 right-0 z-10 mr-2 cursor-pointer rotate-45 text-[30px]"
                  onClick={() => setShowPopup(false)}
                >
                  +
                </div>
                <h1 className="text-[50px] font-semibold">
                  Các sản phẩm đã mua
                </h1>
                <div className="flex justify-around text-indigo-600 text-[16px] mt-3">
                  <div className="font-medium">
                    Họ tên: {arrProduct[0].user.fullName}
                  </div>
                  <div className="font-medium">
                    Số điện thoại: {arrProduct[0].phoneNumber}
                  </div>
                  <div className="font-medium">
                    Địa chỉ: {arrProduct[0].address}
                  </div>
                  <div className="font-medium">
                    Trạng thái:
                    {arrProduct[0].statusOrder === "Delivered"
                      ? "Đã giao hàng"
                      : arrProduct[0].statusOrder === "Not approved"
                        ? "Chưa phê duyệt"
                        : arrProduct[0].statusOrder === "Approved"
                          ? "Đã phê duyệt"
                          : "Đã hủy"}
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <Table striped bordered hover height="300" className="mt-4">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Đơn hàng</th>
                        <th className="text-center">Số tiền</th>
                        <th>Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arrProduct[0].products.map((item, idx) => {
                        return (
                          <Fragment key={idx}>
                            <tr>
                              <td>{item.productId}</td>
                              <td>{item.productName}</td>
                              <td>
                                {numberWithCommas(
                                  item.unitPrice -
                                  (item.discount / 100) * item.unitPrice
                                )}
                              </td>
                              <td>{item.quantity}</td>
                            </tr>
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
                <div className="flex items-center w-full pt-4 text-center">
                  <div className="flex-1">
                    <div className="text-[30px] font-semibold">
                      Tổng số tiền
                    </div>
                    <div className="text-[30px] font-semibold text-red-600">
                      {numberWithCommas(arrProduct[0].totalAmount) + " VND"}
                    </div>
                  </div>
                  {arrProduct[0].statusOrder === "Delivered" && (
                    <div className="flex items-center">
                      {showBtnReview && (
                        <div
                          className="flex items-center rounded-lg cursor-pointer text-white h-[50px] ml-2 mr-4 px-2 py-1 bg-brand"
                          onClick={handleModal}
                        >
                          Đánh giá sản phẩm
                        </div>
                      )}
                      <div
                        className="flex items-center rounded-lg cursor-pointer text-white h-[50px] ml-2 px-2 py-1 bg-brand-dark"
                        onClick={showButtonReview}
                      >
                        Đã nhận được hàng
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          <Modal className="bg-secondary" isOpen={modalConfirmDeleteShow} toggle={handleClose}>
            <ModalHeader>Hủy đơn hàng</ModalHeader>
            <ModalBody>
              {`Bạn có muốn hủy đơn hàng "${selectedOrder.id}" của bạn không?`}
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-primary"
                color="primary"
                disabled={isSubmitting}
                onClick={() => handleDeleteOrder(selectedOrder.id)}
              >
                Xác nhận
              </Button>
              <Button className="bg-dark" onClick={handleClose}>
                Không
              </Button>
            </ModalFooter>
          </Modal>

          <div className="mt-4 mb-[100px] p-4 w-full bg-white rounded-lg">
            <img
              src="https://www.ketnoitieudung.vn/data/ck/images/Freeship%20th%C3%A1ng%2012.jpg"
              alt=""
            />
          </div>
        </Container>
      )}
    </Fragment>
  );
};

export default OrderPage;
