import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaUser, FaShoppingCart } from "react-icons/fa";
import { MdInventory2, MdKeyboardArrowDown } from "react-icons/md";
import { GiCupcake } from "react-icons/gi";
import { BiCategoryAlt } from "react-icons/bi";

const Sidebar = () => {
  const [openInventory, setOpenInventory] = useState(true);
  const location = useLocation();

  // Determine active based on current path
  const active = location.pathname;

  return (
    <div
      className="sidebar"
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#4E342E",
        padding: "20px 0",
        color: "#FFEFD9",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MenuItem
        icon={<FaHome size={20} />}
        label="Home"
        to="/admin"
        active={active === "/admin"}
      />
      <MenuItem
        icon={<FaUsers size={20} />}
        label="Customers"
        to="/customer"
        active={active === "/customer"}
      />

      {/* Inventory Dropdown */}
      <div
        className="menu-item"
        onClick={() => setOpenInventory(!openInventory)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 20px",
          cursor: "pointer",
          backgroundColor: active.includes("/product") || active.includes("/categories") ? "#FFF4E6" : "transparent",
          color: active.includes("/product") || active.includes("/categories") ? "#4E342E" : "#FFEFD9",
          borderLeft: active.includes("/product") || active.includes("/categories") ? "5px solid #FFB6C1" : "5px solid transparent",
          transition: "0.2s",
        }}
      >
        <MdInventory2 size={22} />
        <span style={{ fontWeight: "600" }}>Inventory</span>
        <MdKeyboardArrowDown
          size={20}
          style={{
            marginLeft: "auto",
            transform: openInventory ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        />
      </div>

      {openInventory && (
        <div style={{ marginLeft: "40px", marginTop: "5px" }}>
          <DropdownItem
            icon={<GiCupcake size={20} />}
            label="Products"
            to="/product"
            active={active === "/product"}
          />
          <DropdownItem
            icon={<BiCategoryAlt size={20} />}
            label="Categories"
            to="/category"
            active={active === "/category"}
          />
        </div>
      )}

      <MenuItem
        icon={<FaShoppingCart size={20} />}
        label="Orders"
        to="/order"
        active={active === "/order"}
      />

      <MenuItem
        icon={<FaUser size={20} />}
        label="Profile"
        to="/profile"
        active={active === "/profile"}
      />
    </div>
  );
};

/* COMPONENTS -------------------------------------------------- */
const MenuItem = ({ icon, label, to, active }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        cursor: "pointer",
        backgroundColor: active ? "#FFF4E6" : "transparent",
        color: active ? "#4E342E" : "#FFEFD9",
        borderLeft: active ? "5px solid #FFB6C1" : "5px solid transparent",
        transition: "0.2s",
      }}
    >
      {icon}
      <span style={{ fontWeight: 600 }}>{label}</span>
    </div>
  </Link>
);

const DropdownItem = ({ icon, label, to, active }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 0",
        cursor: "pointer",
        color: active ? "#FFB6C1" : "#FFEFD9",
        fontWeight: active ? "700" : "500",
        transition: "0.2s",
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  </Link>
);

export default Sidebar;
