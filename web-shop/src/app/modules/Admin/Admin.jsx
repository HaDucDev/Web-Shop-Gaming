import React, {  useEffect, useState } from "react";
import { Link, Outlet,  useNavigate } from "react-router-dom";
import { Constants } from "../../commons/Constants";
import storageService from "../../services/storage.service";
import "./admin.scss";

const sidebarNav = [
  {
    id: 0,
    link: "/admin/reviews",
    section: "reviews",
    text: "Đánh giá",
  },
  {
    id: 1,
    link: "/admin/users",
    section: "users",
    text: "Tài khoản",
  },
  {
    id: 2,
    link: "/admin/products",
    section: "products",
    text: "Sản phẩm",
  },
  {
    id: 3,
    link: "/admin/orders",
    section: "orders",
    text: "Đơn hàng",
  },
  {
    id: 4,
    link: "/admin/category",
    section: "category",
    text: "Danh mục",
  },
  {
    id: 5,
    link: "/admin/supplier",
    section: "supplier",
    text: "Nhà cung cấp",
  },
  {
    id: 6,
    link: "/admin/revenue",
    section: "supplier",
    text: "Thống kê",
  },
];

const Admin = () => {
  let navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  //const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let loggedIn = storageService.get(Constants.loggedIn);
    if (!loggedIn) {
      navigate("/login");
    } else {
      let role = storageService.get(Constants.curRole);
      if (role !== Constants.ROLE_ADMIN) {
        navigate("/forbidden");
      }
    }
  }, []);
  return (
    <div className="admin">
      <div className="sidebar">
        <div className="sidebar_menu">
          <img
            className="w-24 h-24 md:w-48 md:h-auto my-4 border-2 border-purple-900 rounded-full mx-auto"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwbGozsS9QP10p16rZiCrQD0koXVkI4c7LwUHab9dkmFRcN0VqCkB37f2y0EnySItwykg&usqp=CAU"
            alt=""
            width="200"
            height="200"
          />
          {sidebarNav.length > 0 &&
            sidebarNav.map((nav, index) => (
              <Link
                to={nav.link}
                key={index}
                className={`sidebar_menu_item ${
                  activeIndex === index && "active"
                } relative`}
                onClick={() => setActiveIndex(nav.id)}
              >
                <div className="sidebar_menu_item_txt">{nav.text}</div>
              </Link>
            ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Admin;
