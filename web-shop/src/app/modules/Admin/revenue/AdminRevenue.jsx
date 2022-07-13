import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";
import orderService from "../../../services/orders/order.service";
import numberWithCommas from "../../../commons/numberwithCommas";
import { Table, Spinner } from "reactstrap";
import userService from "../../../services/user/user.service";
import './adminrevenue.scss'

const AdminRevenue = () => {
  const initData = {
    startDate: moment().add(-1, "months").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    totalMoney: 0,
    year: moment().format("YYYY"),
  };
  const [dateData, setDateData] = useState(initData);
  const [isRunning, setIsRunning] = useState(false);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [listSelling, setListSelling] = useState([]);

  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);

  useEffect(() => {
    orderService
      .getRevenue(dateData.startDate, dateData.endDate)
      .then((data) => {
        setDateData((prev) => ({
          ...prev,
          totalMoney: data.totalMoney,
        }));
        setListSelling(data.products);
        if (data) {
          setIsRunning(true);
        }
      });
  }, [dateData.startDate, dateData.endDate]);

  useEffect(() => {
    userService.getAllUser().then((data) => {
      setUsers(data);
    });
    orderService.getAllOrders().then((data) => {
      setOrders(data);
    });
  }, []);

  const handleRequestYear = () => {
    orderService.getRevenueByYear(dateData.year).then((data) => {
      setDateData((prev) => ({
        ...prev,
        totalMoney: data.totalMoney,
      }));
      setListSelling(data.products);
      if (data) {
        setIsRunning(true);
      }
    });
  };

  return (
    <div className="pb-[80px]">
      {!isRunning ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <div style={{
          padding: ' 10px  50px',
        }}>
          <h1 className="text-[50px] font-semibold text-[26px] m-0" >Tổng doanh thu</h1>
          <h1 className="text-red-600 text-[22px]">
            Chọn mốc thời gian tính doanh thu
          </h1>
          <div className="flex justify-content-center">
            <button onClick={() => setShowMonth(!showMonth)} className="text-[16px] my-[5px] max-w-[200px]">
              Doanh thu tháng
            </button>
            <button className="ml-4 text-[16px] my-[5px] max-w-[200px]" onClick={() => setShowYear(!showYear)}>
              Doanh thu năm
            </button>
          </div>

          {showMonth && (
            <div className="flex justify-between my-4 max-w-[25%] mx-auto">
              <input
                type="date"
                value={dateData.startDate}
                onChange={(e) =>
                  setDateData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="px-4 cursor-pointer text-lg"
              />
              <input
                type="date"
                value={dateData.endDate}
                onChange={(e) =>
                  setDateData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="ml-4 px-4 cursor-pointer text-lg"
              />
            </div>
          )}
          {showYear && (
            <div className="flex max-w-[50%] mx-auto items-center justify-content-center">
              <input
                className="min-h-[50px] m-0"
                type="number"
                placeholder="2022"
                onChange={(e) =>
                  setDateData((prev) => ({
                    ...prev,
                    year: e.target.value,
                  }))
                }
              />
              <button style={{backgroundColor: 'blue'}} className="max-h-[50px] max-w-[200px] ml-[10px]" onClick={handleRequestYear}>Lưu</button>
            </div>
          )}
          <h1 className="text-[24px] font-medium mt-[5px]" >
            Doanh thu: {numberWithCommas(dateData.totalMoney) + " VND"}
          </h1>

          <div className="flex justify-between mt-[5px] max-w-[50%] mx-auto">
            <div className="">
              <p>Khách hàng</p>
              <strong>{users.length}</strong>
            </div>
            <div className="">
              <p>Tổng đơn hàng</p>
              <strong>{orders.length}</strong>
            </div>
            <div className="">
              <p>Tổng sản phẩm bán chạy:</p>
              <strong>{listSelling.length}</strong>
            </div>
          </div>

          <h1 className="text-[26px] font-semibold mt-[10px] mb-[10px] ">
            Sản phẩm bán chạy nhất
          </h1>
          <div className="h-[370px] overflow-y-auto">
            <Table striped bordered className="table text-center bg-white text-[14px]">
              <thead>
                <tr>
                  <th scope="row">STT</th>
                  <td>Tên sản phẩm</td>
                  <td>Số lượng</td>
                  <td>Giá tiền</td>
                </tr>
              </thead>

              <tbody>
                {listSelling.length > 0 &&
                  listSelling.map((item, index) => (
                    <Fragment key={index}>
                      <tr>
                        <th scope="row">{index}</th>
                        <td className="flex items-center">
                          <div>
                            <img
                              src={item.productImage}
                              className="rounded-full w-[50px] h-[50px]"
                              alt=""
                            />
                          </div>
                          <div className="ml-2">{item.productName}</div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{numberWithCommas(item.unitPrice -
                          item.unitPrice * (item.discount / 100))}</td>
                      </tr>
                    </Fragment>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRevenue;
