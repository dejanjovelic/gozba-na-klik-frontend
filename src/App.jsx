import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/pages/Header";
import Footer from "./components/pages/Footer";
import Home from "./components/pages/Home";
import CustomerRegisterForm from "./components/forms/register/CustomerRegisterForm";
import CustomerHomePage from "./components/pages/CustomerHomePage";
import LoginForm from "./components/forms/login/LoginForm";
import { AuthProvider } from "./config/AuthContext";
import AdminUserList from "./components/pages/Admin/AdminUserList";

const App = () => {
  return (
    <div className="content">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/register" element={<CustomerRegisterForm/>}/>
          <Route path="/customer/:id" element={<CustomerHomePage/>}/>          
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/admin/users" element={<AdminUserList/>}></Route>
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};
export default App;
