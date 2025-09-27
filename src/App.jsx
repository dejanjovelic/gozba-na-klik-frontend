import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/pages/Header";
import Home from "./components/pages/Home";
import CustomerRegisterForm from "./components/forms/register/CustomerRegisterForm";
import CustomerHomePage from "./components/pages/CustomerHomePage";
import LoginForm from "./components/forms/login/LoginForm";
import { AuthProvider } from "./config/AuthContext";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/register" element={<CustomerRegisterForm/>}/>
          <Route path="/customer/:id" element={<CustomerHomePage/>}/>          
          <Route path="/login" element={<LoginForm />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};
export default App;
