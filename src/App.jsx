import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/pages/Header";
import Footer from "./components/pages/Footer";
import UsersHomePage from "./components/pages/UsersHomePage";
import CustomerRegisterForm from "./components/forms/register/CustomerRegisterForm";
import CustomerHomePage from "./components/pages/Customer/CustomerHomePage";
import LoginForm from "./components/forms/login/LoginForm";
import AdminUserList from "./components/pages/Admin/AdminUserList";
import AdminHomePage from "./components/pages/Admin/AdminHomePage";
import AdminRestaurants from "./components/pages/Admin/AdminRestaurants";
import UserProfile from "./components/pages/UserProfile";
import RestaurantOwnerRestaurants from "./components/pages/RestaurantOwner/RestaurantOwnerRestaurants";
import ProtectedRoute from "./components/sharedComponents/ProtectedRoute";
import RestaurantOwnerHomePage from "./components/pages/RestaurantOwner/RestaurantOwnerHomePage";
import CourierHomePage from "./components/pages/Courier/CourierHomePage";
import EmployeeHomePage from "./components/pages/Employee/EmployeeHomePage";
import CourierWorkingHours from "./components/pages/Courier/CourierWorkingHours";
import "./styles/usersHomePage.scss";
import CustomerAddresses from "./components/pages/Customer/CustomerAddresses";
import RestaurantPaginationFilterSort from "./components/pages/Restaurant/RestaurantPaginationFilterSort";
import CustomerAllergens from "./components/pages/Customer/CustomerAllergens";
import CustomerMeals from "./components/pages/Customer/CustomerMeals";
import RestaurantMenu from "./components/pages/Restaurant/RestaurantMenu";
import UserContext from "./config/UserContext";
import CourierActiveOrderPage from "./components/pages/Courier/CourierActiveOrderPage";
import RestaurantOwnerOrderView from "./components/pages/RestaurantOwner/RestaurantOwnerOrderView";
import { OrderProvider } from "./components/OrderContext";
import CustomerOrders from "./components/pages/Customer/CustomerOrders";
import ForgotPasswordPage from "./components/forms/ResetPassword/ForgotPasswordPage";
import ResetPassword from "./components/forms/ResetPassword/ResetPassword";


const App = () => {
  const token = localStorage.getItem('token');
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const [user, setUser] = useState(payload);


  return (
    <div className="content">
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<RestaurantPaginationFilterSort />} />
            <Route path="/restaurant-menu/:id" element={<OrderProvider><RestaurantMenu /></OrderProvider>} />
            <Route path="/register" element={<CustomerRegisterForm />} />
            <Route path="/login" element={<LoginForm />}></Route>
            <Route path="/forgotPassword" element={<ForgotPasswordPage/>}/>
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/administrator/*"
              element={
                <ProtectedRoute allowedRoles={["administrator"]}>
                  <UsersHomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<AdminUserList />} />
              <Route path="restaurants" element={<AdminRestaurants />} />
            </Route>

            <Route
              path="/restaurantOwner/*"
              element={
                <ProtectedRoute allowedRoles={["restaurantOwner"]}>
                  <UsersHomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<RestaurantOwnerHomePage />} />
              <Route
                path="restaurants"
                element={<RestaurantOwnerRestaurants />}
              />
              <Route index element={<RestaurantOwnerHomePage />} />
              <Route path="orderView" element={<RestaurantOwnerOrderView />} />
            </Route>

            <Route
              path="/customer/*"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <UsersHomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerHomePage />} />
              <Route path="allergens" element={<CustomerAllergens />} />
              <Route path="addresses" element={<CustomerAddresses />} />
              <Route path="meals" element={<CustomerMeals />} />
              <Route path="orders" element={<CustomerOrders />} />
            </Route>

            <Route
              path="/courier/*"
              element={
                <ProtectedRoute allowedRoles={["courier"]}>
                  <UsersHomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<CourierHomePage />} />
              <Route path="workingHours" element={<CourierWorkingHours />} />
              <Route path="order" element={<CourierActiveOrderPage />} />
            </Route>

            <Route
              path="/employee/*"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <UsersHomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<EmployeeHomePage />} />
              <Route path="workingHours" element={<EmployeeHomePage />} />
            </Route>

            <Route path="/profile" element={<UserProfile />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
};
export default App;