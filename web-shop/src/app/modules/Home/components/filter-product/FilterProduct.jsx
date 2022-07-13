import { MenuItem, Pagination, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import categoryService from "../../../../services/category/category.service";
import productService from "../../../../services/product/product.service";
import supplierService from "../../../../services/supplier/supplier.service";
import ProductList from "../product-list/ProductList";

const priceArr = [
  {
    priceStart: 10000,
    priceEnd: 100000,
  },
  {
    priceStart: 100000,
    priceEnd: 1000000,
  },
  {
    priceStart: 1000000,
    priceEnd: 40000000,
  },
  {
    priceStart: 4000000,
    priceEnd: 10000000,
  },
  {
    priceStart: 10000000,
    priceEnd: 20000000,
  },
  {
    priceStart: 20000000,
    priceEnd: 30000000,
  },
  {
    priceStart: 30000000,
    priceEnd: 35000000,
  },
  {
    priceStart: 35000000,
    priceEnd: 40000000,
  },
];

const FilterProduct = () => {
  const [supplier, setSupplier] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  // const defauleValue = 'Choose Option ...'

  const [paramSearch, setParamSearch] = useState({
    categoryId: 0,
    supplierId: 0,
    start: 0,
    end: 0,
  });

  useEffect(() => {
    supplierService.getAllSupplier().then((data) => {
      setSupplier(data);
    });
    categoryService.getAllCategory().then((data) => {
      setCategories(data);
    });
  }, []);

  // useEffect(() => {
  //   setParamSearch({...paramSearch, categoryId: defauleValue})
  // }, [defauleValue])

  const handleChangeCate = (e) => {
    setParamSearch({
      ...paramSearch,
      categoryId: e.target.value,
    });
  };
  const handleChangeSup = (e) => {
    setParamSearch({
      ...paramSearch,
      supplierId: e.target.value,
    });
  };
  const handleChangeStart = (e) => {
    setParamSearch({
      ...paramSearch,
      start: e.target.value,
    });
  };
  const handleChangeEnd = (e) => {
    setParamSearch({
      ...paramSearch,
      end: e.target.value,
    });
  };

  const handleSubmitFilter = () => {

    if(paramSearch.start <= paramSearch.end)
    {
      productService.filterProduct(paramSearch, 0).then((data) => {
        setProductCategory(data);
      });
    }
    else if(paramSearch.start === 0 && paramSearch.end !==0)
    {
      alert("Bạn vui lòng chọn khoảng giá sản phẩm nhỏ nhất")
    }
    else if(paramSearch.end === 0 && paramSearch.start !==0)
    {
      alert("Bạn vui lòng chọn khoảng giá sản phẩm lớn nhất")
    }
    else
    {
      alert("Lôi! Bạn vui lòng chọn khoảng giá bắt đầu lớn hơn khoảng giá kết thúc")
    }
   
  };

  const handleChangePage = (e, value) => {
    productService.filterProduct(paramSearch, value - 1).then((data) => {
      setProductCategory(data);
    });
  };

  return (
    <div className="container-shop pb-[100px]">
      <div className="w-full h-[60px] flex items-center justify-around text-white bg-[#1A4B78]">
        <Link to={"/"}>Trang Chủ</Link>
        <Link to={"/policy"}>Chính sách bán hàng</Link>
        <Link to={"/contact"}>Liên hệ</Link>
        <Link to={"/"}>Tìm kiếm</Link>
      </div>
      <Container
        fluid="lg"
        className="d-flex mt-[40px] justify-center min-h-[150px]"
      >
        <div className="px-[10px]">
          <label htmlFor="" className="mb-[10px]">Loại sản phẩm</label>
          <Select
            className="m-0"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={paramSearch.categoryId}
            label="Category"
            sx={{
              width: 300,
              height: 50,
              margin: "15px",
              background: "#fff",
            }}
            onChange={handleChangeCate}
          >
            <MenuItem key={0} value={0} >Chọn loại sản phẩm ...</MenuItem>
            {categories.map((item, idx) => (
              <MenuItem key={idx} value={item.categoryId}>
                {item.categoryName}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="px-[10px]">
          <label htmlFor="" className="mb-[10px]">Hãng sản phẩm</label>
          <Select
            className="m-0"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={paramSearch.supplierId}
            label="Supplier"
            sx={{
              width: 300,
              height: 50,
              margin: "15px",
              background: "#fff",
            }}
            onChange={handleChangeSup}
          >
            <MenuItem key={0} value={0} >Chọn hãng sản phẩm ...</MenuItem>
            {supplier.map((item, idx) => (
              <MenuItem key={idx} value={item.supplierId}>
                {item.supplierName}
              </MenuItem>
            ))}
          </Select>
        </div><div>
          <label htmlFor="" className="mb-[10px]">Chọn giá sản phẩm giới hạn nhỏ nhất</label>
          <Select
            className="m-0"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={paramSearch.start}
            label="Start"
            sx={{
              width: 300,
              height: 50,
              margin: "15px",
              background: "#fff",
            }}
            onChange={handleChangeStart}
          >
            <MenuItem key={0} value={0} >choose giá ...</MenuItem>
            {priceArr.map((item, idx) => (
              <MenuItem key={idx} value={item.priceStart}>
                {item.priceStart}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="px-[10px]">
          <label htmlFor="" className="mb-[10px]">Chọn giá sản phẩm giới hạn lớn nhất</label>
          <Select
            className="m-0"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={paramSearch.end}
            label="End"
            sx={{
              width: 300,
              height: 50,
              margin: "15px",
              background: "#fff",
            }}
            onChange={handleChangeEnd}
          >
            <MenuItem key={0} value={0} >Chọn giá ...</MenuItem>
            {priceArr.map((item, idx) => (
              <MenuItem key={idx} value={item.priceEnd}>
                {item.priceEnd}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Container>
      <Container
        fluid="lg"
        className="d-flex items-center justify-center min-h-[50px]"
      >
        <button onClick={handleSubmitFilter}>Lọc sản phẩm</button>
      </Container>

      <Container
        fluid="lg"
        className="d-flex items-center justify-center min-h-[600px]"
      >
        <ProductList productCategory={productCategory} isRunning={true} />
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

export default FilterProduct;