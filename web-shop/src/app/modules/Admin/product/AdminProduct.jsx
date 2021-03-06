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
import { Constants } from "../../../commons/Constants";
import productService from "../../../services/product/product.service";
import storageService from "../../../services/storage.service";
import numberWithCommas from "../../../../app/commons/numberwithCommas";
import supplierService from "../../../services/supplier/supplier.service";
import categoryService from "../../../services/category/category.service";
import axios, { Axios } from "axios";
import { LINK_API } from "../../../commons/api.const";
import './adminproduct.scss';

const AdminProduct = () => {
  const [product, setProduct] = useState([]);
  const [productAll, setProductAll] = useState([]);
  const [modal, setModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [listProductZero, setListProductZero] = useState([]);

  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);

  const [categoryId, setCategoryId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);

  const [value, setValue] = useState({
    descriptionProduct: "",
    discount: "",
    productName: "",
    productImageLink: "",
    quantity: "",
    unitPrice: "",
  });

  const [imageLink, setImageLink] = useState({
    id: "",
    link: "",
  });

  const [selectedProduct, setselectedProduct] = useState(Object);
  const [modalConfirmDeleteShow, setModalConfirmDeleteShow] = useState(false);
  const handleClose = () => setModalConfirmDeleteShow(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAllProduct = useCallback(() => {
    productService.getAllProduct(0).then((data) => {
      setProduct(data);
      console.log(data);
      setIsRunning(true);
    });
  }, []);

  useEffect(() => {
    getAllProduct();
    productService.getAllProduct().then((data) => {
      setProductAll(data);
    });
  }, [getAllProduct]);

  const handleModal = (id, isReadOnly) => {
    setReadOnly(isReadOnly);
    setModal(!modal);
    storageService.set(Constants.editId, id);
    productService.getProductById(id).then((data) => {
      if (data) {
        setValue({
          ...value,
          descriptionProduct: data.descriptionProduct,
          discount: data.discount,
          productName: data.productName,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          productImage: data.productImage,
        });
      }
    });
  };

  const handleDeleteProduct = (id) => {
    productService.deleleProduct(id).then((data) => {
      setIsSubmitting(true);
      if (data) {
        setIsSubmitting(false);
        setModalConfirmDeleteShow(false);
        window.location.reload();
        alert("???? x??a th??nh c??ng");
        getAllProduct();
      }
    });
  };

  const handleChangeProduct = () => {
    let productId = storageService.get(Constants.editId);
    setModal(!modal);
    productService.changeProduct(productId, value).then((data) => {
      if (data) {
        setImageLink((prev) => ({
          ...prev,
          id: data.productId,
          link: data.productImageLink,
        }));
        getAllProduct();
      }
    });

    storageService.remove(Constants.editId);
  };

  //Prodcut new
  const handleProductModal = () => {
    setProductModal(!productModal);
    categoryService.getAllCategory().then((data) => {
      setCategory(data);
    });
    supplierService.getAllSupplier().then((data) => {
      setSupplier(data);
    });
  };

  const handleCancelProductModal = () => {
    setProductModal(!productModal);
    window.location.reload();
  };



  const handleCreateProduct = async () => {
    if(value.descriptionProduct=== "")
    {
      alert("M?? t??? s???n ph???m kh??ng ???????c ????? tr???ng");
      setIsSubmitting(false);
      //window.location.reload();
    }
    else if(value.discount === ""){
      alert("Gi???m gi?? kh??ng ???????c ????? tr???ng");
      setIsSubmitting(false);
    }
    else if(value.productName === ""){
      alert("T??n s???n ph???m kh??ng ???????c ????? tr???ng")
      setIsSubmitting(false);
    }
    else if(value.quantity === ""){
      alert("S??? l?????ng s???n ph???m kh??ng ???????c ????? tr???ng")
      setIsSubmitting(false);
    }
    else if(Number(value.quantity)  < 0){
      alert("S??? l?????ng s???n ph???m s???n ph???m kh??ng ???????c b?? thua 0")
      setIsSubmitting(false);
    }
    else if(value.unitPrice === ""){
      alert("Gi?? s???n ph???m kh??ng ???????c ????? tr???ng")
      setIsSubmitting(false);
    }
    else if(Number(value.unitPrice)  < 0){
      alert("Gi?? s???n ph???m kh??ng ???????c b?? thua 0")
      setIsSubmitting(false);
    }
    else if(categoryId === null){
      alert("B???n ch??a ch???n lo???i s???n ph???m")
      setIsSubmitting(false);
    }
    else if(supplierId === null){
      alert("B???n ch??a ch???n h??ng s???n ph???m")
      setIsSubmitting(false);
    }
   
    else
    {
      productService
      .createNewProduct(categoryId, supplierId, value)
      .then((data) => {
        if (data) {
          setProductModal(!productModal);
          setImageLink((prev) => ({
            ...prev,
            id: data.productId,
            link: data.productImageLink,
          }));
        }
        alert("???? t???o s???n ph???m th??nh c??ng");
        window.location.reload();
      });
    }
  };

  const changeAvatar = useCallback(async () => {
    const formData = new FormData();
    formData.append("file", value.productImageLink);
    const resData = await axios({
      method: "patch",
      url: `${LINK_API}products/${imageLink.id}/avt`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${storageService.get("access_token")}`,
      },
    });
    if (resData) {
      alert("B???n ???? th??nh c??ng");
      getAllProduct();
    }
  }, [getAllProduct, imageLink.id, value.productImageLink]);

  useEffect(() => {
    changeAvatar();
  }, [changeAvatar]);

  const onChangeSelectionCategory = (e) => {
    setCategoryId(e.target.value);
  };

  const onChangeSelectionSupplier = (e) => {
    setSupplierId(e.target.value);
  };

  const handleChangePage = (e, page) => {
    setIsRunning(false);
    productService.getAllProduct(page - 1).then((data) => {
      setProduct(data);
      setIsRunning(true);
    });
  };

  const handleFilterProductZeroQuantities = () => {
    // ban ?????u khi useeffect ch???y l???n ?????u ti??n th?? th?? t??n c?? set gi?? tr??? v??o m???ng. 
    // v?? productAll c?? d??? li???u ngay khi load l??n
    const listFilterProductZero = productAll.filter(
      (item) => item.quantity === 0
    );
    setListProductZero(listFilterProductZero);
  };

  useEffect(() => {
    const listFilterUser = searchText
      ? productAll.filter((item) =>
          item.productName.toLowerCase().includes(searchText.toLowerCase())
        )
      : product;
    setListProductZero(listFilterUser);
  }, [searchText, product, productAll]);

  const onButtonDeleteClick = (product) => {
    setselectedProduct(product);
    setModalConfirmDeleteShow(true);
  };

  return (
    <div className="h-100vh">
      {!isRunning ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <div style={{
          padding: '0 20px',
        }}>
          <div className="flex justify-end">
            <Button onClick={() => handleProductModal()}>T???o m???i</Button>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleFilterProductZeroQuantities()}
              className="mr-2 hover:bg-brand-dark max-w-[250px] ease-linear duration-300 text-base h-[50px] mt-0"
            >
              S???n ph???m h???t h??ng
            </button>
            <Input
           // className=''
              placeholder="T??m ki???m s???n ph???m"
              type="email"
              className=" m-0 max-w-[300px] text-base h-[50px] mt-0"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="h-[450px] overflow-x-auto overflow-y-auto" style={{
            maxWidth: '100%',
            fontSize: '14px',
            }}>
            <Table striped bordered className="text-center bg-white">
              <thead>
                <tr>
                  <th>STT</th>
                  <td>T??n s???n ph???m</td>
                  <td>Gi???m gi??</td>
                  <td>S??? l?????ng</td>
                  <td>Gi?? ti???n</td>
                  <td>Gi?? sale</td>
                  <td>S???a</td>
                  <td>X??a</td>
                  <td>Xem chi ti???t</td>
                </tr>
              </thead>
              {listProductZero.length > 0 &&
                listProductZero.map((item, index) => (
                  <Fragment key={index}>
                    <tbody>
                      <tr className="mx-auto my-auto">
                        <th>{item.productId}</th>
                        <td className="flex items-center">
                          <div>
                            <img
                              src={
                                item.productImage
                                  ? item.productImage
                                  : "https://cdn.tgdd.vn/Files/2019/12/04/1224683/6-dau-hieu-ban-nen-thay-chiec-macbook-moi-4.jpg"
                              }
                              className="w-[50px] h-[50px]"
                              alt=""
                            />
                          </div>
                          <div className="ml-2">{item.productName}</div>
                        </td>
                        <td>{item.discount}%</td>
                        <td>{item.quantity}</td>
                        <td>{numberWithCommas(item.unitPrice)}</td>
                        <td>
                          {numberWithCommas(
                            item.unitPrice -
                              item.unitPrice * (item.discount / 100)
                          )}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            onClick={() => handleModal(item.productId, false)}
                            className="btn-click max-w-[100px] h-[30px]"
                          >
                            S???a
                          </Button>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            // onClick={() => handleDeleteProduct(item.productId)}
                            onClick={
                              () =>
                                onButtonDeleteClick({
                                  id: item.productId,
                                  name: item.productName,
                                })
                              // () =>
                              // handleDeleteCategory(item.categoryId)
                            }
                            className="btn-click max-w-[100px] h-[30px] "
                          >
                            X??a
                          </Button>
                        </td>
                        <td>
                          <Button
                            onClick={() => handleModal(item.productId, true)}
                            className="btn-click max-w-[100px] h-[30px]"
                          >
                            Chi ti???t
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Fragment>
                ))}
            </Table>
          </div>
          <Modal className="bg-secondary" isOpen={modal} toggle={handleModal}>
            <ModalHeader toggle={handleModal}>
              {!readOnly ? "S???a Product" : "Chi ti???t s???n ph???m"}
            </ModalHeader>
            <ModalBody>
              <Label>M?? t??? s???n ph???m</Label>
              <Input
              className='m-0'
                placeholder="enter desc"
                type="text"
                value={value.descriptionProduct}
                readOnly={readOnly}
                onChange={(e) =>
                  setValue({
                    ...value,
                    descriptionProduct: e.target.value,
                  })
                }
                required
              />
              <Label>Discount</Label>
              <Input
              className='m-0'
                placeholder="enter Discount"
                type="text"
                value={value.discount}
                readOnly={readOnly}
                onChange={(e) =>
                  setValue({
                    ...value,
                    discount: e.target.value,
                  })
                }
              />
              <Label>T??n s???n ph???m</Label>
              <Input
              className='m-0'
                placeholder="enter name product"
                type="text"
                value={value.productName}
                readOnly={readOnly}
                onChange={(e) =>
                  setValue({
                    ...value,
                    productName: e.target.value,
                  })
                }
              />
              <Label>S??? l?????ng</Label>
              <Input
              className='m-0'
                placeholder="Enter quantity"
                type="text"
                value={value.quantity}
                readOnly={readOnly}
                onChange={(e) =>
                  setValue({
                    ...value,
                    quantity: e.target.value,
                  })
                }
              />
              <Label>Gi?? b??n</Label>
              <Input
              className='m-0'
                placeholder="Enter price"
                type="text"
                value={value.unitPrice}
                readOnly={readOnly}
                onChange={(e) =>
                  setValue({
                    ...value,
                    unitPrice: e.target.value,
                  })
                }
              />
              <Label>???nh s???n ph???m</Label>
              {readOnly ? (
                <div className="flex justify-center">
                  <img src={value.productImage} width={200} alt="" />
                </div>
              ) : (
                <>
                  <Input
                    placeholder="Img"
                    type="file"
                    onChange={(e) =>
                      setValue({
                        ...value,
                        productImageLink: e.target.files[0],
                      })
                    }
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {!readOnly ? (
                <Button
                  className="bg-primary"
                  color="primary"
                  onClick={() => handleChangeProduct()}
                >
                  X??c nh???n
                </Button>
              ) : (
                ""
              )}
              <Button className="bg-dark" onClick={handleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Modal className="bg-secondary" isOpen={modalConfirmDeleteShow} toggle={handleClose}>
              <ModalHeader>X??a s???n ph???m</ModalHeader>
              <ModalBody>
                {`B???n c?? mu???n x??a s???n ph???m "${selectedProduct.name}" kh??ng?`}
              </ModalBody>
              <ModalFooter>
              <Button
                  className="bg-primary"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={() => handleDeleteProduct(selectedProduct.id)}
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
            isOpen={productModal}
            toggle={handleProductModal}
          >
            <ModalHeader toggle={handleProductModal}>
              T???o m???i Product
            </ModalHeader>
            <ModalBody>
              <Label>M?? t??? s???n ph???m</Label>
              <Input
              className='m-0'
                pattern="^{3,}$"
                placeholder="enter desc"
                type="text"
                onChange={(e) =>
                  setValue({
                    ...value,
                    descriptionProduct: e.target.value,
                  })
                }
                required
                valid={value.descriptionProduct === "" ? false : true}
                invalid={value.descriptionProduct === "" ? true : false}
                focused
              />
              <Label>Discount</Label>
              <Input
              className='m-0'
                pattern="^[0-9]{3,16}$"
                placeholder="enter Discount"
                type="number"
                onChange={(e) =>
                  setValue({
                    ...value,
                    discount: e.target.value,
                  })
                }
                min={1}
                required
                valid={value.discount === "" ? false : true}
                invalid={value.discount === "" ? true : false}
              />
              <Label>T??n s???n ph???m</Label>
              <Input
              className='m-0'
                placeholder="enter name product"
                type="text"
                onChange={(e) =>
                  setValue({
                    ...value,
                    productName: e.target.value,
                  })
                }
                required
                valid={value.productName === "" ? false : true}
                invalid={value.productName === "" ? true : false}
              />
              <Label>S??? l?????ng</Label>
              <Input
              className='m-0'
                placeholder="Enter quantity"
                type="number"
                onChange={(e) =>
                  setValue({
                    ...value,
                    quantity: e.target.value,
                  })
                }
                min={1}
                required
                valid={value.quantity === "" ? false : true}
                invalid={value.quantity === "" ? true : false}
              />
              <Label>Gi?? b??n</Label>
              <Input
              className='m-0'
                placeholder="Enter price"
                type="number"
                onChange={(e) =>
                  setValue({
                    ...value,
                    unitPrice: e.target.value,
                  })
                }
                min={1}
                required
                valid={value.unitPrice === "" ? false : true}
                invalid={value.unitPrice === "" ? true : false}
              />
              <Label>???nh s???n ph???m</Label>
              <Input
              className='m-0'
                placeholder="Img"
                type="file"
                onChange={(e) =>
                  setValue({
                    ...value,
                    productImageLink: e.target.files[0],
                  })
                }
                required
              />
              <div className="my-2">
                <Input
                className='m-0 mb-4'
                  type={"select"}
                  size="3"
                  value={categoryId}
                  onChange={onChangeSelectionCategory}
                  //className=""
                  required
                >
                  {category.length > 0 &&
                    category.map((item, index) => (
                      <option key={index} value={item.categoryId}>
                        {item.categoryName}
                      </option>
                    ))}
                </Input>
                <Input
                className='m-0'
                  type={"select"}
                  size="3"
                  value={supplierId}
                  onChange={onChangeSelectionSupplier}
                  required
                >
                  {supplier.length > 0 &&
                    supplier.map((item, index) => (
                      <option key={index} value={item.supplierId}>
                        {item.supplierName}
                      </option>
                    ))}
                </Input>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-primary"
                color="primary"
                onClick={() => handleCreateProduct()}
              >
                X??c nh???n
              </Button>
              <Button className="bg-dark" onClick={handleCancelProductModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      )}
      <Container className="flex justify-center">
        <div className="py-4">
          <Pagination
            count={20}
            color="primary"
            className="bg-white rounded-lg"
            size="large"
            onChange={handleChangePage}
          />
        </div>
      </Container>
    </div>
  );
};

export default AdminProduct;
