import React, { useState } from "react";

export default function AddToppingModal({ onClose, onToppingAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState("available");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://milkteabackend-js.onrender.com/add_toppings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, stock, status }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add topping");
      }

      const data = await response.json();
      onToppingAdded(data);
      onClose();

      setName("");
      setPrice(0);
      setStock(0);
      setStatus("available");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Topping</h2>
        <form onSubmit={handleSubmit}>
          <label>Topping Name</label>
          <input
            type="text"
            placeholder="Enter topping name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Price</label>
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0"
            required
          />

          <label>Stock</label>
          <input
            type="number"
            placeholder="Enter stock quantity"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min="0"
            required
          />

          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="available">Available</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "➕ Add Topping"}
            </button>
            <button type="button" onClick={onClose}>
              ✖ Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; justify-content: center; align-items: center; z-index: 1000;
          padding: 20px;
        }
        .modal-content {
          background: #fff9f4; width: 400px; max-height: 90vh; padding: 25px;
          border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow-y: auto;
          font-family: "Poppins", sans-serif;
        }
        h2 { text-align: center; margin-bottom: 20px; color: #6b3e2e; font-weight: 700; }
        form { display: flex; flex-direction: column; gap: 10px; }
        label { font-weight: 600; color: #6b3e2e; margin-top: 10px; }
        input, select { padding: 12px; border-radius: 12px; border: 2px solid #ffd6c2; outline: none; font-size: 15px; }
        input:focus, select:focus { border-color: #ff9f9f; }
        .modal-buttons { display: flex; justify-content: space-between; margin-top: 15px; }
        button { padding: 12px 14px; border-radius: 12px; border: none; font-weight: bold; cursor: pointer; width: 48%; }
      `}</style>
    </div>
  );
}
