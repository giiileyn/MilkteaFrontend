import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import AdminDashboard from "./Page/AdminDashboard";
import Layout from "./Components/Layout"; // import the Layout wrapper
import Product from "./Page/Product";
import Order from "./Page/Order";
import Receipt from "./Page/Receipt";
import Customer from "./Page/Customer";
import Category from "./Page/Category";
import Profile from "./Page/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin route wrapped in Layout */}
        <Route path="/admin" element={ <Layout> <AdminDashboard /></Layout> }/>
        <Route path="/product" element={ <Layout> <Product /></Layout> }/>
        <Route path="/order" element={ <Layout> <Order /></Layout> }/>
        <Route path="/receipt" element={ <Layout> <Receipt /></Layout> }/>
        <Route path="/customer" element={ <Layout> <Customer /></Layout> }/>
        <Route path="/category" element={ <Layout> <Category /></Layout> }/>
        <Route path="/profile" element={ <Layout> <Profile /></Layout> }/>

      </Routes>
    </Router>
  );
};

export default App;
