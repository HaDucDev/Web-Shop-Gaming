import React, { Fragment, useCallback, useEffect, useState } from "react";
import {Button,CardBody,CardImg,CardSubtitle,CardText,CardTitle,Container,Spinner,} from "reactstrap";
import productService from "../../../../services/product/product.service";
import cartService from "../../../../services/cartProduct/cart.service";
import storageService from "../../../../services/storage.service";
import { Constants } from "../../../../commons/Constants";
import numberWithCommas from "../../../../commons/numberwithCommas";
import { useNavigate, useLocation, Link } from "react-router-dom";
import reviewService from "../../../../services/reviews/review.service";
import { Rating } from "@mui/material";

const Product = () => {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();
  const urlRouter = useLocation();

  const [isRunning, setIsRunning] = useState(true);

  const productId = urlRouter.pathname.split("/products/")[1];

  const getAllReview = useCallback(() => {
    reviewService.getReviewsByProductId(productId).then((data) => {
      setReviews(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    getAllReview();
  }, [getAllReview]);

  useEffect(() => {
    productService.getProductById(productId).then((data) => {
      if (data) {
        setIsRunning(false);
        setProduct(data);
      }
    });
  }, [productId]);

  const handleAddProduct = (id) => {
    let userId = storageService.get(Constants.curUser);
    const quantityUpdate = quantity === 0 ? 1 : quantity;
    if (userId) {
      cartService.createNewCart(id, userId, quantityUpdate).then((data) => {
        if (data) {
          alert("Đã thêm sản phẩm thành công");
          window.location.reload();
        }
      });
    } else {
      alert("Bạn phải đăng nhập để thực hiện chức năng này")
      navigate("/login");
    }
  };

  const averangeRating = reviews.reduce(
    (prev, curr) => {
    return prev + curr.rating;
  }, 0);
  // hàm tính tổng số sao. lần 1 giá trị ban đầu là 0 nên prev là 0. curr đây là json gồm nhiều thứ như ngày tháng và nội dung nhưng chỉ cần lấy số sao thôi

  let location = useLocation();

  console.log(location.pathname.split('/')[1]);

  return (
    <Fragment>
      {isRunning ? (
        <Spinner color="success" className="absolute top-50" />
      ) : (
        <div >
          {location.pathname.split('/')[1] === "products" ? (
              <div className="w-full h-[60px] flex items-center justify-around text-white bg-[#1A4B78]">
                <Link to={"/"}>Trang Chủ</Link>
                <Link to={"/policy"}>Chính sách bán hàng</Link>
                <Link to={"/contact"}>Liên hệ</Link>
                <Link to={"/"}>Tìm kiếm</Link>
              </div>
            ) : (
              ""
            )}
          <Container className="mt-5 pb-[100px]">
            <div className="flex w-[100%] bg-white p-[20px]" style={{
            }}>
              <CardImg
                alt="Card image cap"
                src={
                  product.productImage
                    ? product.productImage
                    : "https://hanoicomputercdn.com/media/news/1004_macbook_nao_tot_nhat_hien_nay.jpg"
                }
                width="50%"
                className="max-w-[40%] mr-[50px]"
                style={{
                  objectFit: 'cover'
                }}
              />
              <CardBody className="min-w-[50%] bg-white">
                <CardTitle tag="h5" className="fw-bolder text-[32px]">
                  {product.productName}
                </CardTitle>
                <CardSubtitle className="mb-2 mt-4 text-danger flex text-[24px]" tag="h6">
                  {`Giá: ${numberWithCommas(
                    product.unitPrice -
                      product.unitPrice * (product.discount / 100) || 0
                  )} VND`}{" "}
                  /{" "}
                  <del className="ml-2 text-black">
                    {numberWithCommas(product.unitPrice) + " VND"}
                  </del>
                </CardSubtitle>
                <CardSubtitle className="my-4 text-purple-600 text-[20px] flex" tag="h6">
                  {`Số lượng còn: ${product.quantity}`}
                </CardSubtitle>

                <CardText className="mt-3 mb-3 text-[20px]">
                <div className="my-4 text-blue-600 text-[20px] flex">Mô tả sản phẩm: </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.descriptionProduct,
                    }}
                  />
                </CardText>
                <CardText className="d-flex mt-3 mb-3">
                  <CardText
                    className="cursor-pointer px-3"
                    onClick={() => {
                      quantity <= 0
                        ? setQuantity(0)
                        : setQuantity(quantity - 1);
                    }}
                  >
                    -
                  </CardText>
                  <CardText>{quantity}</CardText>
                  <CardText
                    className="cursor-pointer px-3"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </CardText>
                </CardText>
                <Button
                  className="bg-dark"
                  onClick={() => handleAddProduct(product.productId)}
                >
                  Mua ngay
                </Button>
              </CardBody>
            </div>
            <div className="bg-white my-4 p-4 rounded-lg">
              <div className="mr-4">Đánh giá - nhận xét từ khách hàng</div>
              <div className="flex items-center">
                <div className="font-semibold text-[50px] mr-2">
                  {reviews.length > 0
                    ? (averangeRating / reviews.length).toFixed(1)
                    : 0}
                </div>
                <div className="">
                  {/* div này hình ngôi sao ở trung bình tô màu */}
                  <Rating
                    name="size-large"
                    value={Math.floor(averangeRating / reviews.length)}
                    size="large"
                    sx={{
                      fontSize: "10rem",
                    }}
                    disabled                   
                  />
                  <div className="ml-2 text-gray-500">
                    <strong>{reviews.length}</strong> nhận xét
                  </div>
                </div>
              </div>
            </div>
            <div >
            {reviews &&
              reviews.map((item, idx) => {
                return (
                  <figure className="flex bg-white rounded-xl p-4 rounded-lg my-4">
                    <img
                      className="w-24 h-24 mx-4 my-4 border-2 border-purple-900 rounded-full"
                      src={
                        item.avatar
                          ? item.avatar
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwbGozsS9QP10p16rZiCrQD0koXVkI4c7LwUHab9dkmFRcN0VqCkB37f2y0EnySItwykg&usqp=CAU"
                      }
                      alt=""
                      width="384"
                      height="512"
                    />
                    <div className="pl-6 pt-6 md:p-8 text-left space-y-4">
                      <div className="flex items-center">
                        <Rating
                          name="size-medium"
                          value={item.rating}
                          size="medium"
                          sx={{
                            fontSize: "10rem",
                          }}
                          disabled
                        />
                        <div className="ml-2">{item.dateCreate}</div>
                      </div>
                      <blockquote>
                        <p className="text-lg">{item.comments}</p>
                      </blockquote>
                      <figcaption className="font-semibold">
                        <div className="text-indigo-700">
                          Customer {item.userId}
                        </div>
                      </figcaption>
                    </div>
                  </figure>
                );
              })}

            </div>
            
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default Product;
