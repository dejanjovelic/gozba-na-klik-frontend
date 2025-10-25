import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/pages/Header";
import Footer from "./components/pages/Footer";
import UsersHomePage from "./components/pages/UsersHomePage";
import CustomerRegisterForm from "./components/forms/register/CustomerRegisterForm";
import CustomerHomePage from "./components/pages/Customer/CustomerHomePage";
import LoginForm from "./components/forms/login/LoginForm";
import { AuthProvider } from "./config/AuthContext";
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
import "./styles/usersHomePage.scss"
import CustomerAddresses from "./components/pages/Customer/CustomerAddresses";
import RestaurantPaginationFilterSort from "./components/pages/Resataurant/RestaurantPaginationFilterSort";
import CustomerAllergens from "./components/pages/Customer/CustomerAllergens";
import CustomerMeals from "./components/pages/Customer/CustomerMeals";
import RestaurantMenu from "./components/pages/RestaurantMenu";

const App = () => {
  return (
    <div className="content">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/"
              element={
                <RestaurantPaginationFilterSort />} />
            <Route path="/restaurant-menu/:id" element={<RestaurantMenu />} />
            <Route path="/register" element={<CustomerRegisterForm />} />
            <Route path="/login" element={<LoginForm />}></Route>

            <Route
              path="/administrator/*"
              element={
                <ProtectedRoute allowedRoles={["Administrator"]}>
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
                <ProtectedRoute allowedRoles={["RestaurantOwner"]}>
                  <UsersHomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<RestaurantOwnerHomePage />} />
              <Route
                path="restaurants"
                element={<RestaurantOwnerRestaurants />}
              />
            </Route>

            <Route
              path="/customer/*"
              element={
                <ProtectedRoute allowedRoles={["Customer"]}>
                  <UsersHomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerHomePage />} />
              <Route path="allergens" element={<CustomerAllergens />} />
              <Route path="addresses" element={<CustomerAddresses />} />
              <Route path="meals" element={<CustomerMeals />} />
            </Route>

            <Route
              path="/courier/*"
              element={
                <ProtectedRoute allowedRoles={["Courier"]}>
                  <UsersHomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<CourierHomePage />} />
              <Route path="workingHours" element={<CourierWorkingHours />} />
            </Route>

            <Route
              path="/employee/*"
              element={
                <ProtectedRoute allowedRoles={["Employee"]}>
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
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};
export default App;
