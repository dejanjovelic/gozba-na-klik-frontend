import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/pages/Header";
import Home from "./components/pages/home";
import CustomerRegisterForm from "./components/forms/register/CustomerRegisterForm";
import CustomerHomePage from "./components/pages/CustomerHomePage";


const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<CustomerRegisterForm/>}/>
          <Route path="/customer/:id" element={<CustomerHomePage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )

}
export default App;
