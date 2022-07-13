import React, { Fragment, useCallback, useEffect, useState } from "react";
import supplierService from "../../../services/supplier/supplier.service";
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
import storageService from "../../../services/storage.service";
import { Constants } from "../../../commons/Constants";
import { data } from "autoprefixer";
import axios from "axios";
import { LINK_API } from "../../../commons/api.const";

const AdminSupplier = () => {
  const [supplier, setSupplier] = useState([]);
  const [modal, setModal] = useState(false);
  const [supplierModal, setSupplierModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningShow, setIsRunningShow] = useState(false);

  const [value, setValue] = useState({
    supplierImage: "",
    supplierName: "",
  });

  const [imageLink, setImageLink] = useState({
    id: "",
    link: "",
  });

  const [selectedSupplier, setselectedSupplier] = useState(Object);
  const [modalConfirmDeleteShow, setModalConfirmDeleteShow] = useState(false);
  const handleClose = () => setModalConfirmDeleteShow(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAllSupplier = useCallback(() => {
    supplierService.getAllSupplier().then((data) => {
      setSupplier(data);
      setIsRunningShow(true);
    });
  }, []);

  useEffect(() => {
    getAllSupplier();
  }, [getAllSupplier]);

  const handleModal = (id) => {
    setModal(!modal);
    storageService.set(Constants.editId, id);
    setIsRunning(false);
    supplierService.getSupplierById(id).then((data) => {
      if (data) {
        setValue({
          ...value,
          supplierName: data.supplierName,
        });
      }
    });
  };

  const handleDeleteSupplier = (supplierId) => {
    setIsSubmitting(true);
    supplierService.deleteSupplier(supplierId).then((data) => {
      if (data) {
        setIsSubmitting(false);
        setModalConfirmDeleteShow(false);
        getAllSupplier();
      }
    });
  };

  const handleChangeSupplier = async () => {
    setIsRunning(true);
    let supplierId = storageService.get(Constants.editId);

    const formData = new FormData();
    formData.append("avt", value.supplierImage);
    const resData = await axios({
      method: "patch",
      url: `${LINK_API}suppliers/${supplierId}/avt`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${storageService.get("access_token")}`,
      },
    });
    if (resData) {
      supplierService.editInforSupplier(supplierId, value).then((data) => {
        if (data) {
          getAllSupplier();
          setModal(!modal);
          setIsRunning(false);
        }
      });
    }
    storageService.remove(Constants.editId);
  };

  const handleModalSupplier = () => {
    setSupplierModal(!supplierModal);
  };

  const handleCreateNewSupplier = () => {
    setIsRunning(true);
    if(value.supplierName === "")
    {
      alert("Tên hãng không được để trống")
      window.location.reload();
    }
    else
    {
      supplierService.createNewSupplier(value).then((data) => {
        if (data) {
          setSupplierModal(!supplierModal);
          setImageLink((prev) => ({
            ...prev,
            id: data.supplierId,
            link: data.supplierImage,
          }));
          getAllSupplier();
          alert("Đã thêm thành công")
          console.log(data);
        }
      });
    }
  };

  const changeAvatar = useCallback(async () => {
    const formData = new FormData();
    formData.append("avt", value.supplierImage);
    const resData = await axios({
      method: "patch",
      url: `${LINK_API}suppliers/${imageLink.id}/avt`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${storageService.get("access_token")}`,
      },
    });
    if (resData) {
      console.log(resData);
      alert("Đã đổi thành công");
      getAllSupplier();
    }
  }, [getAllSupplier, imageLink.id, value.supplierImage]);

  useEffect(() => {
    changeAvatar();
  }, [changeAvatar]);

  const onButtonDeleteClick = (supplier) => {
    setselectedSupplier(supplier);
    setModalConfirmDeleteShow(true);
  };

  return (
    <Fragment>
      {!isRunningShow ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <div style={{
          padding: ' 0 50px',
          fontSize: '14px',
        }}>
          <div className="flex justify-end">
            <Button onClick={() => handleModalSupplier()}>Tạo mới</Button>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <Table striped bordered className="text-center bg-white">
              <thead>
                <tr>
                  <th scope="row">STT</th>
                  <td>Ảnh</td>
                  <td>Tên nhà cung cấp</td>
                  <td>Sửa</td>
                  <td>Xóa</td>
                </tr>
              </thead>
              {supplier.length > 0 &&
                supplier.map((item, index) => (
                  <Fragment key={index}>
                    <tbody>
                      <tr>
                        <th scope="row">{item.supplierId}</th>
                        <td>
                          <img
                            src={item.supplierImage}
                            alt=""
                            className="w-12 h-12 md:w-48 md:h-auto border-2 object-cover border-purple-900 rounded-full mx-auto"
                          />
                        </td>
                        <td>{item.supplierName}</td>
                        <td>
                          <Button onClick={() => handleModal(item.supplierId)}
                          className="btn-click max-w-[100px] h-[30px]"
                          >
                            Sửa
                          </Button>
                        </td>
                        <td>
                          <Button
                            // onClick={() => handleDeleteSupplier(item.supplierId)}
                            onClick={
                              () =>
                                onButtonDeleteClick({
                                  id: item.supplierId,
                                  name: item.supplierName,
                                })
                              }
                            className="btn-click max-w-[100px] h-[30px]"
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Fragment>
                ))}
            </Table>
          </div>
          <Modal className="bg-secondary" isOpen={modal} toggle={handleModal}>
            <ModalHeader toggle={handleModal}>Sửa tên nhà cung cấp</ModalHeader>
            <ModalBody>
              <Label>Tên nhà cung cấp</Label>
              <Input
                placeholder="enter name"
                type="email"
                value={value.supplierName}
                onChange={(e) =>
                  setValue({
                    ...value,
                    supplierName: e.target.value,
                  })
                }
              />
              <Label>Ảnh nhà cung cấp</Label>
              <Input
                placeholder="enter name"
                type="file"
                onChange={(e) =>
                  setValue({
                    ...value,
                    supplierImage: e.target.files[0],
                  })
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-primary"
                color="primary"
                onClick={() => handleChangeSupplier()}
              >
                {isRunning && <Spinner color="light" size="sm"></Spinner>}
                Xác nhận
              </Button>
              <Button className="bg-dark" onClick={handleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Modal className="bg-secondary" isOpen={modalConfirmDeleteShow} toggle={handleClose}>
              <ModalHeader>Xóa nhà cung cấp</ModalHeader>
              <ModalBody>
                {`Bạn có muốn xóa nhà cung cấp "${selectedSupplier.name}" không?`}
              </ModalBody>
              <ModalFooter>
              <Button
                  className="bg-primary"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={() => handleDeleteSupplier(selectedSupplier.id)}
                >
                  Xóa
                </Button>
                <Button className="bg-dark" onClick={handleClose}>
                  Không
                </Button>
              </ModalFooter>
            </Modal>

          <Modal
            className="bg-secondary"
            isOpen={supplierModal}
            toggle={handleModalSupplier}
          >
            <ModalHeader toggle={handleModalSupplier}>
              Tạo nhà cung cấp
            </ModalHeader>
            <ModalBody>
              <Label>Tên nhà cung cấp</Label>
              <Input
                placeholder="enter name"
                type="email"
                onChange={(e) =>
                  setValue({
                    ...value,
                    supplierName: e.target.value,
                  })
                }
              />
              <Label>Ảnh nhà cung cấp</Label>
              <Input
                placeholder="enter name"
                type="file"
                onChange={(e) =>
                  setValue({
                    ...value,
                    supplierImage: e.target.files[0],
                  })
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-primary"
                color="primary"
                onClick={() => handleCreateNewSupplier()}
              >
                {isRunning && <Spinner color="light" size="sm"></Spinner>}
                Xác nhận
              </Button>
              <Button className="bg-dark" onClick={handleModalSupplier}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      )}
    </Fragment>
  );
};

export default AdminSupplier;
