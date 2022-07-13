import React, { useEffect, useState } from "react";
import { Button, Container } from "reactstrap";
import numberWithCommas from "../../../../commons/numberwithCommas";
import categoryService from "../../../../services/category/category.service";
import supplierService from "../../../../services/supplier/supplier.service";

const priceArr = [
  {
    priceStart: 0,
    priceEnd: 1000000,
  },
  {
    priceStart: 1000000,
    priceEnd: 3000000,
  },
  {
    priceStart: 3000000,
    priceEnd: 9000000,
  },
  {
    priceStart: 9000000,
    priceEnd: 90000000,
  },
];

const Category = ({
  handleFilterProductCategory,
  handleFilterProductPrice,
  showCategory,
}) => {
  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);

  useEffect(() => {
    categoryService.getAllCategory().then((data) => {
      setCategory(data);
    });
    supplierService.getAllSupplier().then((data) => {
      setSupplier(data);
    });
  }, []);

  return (
    <div>
      <h5 className="fs-3">Danh mục</h5>
      <div className="d-flex justify-content-around">
        {category.map((item, index) => (
          <Button
            key={index}
            className="me-2 bg-secondary"
            onClick={() => handleFilterProductCategory(item.categoryId)}
          >
            {item.categoryName}
          </Button>
        ))}
      </div>
      <h5 className="fs-3">Chọn khoảng giá</h5>
      <div className="d-flex justify-content-around">
        {priceArr.map((item, index) => (
          <Button
            key={index}
            className="me-2 bg-secondary"
            onClick={() =>
              handleFilterProductPrice(item.priceStart, item.priceEnd)
            }
          >
            {`${numberWithCommas(item.priceStart)} ~ ${
              Number(item.priceEnd) > 999999999
                ? "Trở lên"
                : numberWithCommas(item.priceEnd)
            }`}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Category;
