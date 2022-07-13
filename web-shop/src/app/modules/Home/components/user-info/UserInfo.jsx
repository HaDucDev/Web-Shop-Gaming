import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Container, Spinner } from "reactstrap";
import { LINK_API } from "../../../../commons/api.const";
import { Constants } from "../../../../commons/Constants";
import storageService from "../../../../services/storage.service";
import userService from "../../../../services/user/user.service";

const UserInfo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [changeInfo, setChangeInfo] = useState(false);

  const [userInfoValue, setUserInfoValue] = useState({
    email: "",
    fullName: "",
    phone: "",
    username: "",
    avt: "",
    address: "",
  });

  useEffect(() => {
    let userId = storageService.get(Constants.curUser);
    userService.getUserInfo(userId).then((data) => {
      if (data) {
        setUserInfoValue((prev) => ({
          ...prev,
          avt: data.avatar,
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          username: data.username,
          address: data.address,
        }));
        console.log(data);
        setIsRunning(true);
      }
    });
  }, []);

  const handleChangeInfoUser = async () => {
    let userId = storageService.get(Constants.curUser);

    if (userInfoValue.avatar) {
      const formData = new FormData();
      formData.append("avt", userInfoValue.avatar);
      const resData = await axios({
        method: "post",
        url: `${LINK_API}users/${userId}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${storageService.get("access_token")}`,
        },
      });
    }
    userService.changeUserInfoHome(userId, userInfoValue).then((data) => {
      if (data) {
        alert("Đã lưu thông tin thành công");
        window.location.reload();
      }
    });
    storageService.remove(Constants.editId);
  };

  return (
    <Fragment>
      {!isRunning ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <Container className= "w-full">
          <div className="mt-[10px] p-4 w-[500px] bg-white rounded-lg mx-auto">
            <h1 className="text-[28px] font-semibold">THÔNG TIN TÀI KHOẢN</h1>
            <div className="relative">
              <img
                className="w-20 h-20 md:w-48 md:h-auto my-4 border-2 object-cover border-purple-900 rounded-full mx-auto"
                src={userInfoValue.avt}
                alt=""
                width="384"
                height="512"
              />
              {changeInfo && (
                <input
                  type="file"
                  className="block bg-blue-100 pl-4 rounded-sm absolute top-[50px] left-[150px]"
                  onChange={(e) =>
                    setUserInfoValue((prev) => ({
                      ...prev,
                      avatar: e.target.files[0],
                    }))
                  }
                />
              )}
            </div>
            <div className="text-brand-dark text-[16px] mt-3">
              <div className="font-medium mb-3">
                Họ tên:{" "}
                <input
                  readOnly={!changeInfo}
                  value={userInfoValue.fullName}
                  type="text"
                  className="block text-[16px] font-semibold text-brand-dark w-full bg-blue-100 pl-4 rounded-sm"
                  onChange={(e) =>
                    setUserInfoValue((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="font-medium mb-3">
                Số điện thoại:{" "}
                <input
                  readOnly={!changeInfo}
                  value={userInfoValue.phone}
                  type="text"
                  className="block text-[px]16 font-semibold text-brand-dark w-full bg-blue-100 pl-4 rounded-sm"
                  onChange={(e) =>
                    setUserInfoValue((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="font-medium mb-3">
                Username:{" "}
                <input
                  readOnly={!changeInfo}
                  value={userInfoValue.username}
                  type="text"
                  className="block text-[16px] font-semibold text-brand-dark w-full bg-blue-100 pl-4 rounded-sm"
                  onChange={(e) =>
                    setUserInfoValue((prev) => ({
                      ...prev,
                      username: e.target.vaue,
                    }))
                  }
                />
              </div>
              <div className="font-medium mb-3">
                Email:{" "}
                <input
                  readOnly={!changeInfo}
                  value={userInfoValue.email}
                  type="text"
                  className="block text-[16px] font-semibold text-brand-dark w-full bg-blue-100 pl-4 rounded-sm"
                  onChange={(e) =>
                    setUserInfoValue((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="font-medium mb-3">
                Address:{" "}
                <input
                  readOnly={!changeInfo}
                  value={userInfoValue.address}
                  type="text"
                  className="block text-[16px] font-semibold text-brand-dark w-full bg-blue-100 pl-4 rounded-sm"
                  onChange={(e) =>
                    setUserInfoValue((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex">
              {!changeInfo ? (
                <Button
                  className="bg-blue-500"
                  onClick={() => setChangeInfo(true)}
                >
                  Sửa thông tin
                </Button>
              ) : (
                <Fragment>
                  <Button
                    color="primary"
                    className="bg-brand-dark"
                    onClick={handleChangeInfoUser}
                  >
                    Lưu thông tin
                  </Button>
                  <Button
                    color="danger"
                    className="bg-red-600 ml-4"
                    onClick={() => setChangeInfo(false)}
                  >
                    Hủy
                  </Button>
                </Fragment>
              )}
            </div>
          </div>
        </Container>
      )}
    </Fragment>
  );
};

export default UserInfo;
