import React, { useEffect, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import categoryService from "../../../../services/category/category.service";
import supplierService from "../../../../services/supplier/supplier.service";
import "./navbar.scss";

const Navbar = ({
  //setShowCategory,
  //showCategory,
  handleSearchProduct,
  handleFilterProductCategory,
  handleFilterProductCategoryId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

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
    <nav className="flex items-center justify-around bg-black-900 text-white mb-2 rounded-md menu-list-view navbar">
      <Link to={"/"} className="cursor-pointer navbar_logo">
        Trang chủ
      </Link>
      <ul 
      //onClick={() => setShowCategory(!showCategory)} 
      className="menu-main navbar_ul">
        <li className="block">Danh mục</li>
        <li className="menu-list" style={{background: 'none'}}>
          <ul className="rounded-md overflow-hidden ulsecond">
            {category.map((category, index) => (
              <li
                key={index}
                className="bg-brand-dark text-[14px] p-3 hover:bg-brand menu-main-sub navbar_item"
                onClick={() =>
                  handleFilterProductCategoryId(category.categoryId)
                }
              >
                {category.categoryName}
                <ul className="absolute top-0 w-[200px] rounded-md overflow-hidden menu-sub">
                  {supplier.map((item, index) => (
                    <li
                      key={index}
                      className="bg-brand-dark text-[14px] p-3 hover:bg-brand navbar_item"
                      onClick={(e) =>
                        handleFilterProductCategory(
                          e,
                          category.categoryId,
                          item.supplierId
                        )
                      }
                    >
                      {category.categoryName} {item.supplierName}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      </ul>
      <Link to={"/policy"} className="cursor-pointer">
        Chính sách bán hàng
      </Link>
      <Link to={"/contact"} className="cursor-pointer">
        Liên hệ
      </Link>
      <div className="flex items-center text-black navbar-search">
        <input
          type="text"
          placeholder="Search"
          className="w-[300px] navbar_input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search
          className="ml-2 cursor-pointer text-white"
          onClick={() => handleSearchProduct(searchQuery)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
