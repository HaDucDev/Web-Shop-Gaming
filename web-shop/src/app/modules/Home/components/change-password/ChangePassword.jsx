import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import authService from "../../../../services/auth.service";

const ChangePassword = () => {
  const [valueReviewInput, setValueReviewInput] = useState({
    username: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showMessageError, setShowMessageError] = useState(false);

  const [isShow, setIsShow] = useState(false);
  const showPassword = () => {
    setIsShow((isShow) => !isShow);
  };

  const handleChangePass = () => {
    //e.preventDefault();
    if (valueReviewInput.username === "") {
      alert("Tên đăng nhập không đuợc để trống");
    }
    else if (valueReviewInput.password === "") {
      alert("Mật khẩu không đuợc để trống");
    }
    else if (valueReviewInput.newPassword === "") {
      alert("Mật khẩu mới không đuợc để trống");
    }
    else if (valueReviewInput.confirmPassword === "") {
      alert("Nhập lại mật khẩu không đuợc để trống");
    }
    else {
      if (valueReviewInput.newPassword === valueReviewInput.confirmPassword) {
        authService.changePassword(valueReviewInput).then(
          (data) => {
            if (data.status === true) {
             
              alert("Đổi mật khẩu thành công");
            }
            else {
              alert("Tên đăng nhập hoặc mật khẩu cũ không đúng");
            }
          })
          .catch(
            () => {
              alert("Tên đăng nhập hoặc mật khẩu không đúng");
            }
          );
      }
      else {
        alert("Mật khẩu nhập lại không khớp với mật khẩu mới");
      }
      
    };
  };

  useEffect(() => {
    if (valueReviewInput.newPassword !== valueReviewInput.confirmPassword) {
      setShowMessageError(true);
    } else {
      setShowMessageError(false);
    }
  }, [valueReviewInput.newPassword, valueReviewInput.confirmPassword]);

  return (
    <Container className="mt-5 w-full">
      <div className="mt-4 p-4 w-[500px] bg-white rounded-lg mx-auto">
        <h1 className="text-[30px] mt-4 font-semibold">ĐỔI MẬT KHẨU</h1>

        <div className="flex mt-2 p-4 w-full justify-center">
          <div className="">
            <div className="">
              <label className="w-full">Tên đăng nhập</label>
              <input
                type="text"
                className="w-[400px]"
                onChange={(e) =>
                  setValueReviewInput({
                    ...valueReviewInput,
                    username: e.target.value,
                  })
                }
                required={true}
                errorMessage="Tên đăng nhập không đúng"
              />
            </div>
            <div className="">
              <label className="w-full">Mật khẩu cũ</label>
              <input
                type={isShow ? "text" : "password"}
                className="w-[400px]"
                onChange={(e) =>
                  setValueReviewInput({
                    ...valueReviewInput,
                    password: e.target.value,
                  })
                }
                required='true'
              />
            </div>
            <div className="">
              <label className="w-full">Mật khẩu mới</label>
              <input
                name="password"
                type={isShow ? "text" : "password"}
                className="w-[400px]"
                onChange={(e) =>
                  setValueReviewInput({
                    ...valueReviewInput,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="">
              <label className="w-full">Nhập lại mật khẩu mới</label>
              <input
                name="password-confirm"
                type={isShow ? "text" : "password"}
                className="w-[400px]"
                onChange={(e) =>
                  setValueReviewInput({
                    ...valueReviewInput,
                    confirmPassword: e.target.value,
                  })
                }
              />
              {showMessageError && (
                <div className="text-[14px] text-red-600">
                  Mật khẩu không khớp nhau
                </div>
              )}
            </div>
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
            <button
              className="mt-4 p-0 my-0 w-[300px]"
              onClick={() => handleChangePass()}
            >
              Xác nhận đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ChangePassword;
