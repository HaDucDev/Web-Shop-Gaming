import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

import FormInput from "../components/FormInput/FormInput";
import authService from "../../../services/auth.service";
import storageService from "../../../services/storage.service";
import { Constants } from "../../../commons/Constants";


const Login = (props) => {
  let navigate = useNavigate()

  const [values, setValues] = useState({
    username: "",
    password: "",
  })


  const [isShow, setIsShow] = useState(false);
  const showPassword = () => {
    setIsShow((isShow) => !isShow);
  };

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: "Tên đăng nhập",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: isShow ? "text" : "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 3-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Mật khẩu",
      pattern: `^[A-Za-z0-9]{3,20}$`,
      required: true,
    },
  ]

  //kiểm tra nếu đăng nhập rồi thì sẽ chuyển trang tương ứng theo quyền của user
  useEffect(() => {
    let loggedIn = storageService.get(Constants.loggedIn);
    if (loggedIn) {
      let role = storageService.get(Constants.curRole);
      if (role === Constants.ROLE_ADMIN) {
        navigate("/admin");
      } else if (role === Constants.ROLE_SHIPPER) {
        navigate("/shipper");
      } else {
        navigate("/");
      }
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(values.username);
    authService
      .login(values.username, values.password)
      .then((data) => {
        storageService.set(Constants.accessToken, data.jwt);
        storageService.set(Constants.loggedIn, true);
        storageService.set(Constants.curUser, data.userId);
        storageService.set(Constants.curRole, data.roleName);
        storageService.set(Constants.userInfo, data.username);
        storageService.set(Constants.roleId, data.roleId);

        let role = data.roleName;
        if (role === Constants.ROLE_ADMIN) {
          navigate("/admin");
          window.location.reload();
        } else if (role === Constants.ROLE_SHIPPER) {
          navigate("/shipper");
          window.location.reload();
        } else {
          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        //alert("Đăng nhập lỗi!");
      })
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  return (
    <div className="form-auth flex flex-col">
      <h1 className="text-3xl">Chào mừng bạn đến với GAMING-SHOP</h1>
      <form onSubmit={handleSubmit} className="relative py-[50px] mt-[20px]" style={{border: '1px solid blue'}}>
        {inputs.map((input) => (
          <Fragment>
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          </Fragment>
        ))}

        <div className="checkbox-container">
          <input
            id="checkbox"
            type="checkbox"
            checked={isShow}
            onChange={showPassword}
            style ={{marginRight: '5px'}}
          />
          <label htmlFor="checkbox">  Hiển thị mật khẩu</label>
        </div>
        <button>Đăng nhập</button>

        <Link to="/register">
          <p className="text-center my-2">Đăng kí tài khoản</p>
        </Link>
        <Link to="/forgot">
          <p className="text-center mb-2">Quên mật khẩu</p>
        </Link>
      </form>
    </div>
  );
};

export default Login;
