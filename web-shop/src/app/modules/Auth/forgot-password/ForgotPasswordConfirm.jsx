import React, { Fragment, useEffect, useState } from "react";

import FormInput from "../components/FormInput/FormInput";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../services/auth.service";
import { Spinner } from "reactstrap";


const ForgotPasswordConfirm = () => {
  const [showMessageError, setShowMessageError] = useState(false);
  const [values, setValues] = useState({
    username: "",
    newPassword: "",
    newPasswordConfirm: "",
    token: "",
  });


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
      name: "token",
      type: "text",
      placeholder: "mã xác thực",
      errorMessage: "Không để trống",
      label: "Mã xác thực",
      pattern: `^{3,20}$`,
      required: true,
    },
    {
      id: 3,
      name: "newPassword",
      type: isShow ? "text" : "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 3-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Mật khẩu",
      pattern: `^[A-Za-z0-9]{3,20}$`,
      required: true,
    },
    {
      id: 4,
      name: "newPasswordConfirm",
      type: isShow ? "text" : "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 3-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Nhập lại mật khẩu",
      required: true,
    },
  
  ];

  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (values.username === "") {
      alert("Tên đăng nhập không đuợc để trống");
    }
    else if (values.token === "") {
      alert("Mã xác thực không đuợc để trống");
    }
    else if (values.newPassword === "") {
      alert("Mật khẩu mới không đuợc để trống");
    }
    else if (values.newPasswordConfirm === "") {
      alert("Nhập lại mật khẩu không đuợc để trống");
    }
    else {
      if (values.newPassword === values.newPasswordConfirm) {
        console.log(values);
        setIsRunning(false);
        e.preventDefault();
        authService.forgotPasswordConfirm(values).then((data) => {
          if (data) {
            alert("thay đổi mật khẩu thành công");
            navigate("/login");
            setIsRunning(true);
          }
        })
        .catch(
          () => {
            alert("Tạo mật khẩu mới không thành công bạn vui lòng kiểm tra lại thông tin");
          }
        );
      }
      else {
        alert("Mật khẩu nhập lại không khớp với mật khẩu mới");
      }
      
    };
    
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (values.newPassword !== values.newPasswordConfirm) {
      setShowMessageError(true);
    } else {
      setShowMessageError(false);
    }
  }, [values.newPassword, values.newPasswordConfirm]);

  return (
    <div className="form-auth">
      <form>
        <h1>Xác nhận thông tin</h1>
        {inputs.map((input) => (
          <Fragment>
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
            {showMessageError && input.name === "newPasswordConfirm" && (
              <div className="text-[14px] text-red-600">
                Mật khẩu không khớp nhau
              </div>
            )}
          </Fragment>
        ))}

        <div className="checkbox-container">
          <input
            id="checkbox"
            type="checkbox"
            checked={isShow}
            onChange={showPassword}
            style={{ marginRight: '5px' }}
          />
          <label htmlFor="checkbox">  Hiển thị mật khẩu</label>
        </div>
        <button onClick={handleSubmit}>
          {isRunning && (
            <Spinner color="light" size="sm" className="mr-2"></Spinner>
          )}
          Xác nhận
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordConfirm;
