import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Customer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("https://milkteabackend-py.onrender.com/api/users/");
        console.log("API response:", response.data);

        const mappedCustomers = response.data.data.map((user) => ({
          id: user.id,
          email: user.email,
          avatar: user.avatar,
          status: "Active", 
        }));

        setCustomers(mappedCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await axios.delete(`https://milkteabackend-py.onrender.com/api/users/${id}`);
    if (res.data.success) {
      
      setCustomers(customers.filter((c) => c.id !== id));
      alert(res.data.message || "User deleted successfully");
    } else {
      alert("Failed to delete user");
    }
  } catch (error) {
    console.error("Delete failed:", error.response?.data || error);
    alert(error.response?.data?.detail || "Failed to delete user");
  }
};



  return (
    <div
      className="p-6"
      style={{
        width: "100vw",
        overflowX: "auto",
        background: "#F3E9DA",
        minHeight: "100vh",
      }}
    >
      <table
        className="border border-gray-200"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2 font-semibold text-blue-600">{c.id}</td>
              <td className="px-4 py-2 flex items-center gap-2">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    overflow: "hidden",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                >
                  <img
                  src={c.avatar.startsWith("http") ? c.avatar : `http://127.0.0.1:5000${c.avatar}`}
                  alt="avatar"
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "cover",
                  }}
                />

                </div>
                {c.email}
              </td>
              <td className="px-4 py-2 text-green-600 font-semibold">{c.status}</td>
              <td className="px-4 py-2 flex gap-2">
                <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                  <FaEdit />
                </button>
                <button
                className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                onClick={() => handleDelete(c.id)}
                >
                <FaTrash />
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customer;
