import axios from "axios";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import {
  Button,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from "reactstrap";
import { LINK_API } from "../../../commons/api.const";
import { Constants } from "../../../commons/Constants";
import storageService from "../../../services/storage.service";
import userService from "../../../services/user/user.service";
import './user.scss';

const User = () => {
  // const tabPageArr = [0, 1, 2, 3, 4, 5];
  // const [active, setActive] = useState(0);
  const [users, setUsers] = useState([]);
  const [usersAll, setUsersAll] = useState([]);
  const [modal, setModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningLoad, setIsRunningLoad] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [value, setValue] = useState({
    email: "",
    fullName: "",
    phone: "",
    username: "",
    roleId: 0,
    avt: "",
    address: ""
  });


  const [selectedUser, setselectedUser] = useState(Object);
  const [modalConfirmDeleteShow, setModalConfirmDeleteShow] = useState(false);
  const handleClose = () => setModalConfirmDeleteShow(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userModal, setUserModal] = useState(false);
  const [userValue, setUserValue] = useState({
    email: "",
    fullName: "",
    phone: "",
    username: "",
    roleId: 0,
    address: "",
  });

  const getAllUser = useCallback(() => {
    userService.getAllUser(0).then((data) => {
      setUsers(data);
      if (data) {
        setIsRunning(true);
        console.log(data);
      }
    });
  }, []);

  useEffect(() => {
    getAllUser();
    userService.getAllUser().then((data) => {
      setUsersAll(data);
    });
  }, [getAllUser]);

  const handleModal = (id) => {
    setModal(!modal);
    storageService.set(Constants.editId, id);
    userService.getUserInfo(id).then((data) => {
      if (data) {
        console.log(data);
        setValue({
          ...value,
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          username: data.username,
          address: data.address,
          roleId: data.role.id
        });
      }
    });
    if (!modal === false) {
      storageService.remove(Constants.editId);
    }
  };

  const handleDeleteUser = (userId) => {
    setIsSubmitting(true);
    userService.deleteUser(userId).then((data) => {
      if (data) {
        setIsSubmitting(false);
        setModalConfirmDeleteShow(false);
        alert("???? x??a t??i kho???n");
        getAllUser();
      }
    });
  };

  const handleChangeUser = async () => {
    let userId = storageService.get(Constants.editId);
    if (value.avt) {
      const formData = new FormData();
      formData.append("avt", value.avt);
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
    userService.changeUser(userId, value).then((data) => {
      if (data) {
        alert("???? s???a th??nh c??ng");
        getAllUser();
      }
    });
    setModal(!modal);
    storageService.remove(Constants.editId);
  };

  const handleUserModal = () => {
    setUserModal(!userModal);
  };

  const handleAddUser = () => {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
    setIsRunningLoad(true);
    if(userValue.email === "")
    {
      alert("Email kh??ng ???????c ????? tr???ng")
      setIsRunningLoad(false);
      //setIsRunning(false);
    }
    else if((!(userValue.email === "")) && !filter.test(userValue.email))
    {
      alert("Email kh??ng ????ng ?????nh d???ng")
      setIsRunningLoad(false);
      //setIsRunning(false);
    }
    else if(userValue.address === "")
    {
      alert("?????a ch??? kh??ng ???????c ????? tr???ng")
      setIsRunningLoad(false);
      //window.location.reload();
    }
    else if(userValue.fullName === "")
    {
      alert("H??? v?? t??n kh??ng ???????c ????? tr???ng")
      setIsRunningLoad(false);
    }
    else if(userValue.phone === "")
    {
      alert("S??? ??i???n tho???i kh??ng ???????c ????? tr???ng")
      setIsRunningLoad(false);
    }
    else if((!(Number(userValue.phone)))   || ((Number(userValue.phone)<0)))
    {
      alert("S??? ??i???n tho???i ph???i l?? k?? t??? s??? v?? kh??ng ???????c <0")
      setIsRunningLoad(false);
    }
    else if(userValue.username === "")
    {
      alert("T??n ????ng nh???p kh??ng ???????c ????? tr???ng")
      setIsRunningLoad(false);
    }
    else if(userValue.roleId === 0)
    {
      alert("B???n ch??a ch???n quy???n cho t??i kho???n")
      setIsRunningLoad(false);
    }
    else
    {
      userService.addUser(userValue).then((data) => {
        if (data) {
          setUserModal(!userModal);
          setIsRunningLoad(false);
          alert(" ???? t???o ng?????i d??ng th??nh c??ng")
          window.location.reload();
        }
      });
    }
  };

  const listFilterUser = searchText
    ? usersAll.filter((item) => item.fullName.toLowerCase().includes(searchText.toLowerCase()))
    : users;

  const handleChangePage = (e, page) => {
    setIsRunning(false);
    userService.getAllUser(page - 1).then((data) => {
      setUsers(data);
      if (data) {
        setIsRunning(true);
      }
    });
  };

  const onButtonDeleteClick = (user) => {
    setselectedUser(user);
    setModalConfirmDeleteShow(true);
  };
  return (
    <Fragment>
      {!isRunning ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <div style={{
          // maxWidth: 'calc(100% - 250px)',
          padding: ' 0 50px',
        }}>
          <div className="flex justify-end">
            <Button onClick={() => handleUserModal()} className="mb-0">T???o m???i</Button>
          </div>

          <div className="flex justify-end">
            <Input
              placeholder="T??m ki???m ng?????i d??ng"
              type="email"
              className="max-w-[300px]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="h-[450px] overflow-y-auto overflow-x-auto" style={{
            maxWidth: '100%',
            fontSize: '14px',
            }}>
            <Table striped bordered className="table text-center bg-white">
              <thead>
                <tr>
                  <th>STT</th>
                  <td>Avatar</td>
                  <td>FullName</td>
                  <td>Email</td>
                  <td>UserName</td>
                  <td>Phone</td>
                  <td>Address</td>
                  <td>Role</td>
                  <td className="text-center">S???a</td>
                  <td className="text-center">X??a</td>
                </tr>
              </thead>
              {listFilterUser.length > 0 &&
                listFilterUser.map((item, index) => (
                  <Fragment key={index}>
                    <tbody>
                      <tr>
                        <th scope="row">{item.userId}</th>
                        <th scope="row">
                        <img className="w-10 h-10 md:h-auto rounded-full mx-auto" src={item.avatar ? item.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwbGozsS9QP10p16rZiCrQD0koXVkI4c7LwUHab9dkmFRcN0VqCkB37f2y0EnySItwykg&usqp=CAU"} alt="avt" width="100" />
                        </th>
                        <td >{item.fullName}</td>
                        <td >{item.email}</td>
                        <td>{item.username}</td>
                        <td>{item.phone}</td>
                        <td>{item.address}</td>
                        <td>{item["role"].name}</td>
                        <td>
                          <Button onClick={() => handleModal(item.userId)} className="btn-click max-w-[100px] h-[30px]" >
                            S???a
                          </Button>
                        </td>
                        <td>
                          <Button 
                          // onClick={() => handleDeleteUser(item.userId)
                          // } 
                          onClick={
                            () =>
                              onButtonDeleteClick({
                                userId: item.userId,
                                fullName: item.fullName,
                              })}
                          className="btn-click max-w-[100px] h-[30px]">
                            X??a
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Fragment>
                ))}
            </Table>
          </div>
          <Modal className="bg-secondary" isOpen={modal} toggle={handleModal}>
            <ModalHeader toggle={handleModal}>S???a User</ModalHeader>
            <ModalBody>
              <Label>Email</Label>
              <Input
                placeholder="enter email"
                type="email"
                value={value.email}
                onChange={(e) =>
                  setValue({
                    ...value,
                    email: e.target.value,
                  })
                }
              />
              <Label>Fullname</Label>
              <Input
                placeholder="enter fullname"
                type="text"
                value={value.fullName}
                onChange={(e) =>
                  setValue({
                    ...value,
                    fullName: e.target.value,
                  })
                }
              />
              <Label>Phone</Label>
              <Input
                placeholder="enter phone"
                type="text"
                value={value.phone}
                onChange={(e) =>
                  setValue({
                    ...value,
                    phone: e.target.value,
                  })
                }
              />
              <Label>Username</Label>
              <Input
                placeholder="Enter sername"
                type="text"
                value={value.username}
                onChange={(e) =>
                  setValue({
                    ...value,
                    username: e.target.value,
                  })
                }
              />
              <Label>Address</Label>
              <Input
                placeholder="Enter sername"
                type="text"
                value={value.address}
                onChange={(e) =>
                  setValue({
                    ...value,
                    address: e.target.value,
                  })
                }
              />
              <Label>Ch???n role</Label>
              <Input
                type={"select"}
                size="3"
                value={value.roleId}
                onChange={(e) =>
                  setValue({
                    ...value,
                    roleId: e.target.value,
                  })
                }
                required
              >
                <option value={1}>Admin</option>
                <option value={2}>Shipper</option>
                <option value={3}>Customer</option>
              </Input>
              <Label>Avatar</Label>
              <Input
                placeholder="Avatar"
                type="file"
                onChange={(e) =>
                  setValue({
                    ...value,
                    avt: e.target.files[0],
                  })
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-primary"
                color="primary"
                onClick={() => handleChangeUser()}
              >
                X??c nh???n
              </Button>
              <Button className="bg-dark" onClick={handleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Modal className="bg-secondary" isOpen={modalConfirmDeleteShow} toggle={handleClose}>
              <ModalHeader>X??a danh m???c</ModalHeader>
              <ModalBody>
                {`B???n c?? mu???n x??a ngu???i d??ng "${selectedUser.fullName}" kh??ng?`}
              </ModalBody>
              <ModalFooter>
              <Button
                  className="bg-primary"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={() => handleDeleteUser(selectedUser.userId)}
                >
                  X??a
                </Button>
                <Button className="bg-dark" onClick={handleClose}>
                  Kh??ng
                </Button>
              </ModalFooter>
            </Modal>

          <Modal
            className="bg-secondary"
            isOpen={userModal}
            toggle={handleUserModal}
          >
            <ModalHeader toggle={handleUserModal}>T???o t??i kho???n</ModalHeader>
            <ModalBody>
              <Label>Email</Label>
              <Input
                placeholder="enter email"
                type="email"
                onChange={(e) =>
                  setUserValue({
                    ...userValue,
                    email: e.target.value,
                  })
                }
                required
                valid={userValue.email === "" ? false : true}
                invalid={userValue.email === "" ? true : false}
                focused
              />
              <Label>Fullname</Label>
              <Input
                placeholder="enter fullname"
                type="text"
                onChange={(e) =>
                  setUserValue({
                    ...userValue,
                    fullName: e.target.value,
                  })
                }
                required
                valid={userValue.fullName === "" ? false : true}
                invalid={userValue.fullName === "" ? true : false}
                focused
              />
              <Label>Phone</Label>
              <Input
                placeholder="enter phone"
                type="number"
                onChange={(e) =>
                  setUserValue({
                    ...userValue,
                    phone: e.target.value,
                  })
                }
                min={1}
                required
                valid={userValue.phone === "" ? false : true}
                invalid={userValue.phone === "" ? true : false}
                focused
              />
              <Label>Username</Label>
              <Input
                placeholder="Enter sername"
                type="text"
                onChange={(e) =>
                  setUserValue({
                    ...userValue,
                    username: e.target.value,
                  })
                }
                required
                valid={userValue.username === "" ? false : true}
                invalid={userValue.username === "" ? true : false}
                focused
              />

              <Label>Address</Label>
              <Input
                placeholder="Enter sername"
                type="text"
                onChange={(e) =>
                  setUserValue({
                    ...userValue,
                    address: e.target.value,
                  })
                }
                required
                valid={userValue.address === "" ? false : true}
                invalid={userValue.address === "" ? true : false}
                focused
              />
              <Label>Role</Label>
              <Input
                type={"select"}
                size="3"
                value={null}
                onChange={(e) =>
                  setUserValue({
                    ...userValue,
                    roleId: e.target.value,
                  })
                }
                required
              >
                <option value={1}>Admin</option>
                <option value={2}>Shipper</option>
                <option value={3}>Customer</option>
              </Input>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-primary"
                color="primary"
                onClick={() => handleAddUser()}
              >
                {isRunningLoad && <Spinner color="light" size="sm"></Spinner>}
                X??c nh???n
              </Button>
              <Button className="bg-dark" onClick={handleUserModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      )}
      <Container className="flex justify-center absolute">
      <div className="py-4">
          <Pagination count={20} color="primary" className="bg-white rounded-lg translate-x-[50%] mt-[30px]" size="large" onChange={handleChangePage} />
        </div>
      </Container>
    </Fragment>
  );
};

export default User;
