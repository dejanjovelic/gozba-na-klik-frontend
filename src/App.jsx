import React, { useEffect, useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import UsersHomePage from "./features/Account/pages/UsersHomePage.jsx";
import CustomerRegisterForm from "./features/Account/pages/CustomerRegisterForm.jsx";
import CustomerHomePage from "./features/Customer/home/pages/CustomerHomePage.jsx";
import LoginForm from "./features/Account/pages/LoginForm.jsx";
import AdminUserList from "./features/Admin/users/pages/AdminUserList.jsx";
import AdminHomePage from "./features/Admin/home/AdminHomePage";
import AdminRestaurants from "./features/Admin/restaurants/pages/AdminRestaurants";
import UserProfile from "./features/Account/pages/UserProfile.jsx";
import RestaurantOwnerRestaurants from "./features/RestaurantOwner/restaurants/pages/RestaurantOwnerRestaurants";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import RestaurantOwnerHomePage from "./features/RestaurantOwner/home/pages/RestaurantOwnerHomePage";
import CourierHomePage from "./features/Courier/home/pages/CourierHomePage";
import EmployeeHomePage from "./features/Employee/Pages/EmployeeHomePage.jsx";
import CourierWorkingHours from "./features/Courier/workingHours/pages/CourierWorkingHours";
import "./features/Account/styles/usersHomePage.scss";
import CustomerAddresses from "./features/Customer/addresses/pages/CustomerAddresses.jsx";
import RestaurantsPage from "./features/Restaurant/pages/RestaurantsPage.jsx";
import CustomerAllergens from "./features/Customer/allergens/pages/CustomerAllergens.jsx";
import CustomerMeals from "./features/Customer/meals/pages/CustomerMeals.jsx";
import RestaurantMenu from "./features/Restaurant/pages/RestaurantMenu.jsx";
import UserContext from "./shared/context/UserContext.jsx";
import CourierActiveOrderPage from "./features/Courier/order/pages/CourierActiveOrderPage.jsx";
import RestaurantOwnerOrderView from "./features/RestaurantOwner/orders/pages/RestaurantOwnerOrderView";
import { OrderProvider } from "./shared/context//OrderContext";
import CustomerOrders from "./features/Customer/orders/pages/CustomerOrders.jsx";
import ForgotPasswordPage from "./features/Account/pages/ForgotPasswordPage.jsx";
import ResetPassword from "./features/Account/pages/ResetPassword.jsx";
import { setOnUnauthorized } from "./config/axiosConfig";
import Spinner from "./shared/components/Spinner";
import UserProfilePage from "./features/Account/pages/UserProfilePage.jsx";
import CustomerCreditCardsPage from "./features/Customer/creditCards/pages/CustomerCreditCardsPage.jsx";
import RestaurantOwnerEditRestaurant from "./features/RestaurantOwner/restaurants/pages/RestaurantOwnerEditRestaurant";
import Layout from "./shared/layouts/Layout.jsx";
import { useMemo } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useMemo(
    () => 
      createBrowserRouter(
        createRoutesFromElements(
          <Route element={<Layout />}>
            <Route path="/" element={<RestaurantsPage />} />
            <Route
              path="/restaurant-menu/:id"
              element={
                <OrderProvider>
                  <RestaurantMenu />
                </OrderProvider>
              }
            />
            <Route path="/register" element={<CustomerRegisterForm />} />
            <Route path="/login" element={<LoginForm />}></Route>
            <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
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
              <Route
                path="restaurants/:id/edit"
                element={<RestaurantOwnerEditRestaurant />}
              />
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
              <Route path="addresses" element={<CustomerAddresses />} /> // mozda treba obrisati
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

            {user?.role.toLowerCase().trim() === "customer" ? (
              <Route path="/profile" element={<UserProfilePage />}>
                <Route index element={<UserProfile />} />
                <Route path="allergens" element={<CustomerAllergens />} />
                <Route path="addresses" element={<CustomerAddresses />} />
                <Route
                  path="credit-cards"
                  element={<CustomerCreditCardsPage />}
                />
              </Route>
            ) : (
              <Route path="/profile" element={<UserProfile />} />
            )}
          </Route>,
        ),
      ) , [user]
    );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    setLoading(false);

    setOnUnauthorized(() => {
      setUser(null);
      router.navigate("/");
    });
  }, []);

  return (
    <div className="content">
      {loading ? (
        <Spinner />
      ) : (
        <UserContext.Provider value={{ user, setUser, loading }}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      )}
    </div>
  );
};
export default App;
