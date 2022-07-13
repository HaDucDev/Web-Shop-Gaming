import {
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./app/modules/Auth/Login/Login";
import Register from "./app/modules/Auth/Register/Register";
import Header from "./app/modules/Home/components/header/Header";
import Home from "./app/modules/Home/Home";
import Product from "./app/modules/Home/components/product/Product";
import CartProduct from "./app/modules/Home/components/CartProduct/CartProduct";
import { DataProvider } from "./GlobalState";
import Admin from "./app/modules/Admin/Admin";
import Shipper from "./app/modules/Shipper/Shipper";
import Forbidden from "./app/modules/Forbidden/Forbidden";
import User from "./app/modules/Admin/user/User";
import AdminProduct from "./app/modules/Admin/product/AdminProduct";
import AdminOrder from "./app/modules/Admin/order/AdminOrder";
import AdminReview from "./app/modules/Admin/review/AdminReview";
import AdminCategory from "./app/modules/Admin/category/AdminCategory";
import AdminSupplier from "./app/modules/Admin/Supplier/AdminSupplier";
import ForgotPassword from "./app/modules/Auth/forgot-password/ForgotPassword";
import ForgotPasswordConfirm from "./app/modules/Auth/forgot-password/ForgotPasswordConfirm";
import OrderPage from "./app/modules/Home/components/orders/OrderPage";
import AdminRevenue from "./app/modules/Admin/revenue/AdminRevenue";
import UserInfo from "./app/modules/Home/components/user-info/UserInfo";
import ChangePassword from "./app/modules/Home/components/change-password/ChangePassword";
import Policy from "./app/modules/Home/components/Policy/Policy";
import Contact from "./app/modules/Home/components/Contact/Contact";
import FilterProduct from "./app/modules/Home/components/filter-product/FilterProduct";
import Footer from "./app/modules/Home/components/footer/Footer";

function App() {
  const queryClient = new QueryClient();
  let location = useLocation();

  return (
    <div className="app-footer">
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <Header />
        <div className="app">
        {location.pathname === "/contact" ||
        location.pathname === "/policy" ||
        location.pathname === "/products/:id" ? (
          <div className="w-full h-[60px] flex items-center justify-around text-white bg-[#1A4B78] rounded-md rounded-none">
            <Link to={"/"}>Trang Chủ</Link>
            <Link to={"/policy"}>Chính sách bán hàng</Link>
            <Link to={"/contact"}>Liên hệ</Link>
            <Link to={"/"}>Tìm kiếm</Link>
          </div>
        ) : (
          ""
        )}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/forgot-confirm" element={<ForgotPasswordConfirm />} />

            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/filter-product" element={<FilterProduct />} />

            <Route path="/admin" element={<Admin />}>
              <Route path="users" element={<User />} />
              <Route path="products" element={<AdminProduct />} />
              <Route path="orders" element={<AdminOrder />} />
              <Route path="reviews" element={<AdminReview />} />
              <Route path="category" element={<AdminCategory />} />
              <Route path="supplier" element={<AdminSupplier />} />
              <Route path="revenue" element={<AdminRevenue />} />
            </Route>

            <Route path="/shipper" element={<Shipper />} />
            <Route path="/products/:id" element={<Product />} />
            <Route path="/cart" element={<CartProduct />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/userInfo" element={<UserInfo />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="*" element={<Forbidden />} />
          </Routes>
          <Footer/>
        </div>
      </DataProvider>
    </QueryClientProvider>
    </div>
  );
}

export default App;
