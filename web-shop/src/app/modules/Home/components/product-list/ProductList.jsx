import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Spinner,
} from "reactstrap";
import { GlobalState } from "../../../../../GlobalState";
import { Constants } from "../../../../commons/Constants";
import numberWithCommas from "../../../../commons/numberwithCommas";
import cartService from "../../../../services/cartProduct/cart.service";
import productService from "../../../../services/product/product.service";
import storageService from "../../../../services/storage.service";
import './productlist.scss'

const ProductList = ({ productCategory, isRunning }) => {
  const ctx = useContext(GlobalState);
  const navigate = useNavigate();

  // const handleClickProduct = (id) => {
  //   storageService.set(Constants.productId, id);
  // };

  const handleAddProduct = (id) => {
    let loggedIn = storageService.get(Constants.loggedIn);
    let userId = storageService.get(Constants.curUser);

    if (loggedIn && loggedIn !== undefined) {
      productService.getProductById(id).then(data => {
        console.log(id);
        if (data.quantity !== 0) {
          cartService.createNewCart(id, userId, 1).then((data) => {
            if (data) {
              alert("Đã thêm sản phẩm thành công");
              ctx.setReload(Math.random());
            }
          });
        } else {
          alert('Sản phẩm đã hết hàng')
        }
      })
    } else {
      alert("Bạn phải đăng nhập để thực hiện chức năng này")
      navigate("/login");
    }
  };

  return (
    <>
      {!isRunning ? (
        <Spinner color="success" />
      ) : (
        <div className="d-flex flex-wrap justify-content-between gap-auto product-lll">
          {productCategory.length > 0 ? (
            productCategory.map((item, index) => (
              <div className="product-main" key={`product-${index}`}
                style={{
                  height: 'auto',
                  fontSize: '16px',
                  maxWidth: '280px',
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
            ))
          ) : (
            <div className="">Không có sản phâm nào</div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductList;
