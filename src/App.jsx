import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/pages/Header";
import Home from "./components/pages/home";
import LoginForm from "./components/forms/register/LoginForm";


const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginForm/>}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  )

}
export default App;
