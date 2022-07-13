import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import {
  Button,
  Container,
} from "reactstrap";
import { GlobalState } from "../../../GlobalState";
import { Constants } from "../../commons/Constants";
import numberWithCommas from "../../commons/numberwithCommas";
import cartService from "../../services/cartProduct/cart.service";
import productService from "../../services/product/product.service";
import storageService from "../../services/storage.service";
import Navbar from "./components/menu-navbar/Navbar";
import ProductList from "./components/product-list/ProductList";
import "./home.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import orderService from "../../services/orders/order.service";
//import supplierService from "../../services/supplier/supplier.service";


const Home = () => {
  const ctx = useContext(GlobalState);
  const [productCategory, setProductCategory] = useState([]);
  //const [supplier, setSupplier] = useState([]);
  const [listSelling, setListSelling] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const [filterDataCateSup, setFilterDataCateSup] = useState({
    categoryId: null,
    supplierId: null,
  });

  const [cateId, setCateId] = useState(null);
  // const [supplierId, setSupplierId] = useState(null);

  // const [filterPrice, setFilterPrice] = useState({
  //   start: null,
  //   end: null,
  // });

  const navigate = useNavigate();

  const handleFilterProductCategory = (e, CateId, SupplierId) => {
    e.stopPropagation();
    setFilterDataCateSup({
      categoryId: CateId,
      supplierId: SupplierId,
    });
    productService.getProductByCategory(CateId, SupplierId, 0).then((data) => {
      setProductCategory(data);
    });
  };
  const handleFilterProductCategoryId = (CateId) => {
    setCateId(CateId);
    productService.getProductByCategoryId(CateId, 0).then((data) => {
      setProductCategory(data);
    });
  };
  // const handleFilterProductSupplierById = (supplierId) => {
  //   setSupplierId(supplierId);
  //   productService.getProductBySupplierId(supplierId, 0).then((data) => {
  //     setProductCategory(data);
  //   });
  // };

  // const handleFilterProductPrice = (start, end) => {
  //   setFilterPrice({
  //     start,
  //     end,
  //   });
  //   productService.getProductPrice(start, end, 0).then((data) => {
  //     setProductCategory(data);
  //   });
  // };

  useEffect(() => {
    productService.getAllProduct(0).then((data) => {
      if (data) {
        setIsRunning(true);
        setProductCategory(data);
      }
    });
  }, []);

  const handleChangePage = (e, value) => {
    if (
      filterDataCateSup.categoryId !== null &&
      filterDataCateSup.supplierId !== null
    ) {
      productService
        .getProductByCategory(
          filterDataCateSup.categoryId,
          filterDataCateSup.supplierId,
          value - 1
        )
        .then((data) => {
          setProductCategory(data);
        });
    } else if (cateId !== null) {
      productService.getProductByCategoryId(cateId, value - 1).then((data) => {
        setProductCategory(data);
      });
    } 
    // else if (supplierId !== null) {
    //   productService
    //     .getProductBySupplierId(supplierId, value - 1)
    //     .then((data) => {
    //       setProductCategory(data);
    //     });
    // } 
    // else if (filterPrice.start !== null && filterPrice.end !== null) {
    //   productService
    //     .getProductPrice(filterPrice.start, filterPrice.end, value - 1)
    //     .then((data) => {
    //       setProductCategory(data);
    //     });
    // } 
    else {
      productService.getAllProduct(value - 1).then((data) => {
        setProductCategory(data);
      });
    }
  };

  const handleSearchProduct = (search) => {
    productService.sreachProduct(search).then((data) => {
      if (data) {
        setProductCategory(data);
      }
    });
  };

  // useEffect(() => {
  //   supplierService.getAllSupplier().then((data) => {
  //     setSupplier(data);
  //   });
  // }, []);

  // const handleClickProduct = (id) => {
  //   storageService.set(Constants.productId, id);
  // };

  const handleAddProduct = (id) => {
    let loggedIn = storageService.get(Constants.loggedIn);
    let userId = storageService.get(Constants.curUser);

    if (loggedIn && loggedIn !== undefined) {
      productService.getProductById(id).then((data) => {
        console.log(id);
        if (data.quantity !== 0) {
          cartService.createNewCart(id, userId, 1).then((data) => {
            if (data) {
              alert("Đã thêm sản phẩm thành công");
              ctx.setReload(Math.random());
            }
          });
        } else {
          alert("Sản phẩm đã hết hàng");
        }
      });
    } else { 
      alert("Bạn phải đăng nhập để thực hiện chức năng này")
      navigate("/login");
    }
  };

  useEffect(() => {
    orderService
      .getRevenue(
        moment().add(-3, "months").format("YYYY-MM-DD"),
        moment().add(1, "days").format("YYYY-MM-DD")
      )
      .then((data) => {
        setListSelling(data.products);
      });
  }, []);

  return (
    <div className="container-shop pb-[100px]" style={{minHeight:'100vh', position: 'relative'}}>
      <Navbar
        handleSearchProduct={handleSearchProduct}
        handleFilterProductCategory={handleFilterProductCategory}
        handleFilterProductCategoryId={handleFilterProductCategoryId}
        //handleFilterProductPrice={handleFilterProductPrice}
      />
      <Container fluid="xxl" style={{padding: '0 80px', margin: '0'}}>
        <Link to={"/filter-product"}>
          <button className="w-[200px] text-base">Lọc sản phẩm</button>
        </Link>
      </Container>
      <Container>
        {listSelling.length > 0 && (
          <div className="">
            <h2 className="text-center my-4 fs-1 fw-bold">Sản phẩm sale</h2>
            <div className="flex w-[1300px] overflow-x-auto">
              {listSelling.map((item, index) => (
                <div className="product-main" key={`product-${index}`}
                style={{
                  height: 'auto',
                  fontSize: '16px',
                  minWidth: '280px',
                  borderRadius: '5px',
                }}
                >
                  
                    <img
                      src={
                        item.productImage
                          ? item.productImage
                          : "https://hanoicomputercdn.com/media/news/1004_macbook_nao_tot_nhat_hien_nay.jpg"
                      }
                      alt="Product"
                      className="product-img-pic"
                      style={{
                        aspectRatio: '1/1',
                        objectFit: 'cover'
                      }}
                    />
             
                  <div className="product-title">
                    <div className="product-name">{item.productName}</div>
                    <div className="product-price">
                      {`Giá: ${numberWithCommas(
                        item.unitPrice - item.unitPrice * (item.discount / 100)
                      )} VND`}

                      <div className="inline-block ml-2 p-1 bg-red-600 text-white">
                        -{item.discount}%
                      </div>
                    </div>
                  </div>
                  <div className="product-btn d-flex justify-content-between items-center">
                    <Link
                      to={`/products/${item.productId}`}
                      //onClick={() => handleClickProduct(item.productId)}
                      className="btn-click"
                    >
                      <Button>Xem chi tiết</Button>
                    </Link>
                    <Button
                    className="bg-dark btn-click" 
                      onClick={() => handleAddProduct(item.productId)}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
      <h1 className="my-4 fs-2 fw-bold">Sản phẩm SHOP</h1>
      <Container
        fluid="lg"
        className="d-flex items-center justify-center"
      >
        <ProductList productCategory={productCategory} isRunning={isRunning} />
      </Container>
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

export default Home;
