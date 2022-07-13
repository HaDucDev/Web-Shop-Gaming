import React, { useContext, useEffect, useState } from "react";
import {
  NavLink,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

import {
  Cart,
  List,
  BoxArrowInRight,
  BoxArrowInLeft,
} from "react-bootstrap-icons";
import cartService from "../../../../services/cartProduct/cart.service";
import { GlobalState } from "../../../../../GlobalState";
import storageService from "../../../../services/storage.service";
import { Constants } from "../../../../commons/Constants";
import "./header.scss";
import userService from "../../../../services/user/user.service";

const Header = () => {
  const ctx = useContext(GlobalState);
  const loggedIn = storageService.get(Constants.loggedIn);
  const username = storageService.get(Constants.userInfo);
  const [open, setOpen] = useState(false);

  const [carts, setCarts] = useState([]);
  const [avatar, setAvatar] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let userId = storageService.get(Constants.curUser);

    cartService.getAllCart(userId).then((data) => {
      setCarts(data);
    });
    userService.getUserInfo(userId).then((data) => {
      if (data) {
        setAvatar(data.avatar);
      }
    });
  }, [ctx.reload]);

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleLogout = () => {
    storageService.remove(Constants.accessToken);
    storageService.remove(Constants.loggedIn);
    storageService.remove(Constants.curUser);
    storageService.remove(Constants.curRole);
    storageService.remove(Constants.userInfo);
    navigate("/login");
    window.location.reload();
  };

  return (
    <div id={ctx.reload} className="header">
      <Link to="/" className="header_left">
        Gaming-Shop
      </Link>
      <div className={open ? "header_right_open header_right " : "header_right" }>
        <Link to="/cart" className="d-flex align-items-center">
          <Cart className="cursor-pointer" />
          <div className="fs-7 text-light px-2 rounded-circle bg-danger">
            {carts.length}
          </div>
        </Link>
        <NavLink className="header_right-icon">
          <List />
          {loggedIn && (
            <div className="menu-user header_right-icon_list">
              <div className="mb-3">
                <Link to={"/orders"} className="cursor-pointer">
                  Đơn hàng
                </Link>
              </div>
              <div className="mb-3">
                <Link to={"/userInfo"} className="cursor-pointer">
                  Thông tin tài khoản
                </Link>
              </div>
              <div className="mb-3">
                <Link to={"/change-password"} className="cursor-pointer">
                  Đổi mật khẩu
                </Link>
              </div>
            </div>
          )}
        </NavLink>

        <Link to="/login" className="cursor-pointer mr-2 flex items-center">
          <div className="mr-2">{username ? username : ""}</div>
          <img
            className="w-5 h-5 md:h-auto rounded-full mx-auto"
            src={
              avatar
                ? avatar
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwbGozsS9QP10p16rZiCrQD0koXVkI4c7LwUHab9dkmFRcN0VqCkB37f2y0EnySItwykg&usqp=CAU"
            }
            alt="avt"
            width="100"
          />
        </Link>
        <div
          className="cursor-pointer ml-5 flex items-center"
          onClick={handleLogout}
        >
          {loggedIn ? "Logout" : "Login"}
          {loggedIn ? (
            <BoxArrowInRight className="ml-2" />
          ) : (
            <BoxArrowInLeft className="ml-2" />
          )}
        </div>
        <span className="header_right_close" onClick={handleOpen}>X</span>
      </div>
      <List className="header_menu"  onClick={handleOpen}/>
    </div>
  );
};

export default Header;
