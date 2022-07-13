import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button } from "reactstrap";
import { Constants } from "../../commons/Constants";
import numberWithCommas from "../../commons/numberwithCommas";
import orderService from "../../services/shipper-service/order.service";
import storageService from "../../services/storage.service";

const Shipper = () => {
  let navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let loggedIn = storageService.get(Constants.loggedIn);
    if (!loggedIn) {
      navigate("/login");
    } else {
      let role = storageService.get(Constants.curRole);
      if (role !== Constants.ROLE_SHIPPER) {
        navigate("/forbidden");
      }
    }
  }, []);

  const getAllOrders = useCallback((userId) => {
    orderService.getAllOrder(userId).then((data) => {
      setOrders(data);
    });
  }, []);

  useEffect(() => {
    let userId = storageService.get(Constants.curUser);
    getAllOrders(userId);
  }, [getAllOrders]);

  const handleRemoveOrder = (orderId) => {
    let userId = storageService.get(Constants.curUser);
    orderService.removeOrder(orderId).then((data) => {
      if (data) {
        alert("Đã xóa đơn hàng");
        getAllOrders(userId);
      }
    });
  };

  const handleNextOrder = (id) => {
    let userId = storageService.get(Constants.curUser);
    orderService.nextOrderStatus(id).then((data) => {
      if (data) {
        alert("Đã giao thành công");
        getAllOrders(userId);
      }
    });
  };

  console.log(orders);

  return (
    <Container className="pt-5">
      <Table striped bordered className="table text-center bg-white">
        <thead>
          <tr>
            <th scope="row">STT</th>
            <td>Tên hàng</td>
            <td>Người nhận</td>
            <td>Địa chỉ</td>
            <td>Số điện thoại</td>
            <td>Tổng tiền</td>
            <td>Trạng thái</td>
            <td>Hủy giao đơn</td>
          </tr>
        </thead>

        <tbody>
          {orders &&
            orders.length > 0 &&
            orders.map((item, index) => (
              <tr key={index}>
                <th scope="row">{item.ordersId}</th>
                <td className="w-30">{`Đơn hàng số ${index + 1}`}</td>
                <td className="w-30">{item.user.fullName}</td>
                <td>{item.address}</td>
                <td>{item.phoneNumber}</td>
                <td>{numberWithCommas(item.totalAmount)}</td>
                <td>
                  <Button 
                  className="w-100% btn-click max-w-[120px] h-[60px] bg-brand"
                  onClick={() => handleNextOrder(item.ordersId)}
                  style={{fontSize : '18px'}}>
                    Xác nhận đã giao
                  </Button>
                </td>
                <td>
                  <Button color="primary" 
                  className="btn-click max-w-[120px] h-[60px] bg-brand" 
                  onClick={() => handleRemoveOrder(item.ordersId)}
                  style={{fontSize : '18px'}}>
                    Hủy
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Shipper;
