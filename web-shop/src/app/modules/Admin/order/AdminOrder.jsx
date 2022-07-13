import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";
import { GlobalState } from "../../../../GlobalState";
import numberWithCommas from "../../../commons/numberwithCommas";
import orderService from "../../../services/orders/order.service";
import "./order.scss";
const listOrderStatus = [
  {
    tab: 1,
    title: "Đã giao hàng",
  },
  {
    tab: 2,
    title: "Chưa xác nhận",
  },
  {
    tab: 3,
    title: "Xác nhận",
  },
  {
    tab: 4,
    title: "Đã hủy",
  },
];

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  //const [titleStatus, setTitleStatus] = useState("");

  const [selectTab, setSelectTab] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [modal, setModal] = useState(false);
  const [productOrders, setProductOrders] = useState([]);

  const [selectedOrder, setselectedOrder] = useState(Object);
  const [modalConfirmDeleteShow, setModalConfirmDeleteShow] = useState(false);
  const handleClose = () => setModalConfirmDeleteShow(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedOrder1, setselectedOrder1] = useState(Object);
  const [modalConfirmNextStatusShow, setModalConfirmNextStatusShow] = useState(false);
  const handleClose1 = () => setModalConfirmNextStatusShow(false);


  const getAllOrders = useCallback(() => {
    orderService.getAllOrders(0).then((data) => {
      setOrders(data);
      setIsRunning(true);
    });
  }, []);

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  const handleNextStatus = (id) => {
    orderService.nextStatusOrders(id).then((data) => {
      setIsSubmitting(true);
      if (data) {
        setIsSubmitting(false);
        setModalConfirmNextStatusShow(false);
        getAllOrders();
        if (data.statusOrder === 'Approved') {
          alert("Đã duyệt thành công");
        }
        else {
          alert("Đã giao hàng thành công");
        }
      }   

    });
  };

  const handleCancelStatus = (orderId) => {
    orderService.cancelStatusOrders(orderId).then((data) => {
      setIsSubmitting(true);
      if (data) {
        setIsSubmitting(false);
        setModalConfirmDeleteShow(false);
        alert("Đã hủy đơn hàng");
        getAllOrders();
      }
    });
  };

  const handleChangePage = (e, page) => {
    setIsRunning(false);
    if (selectTab === 0) {
      orderService.getAllOrders(page - 1).then((data) => {
        if (data) {
          setOrders(data);
          setIsRunning(true);
        }
      });
    } else {
      orderService.getOrderByFilter(page - 1, selectTab).then((data) => {
        if (data) {
          setOrders(data);
          setIsRunning(true);
        }
      });
    }
  };
  const handleModal = () => {
    setModal(!modal);
  };

  const handleShowProductOrder = (id) => {
    setModal(!modal);
    const productOrderAdmin = orders.filter((item) => item.orderId === id);
    setProductOrders(productOrderAdmin);
  };

  const handleOnTabFilter = (tab) => {
    setIsRunning(false);
    setSelectTab(tab)
    orderService.getOrderByFilter(0, tab).then((data) => {
      if (data) {
        setOrders(data);
        setIsRunning(true);
      }
    });
  }

  // useEffect(() => {
  //   const orderUpdate = [...orders];
  //   const ordersDelivered = orderUpdate.filter(
  //     (item) => item.statusOrder === "Delivered"
  //   );
  //   const ordersNotApp = orderUpdate.filter(
  //     (item) => item.statusOrder === "Not approved"
  //   );
  //   const ordersApp = orderUpdate.filter(
  //     (item) => item.statusOrder === "Approved"
  //   );
  //   const ordersCancel = orderUpdate.filter(
  //     (item) => item.statusOrder === "Cancelled"
  //   );
  //   switch (selectTab) {
  //     case 1:
  //       setOrdersPageUpdate(ordersDelivered);
  //       break;
  //     case 2:
  //       setOrdersPageUpdate(ordersNotApp);
  //       break;
  //     case 3:
  //       setOrdersPageUpdate(ordersApp);
  //       break;
  //     case 4:
  //       setOrdersPageUpdate(ordersCancel);
  //       break;
  //     default:
  //       // setOrdersPageUpdate(orders);
  //       break;
  //   }
  // }, [selectTab]);

  // const orderArr = selectTab === 0 ? orders : ordersPageUpdate
  const onButtonDeleteClick = (order) => {
    setselectedOrder(order);
    setModalConfirmDeleteShow(true);
  };

  const onButtonNextStatusClick = (order) => {
    setselectedOrder1(order);
    setModalConfirmNextStatusShow(true);
  };

  return (
    <Fragment>
      {!isRunning ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <div style={{
          padding: ' 10px  50px',
        }}>
          <div className="bg-gray-600 flex z-10 text-white justify-around mt-8">
            {listOrderStatus.map((item, idx) => (
              <div
                key={idx}
                className="block p-4 transition-all duration-100 hover:bg-brand-dark cursor-pointer"
                onClick={() => handleOnTabFilter(item.tab)}
              >
                {item.title}
              </div>
            ))}
          </div>
          <div className="h-[600px] overflow-auto">
            <Table
              striped
              bordered
              className="table table-hover text-center bg-white  text-[14px]"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ngày tạo đơn</th>
                  <th>Note</th>
                  <th>Địa chỉ</th>
                  <th>Phone</th>
                  <th>Tổng số tiền</th>
                  <th>Trạng thái</th>
                  <th>Shipper</th>
                  <th>Người nhận</th>
                  <th></th>
                  <th>Duyệt</th>
                  <th>Hủy đơn</th>
                </tr>
              </thead>
              {orders.map((item, index) => (
                <Fragment key={index}>
                  <tbody>
                    <tr>
                      <th scope="row">{item.orderId}</th>
                      <td>{item.date}</td>
                      <td>{item.note}</td>
                      <td>{item.address}</td>
                      <td>{item.phoneNumber}</td>
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
                      <td>{item.nameShipper}</td>
                      <td>{item.user.fullName}</td>
                      <td
                        className="underline cursor-pointer"
                        onClick={() => handleShowProductOrder(item.orderId)}
                      >
                        Chi tiết
                      </td>
                      {item.statusOrder === "Cancelled" ||
                        item.statusOrder === "Delivered" ? (
                        <td></td>
                      ) : (
                        <>
                          <td>
                            <Button
                              className="w-100% btn-click max-w-[120px] h-[40px]"


                              //onClick={() => handleNextStatus(item.orderId)}
                              onClick={
                                () =>
                                  onButtonNextStatusClick({
                                    id: item.orderId,
                                    name: item.user.fullName,
                                    statusOrder: item.statusOrder
                                  })
                              }
                            >
                              {`${item.statusOrder === "Approved"
                                ? "Xác nhận đã giao"
                                : "Duyệt"
                                }`}
                            </Button>
                          </td>
                          <td>
                            <Button
                              onClick={
                                () =>
                                  onButtonDeleteClick({
                                    id: item.orderId,
                                    name: item.user.fullName,
                                  })
                              }
                              className="btn-click max-w-[100px] h-[40px]"
                            >
                              Hủy đơn
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </Fragment>
              ))}
              <Modal
                className="bg-secondary"
                isOpen={modal}
                toggle={handleModal}
              >
                <ModalHeader toggle={handleModal}>
                  Danh sách sản phẩm
                </ModalHeader>
                <ModalBody>
                  <Table
                    striped
                    bordered
                    className="table table-hover text-center bg-white"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <td>Tên sản phẩm</td>
                        <td>Giá tiền</td>
                        <td>Số lượng</td>
                        <td>Xem chi tiết</td>
                      </tr>
                    </thead>
                    {productOrders.length > 0 &&
                      productOrders[0].products.map((item, index) => (
                        <tbody>
                          <tr>
                            <th scope="row">{item.productId}</th>
                            <td className="flex items-center">
                              <img
                                src={item.productImage}
                                alt="#"
                                className="rounded-full w-[100px] h-[100px]"
                              />
                              <div className="ml-4">{item.productName}</div>
                            </td>
                            <td>{`Giá: ${numberWithCommas(
                              item.unitPrice -
                              item.unitPrice * (item.discount / 100) || 0
                            )} VND`}
                            </td>
                            <td>{numberWithCommas(item.quantity)}</td>
                            <td>
                              <Link to={`/products/${item.productId}`}>
                                <button style={{fontSize:'15px'}}>Chi tiết</button>
                              </Link>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                  </Table>
                </ModalBody>
              </Modal>

            </Table>

            <Modal className="bg-secondary" isOpen={modalConfirmDeleteShow} toggle={handleClose}>
              <ModalHeader>Hủy đơn hàng</ModalHeader>
              <ModalBody>
                {`Bạn có muốn hủy đơn hàng "${selectedOrder.id}" của khách hàng "${selectedOrder.name} không?`}
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-primary"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={() => handleCancelStatus(selectedOrder.id)}
                >
                  Xác nhận
                </Button>
                <Button className="bg-dark" onClick={handleClose}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>

            <Modal className="bg-secondary" isOpen={modalConfirmNextStatusShow} toggle={handleClose1}>
              <ModalHeader>Duyệt đơn hàng</ModalHeader>
              <ModalBody>

                {`${selectedOrder1.statusOrder === "Approved"
                  ? "Bạn muốn xác nhận đơn hàng của " + `${selectedOrder1.name}` + " đã được giao"
                  : "Bạn muốn duyệt đơn hàng của " + `${selectedOrder1.name}`
                  }`}
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-primary"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={() => handleNextStatus(selectedOrder1.id)}
                >
                  Chấp nhận
                </Button>
                <Button className="bg-dark" onClick={handleClose1}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>

          </div>
        </div>
      )}
      <Container className="flex justify-center">
        <div className="py-4">
          <Pagination
            count={20}
            color="primary"
            className="bg-white rounded-lg"
            size="large"
            onChange={handleChangePage}
          />
        </div>
      </Container>
    </Fragment>
  );
};

export default AdminOrder;
