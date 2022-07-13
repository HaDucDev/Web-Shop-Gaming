import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, CardText, Table } from "reactstrap";
import { GlobalState } from "../../../../../../GlobalState";
import { Constants } from "../../../../../commons/Constants";
import numberWithCommas from "../../../../../commons/numberwithCommas";
import cartService from "../../../../../services/cartProduct/cart.service";
import storageService from "../../../../../services/storage.service";

const ItemProduct = ({
  item,
  index,
  handleDeleteProduct,
  focus = false,
  getCart,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [value, setValue] = useState(Number(quantity) + Number(item.quantity));
  const ctx = useContext(GlobalState);
  useEffect(() => {
    getCart && getCart();
  }, [getCart, value, setValue]);

  const handleAddProductCategories = (id) => {
    let userId = storageService.get(Constants.curUser);
    cartService.createNewCart(id, userId, 1).then((data) => {
      if (data) {
        console.log("Up quantity");
        setValue(Number(value) + 1);
      }
    });
  };

  const handleDownProductCategories = (id) => {
    let userId = storageService.get(Constants.curUser);
    cartService.createNewCart(id, userId, -1).then((data) => {
      if (data) {
        console.log("Down quantity");
        value <= 0 ? setValue(0) : setValue(value - 1);
        if (data.quantity <= 0) {
          cartService.deleteCart(id, userId).then((data) => {
            if (data) {
              window.location.reload();
            }
          });
        }
      }
    });
  };

  const handleChangeInput = (e, id) => {
    setValue(e.target.value);
  };

  const handleAddQuantity = (id) => {
    let userId = storageService.get(Constants.curUser);
    if (value > 0) {
      cartService
        .createNewCart(id, userId, value - item.quantity)
        .then((data) => {
          if (data) {
            console.log("Up quantity");
            window.location.reload();
          }
        });
    } else {
      alert("Số lượng sản phẩm ít nhất là 1. Bạn vui lòng chọn đúng");
    }
  };

  const preventMinus = (e) => {
    if (e.code === 'Minus') {
      e.preventDefault();
    }
    // if (e.code === 'Digit0') {
    //   e.preventDefault();
    // }

    // if (e.code === ' Numpad0') {
    //   e.preventDefault();
    // }

  };

  return (
    <tr>
      <th scope="row">{index + 1}</th>
      <td className="flex items-center">
        <div>
          <img
            src={item.productImage}
            className="rounded-full w-[100px]"
            alt=""
          />
        </div>
        <Link to={`/products/${item.productId}`} className="w-full">
          <div className="ml-2">{item.productName}</div>
        </Link>
      </td>
      <td>
        <CardText className="d-flex mt-3 mb-3 items-center justify-content-center">
          {!focus && (
            <CardText
              className="cursor-pointer px-3"
              onClick={() => handleDownProductCategories(item.productId)}
            >
              -
            </CardText>
          )}
          <CardText>
            <input
              readOnly={focus}
              type="number"
              value={value}
              className="w-[80px] pl-4"
              onChange={(e) => handleChangeInput(e, item.productId)}
              onBlur={() => handleAddQuantity(item.productId)}
              min={1}
              onKeyPress={preventMinus}
            />
          </CardText>
          {!focus && (
            <CardText
              className="cursor-pointer px-3"
              onClick={() => handleAddProductCategories(item.productId)}
            >
              +
            </CardText>
          )}
        </CardText>
      </td>
      <td>
        {numberWithCommas(
          (item.unitPrice - (item.discount / 100) * item.unitPrice) *
            item.quantity
        )}
      </td>
      {!focus && (
        <td>
          <Button
            className="border-2 bg-dark"
            onClick={() => handleDeleteProduct(item.productId)}
          >
            Xóa
          </Button>
        </td>
      )}
    </tr>
  );
};

export default ItemProduct;
