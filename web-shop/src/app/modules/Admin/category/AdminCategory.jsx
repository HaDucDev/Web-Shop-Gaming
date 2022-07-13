import React, { Fragment, useCallback, useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
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
import categoryService from "../../../services/category/category.service";

const AdminCategory = () => {
  const tabPageArr = [0, 1, 2, 3, 4, 5];
  const [active, setActive] = useState(0);
  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [modal, setModal] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningShow, setIsRunningShow] = useState(false);

  const [value, setValue] = useState("");
  const [valueCate, setValueCate] = useState("");

  const [selectedCategory, setselectedCategory] = useState(Object);
  const [modalConfirmDeleteShow, setModalConfirmDeleteShow] = useState(false);
  const handleClose = () => setModalConfirmDeleteShow(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAllCategory = useCallback(() => {
    categoryService.getAllCategory(0).then((data) => {
      setCategory(data);
      setIsRunningShow(true);
    });
  }, []);

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

  const handleModal = (id) => {
    setModal(!modal);
  };

  const handleAddCategory = () => {
    setIsRunning(true);
    if(value === "")
    {
      alert("Danh mục sản phẩm không được để trống")
      window.location.reload();
    }
    else{
      categoryService.createNewCategory(value).then((data) => {
        if (data) {
          getAllCategory();
          setIsRunning(false);
          setModal(false);
          alert(" Đã tạo danh mục sản phẩm thành công")
          window.location.reload();
        }
        else{
          alert("Lỗi dữ liệu bạn vui lòng kiểm tra lại dữ liệu đã nhập")
          window.location.reload();
        }
      });
    }
  };

  const handleDeleteCategory = (categoryId) => {
    setIsSubmitting(true);
    categoryService.deleteCategory(categoryId).then((data) => {
      if (data) {
        setIsSubmitting(false);
        setModalConfirmDeleteShow(false);
        getAllCategory();
      }
    });
  };

  const handleChangePage = (e, page) => {
    setActive(page);
    categoryService.getAllCategory(page - 1).then((data) => {
      setCategory(data);
    });
  };

  const handleModalUpdate = () => {
    setModalUpdate(!modalUpdate);
  };

  const handleShowPopupEdit = (id) => {
    setCategoryId(id);
    setModalUpdate(!modalUpdate);
    categoryService.getCategoryById(id).then((data) => {
      setValueCate(data.categoryName);
    });
  };

  const handleChangeInfoCategory = () => {
    categoryService.editCategory(categoryId, valueCate).then((data) => {
      if (data) {
        alert("Đã sửa thành công");
        getAllCategory();
        setModalUpdate(false);
      }
    });
  };

  const onButtonDeleteClick = (category) => {
    setselectedCategory(category);
    setModalConfirmDeleteShow(true);
  };
  return (
    <Fragment>
      {!isRunningShow ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <Fragment>
          <div style={{
          padding: ' 0 50px',
        }}>
            <div className="flex justify-end">
              <Button onClick={() => handleModal()}>Tạo mới</Button>
            </div>
            <div className="h-[600px] overflow-y-auto"style={{
            maxWidth: '100%',
            fontSize: '14px',
            }}>
              <Table
                striped
                bordered
                className="table table-hover text-center bg-white"
              >
                <thead>
                  <tr>
                    <th scope="row">STT</th>
                    <td>Tên danh mục</td>
                    <td>Sửa</td>
                    <td>Xóa</td>
                  </tr>
                </thead>
                {category.length > 0 &&
                  category.map((item, index) => (
                    <Fragment key={index}>
                      <tbody>
                        <tr>
                          <th scope="row">{item.categoryId}</th>
                          <td>{item.categoryName}</td>
                          <td>
                            <Button
                              onClick={() =>
                                handleShowPopupEdit(item.categoryId)
                              }
                              className="btn-click max-w-[100px] h-[30px]"
                            >
                              Sửa
                            </Button>
                          </td>
                          <td>
                            <Button                 
                              onClick={
                                () =>
                                  onButtonDeleteClick({
                                    id: item.categoryId,
                                    name: item.categoryName,
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
              <ModalHeader toggle={handleModal}>Thêm mới danh mục</ModalHeader>
              <ModalBody>
                <Label>Tên danh mục</Label>
                <Input
                  placeholder="enter name"
                  type="text"
                  onChange={(e) => setValue(e.target.value)}
                  // required
                  // valid={valueCate.categoryName === "" ? false : true}
                  // invalid={valueCate.categoryName === "" ? true : false}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-primary"
                  color="primary"
                  onClick={() => handleAddCategory()}
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
              <ModalHeader>Xóa danh mục</ModalHeader>
              <ModalBody>
                {`Bạn có muốn xóa danh mục sản phẩm "${selectedCategory.name}" không?`}
              </ModalBody>
              <ModalFooter>
              <Button
                  className="bg-primary"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={() => handleDeleteCategory(selectedCategory.id)}
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
              isOpen={modalUpdate}
              toggle={handleModalUpdate}
            >
              <ModalHeader toggle={handleModalUpdate}>Sửa danh mục</ModalHeader>
              <ModalBody>
                <Label>Tên danh mục</Label>
                <Input
                  placeholder="enter name"
                  type="text"
                  value={valueCate}
                  onChange={(e) => setValueCate(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-primary"
                  color="primary"
                  onClick={() => handleChangeInfoCategory()}
                >
                  {isRunning && <Spinner color="light" size="sm"></Spinner>}
                  Xác nhận
                </Button>
                <Button className="bg-dark" onClick={handleModalUpdate}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default AdminCategory;
