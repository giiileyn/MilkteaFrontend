import React, { useState } from "react";

export default function AddCategoryModal({ onClose, onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://milkteabackend-js.onrender.com/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName, description }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to add category");
      }

      const data = await response.json();
      onCategoryAdded?.(data); // optional chaining in case prop missing
      setCategoryName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addproduct-overlay">
      <div className="addproduct-modal">
        <h2>Add New Category</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <div className="modal-buttons">
            <button type="submit" className="btn submit-btn" disabled={loading}>
              {loading ? "Adding..." : "➕ Add Category"}
            </button>
            <button type="button" className="btn cancel-btn" onClick={onClose}>
              ✖ Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .addproduct-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; justify-content: center; align-items: center; z-index: 1000;
          padding: 20px;
        }
        .addproduct-modal {
          background: #fff9f4; width: 400px; max-height: 90vh; padding: 25px;
          border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow-y: auto;
          font-family: "Poppins", sans-serif;
        }
        h2 { text-align: center; margin-bottom: 20px; color: #6b3e2e; font-weight: 700; }
        .form-grid { display: flex; flex-direction: column; gap: 15px; }
        input, textarea { padding: 12px; border-radius: 12px; border: 2px solid #ffd6c2; outline: none; font-size: 15px; background: #fff; }
        input:focus, textarea:focus { border-color: #ff9f9f; }
        .modal-buttons { display: flex; justify-content: space-between; margin-top: 10px; }
        .btn { padding: 12px 14px; border-radius: 12px; border: none; font-weight: bold; cursor: pointer; width: 48%; }
        .submit-btn { background: #ff8c94; color: #3c2c2a; }
        .cancel-btn { background: #ffb3b3; color: #3c2c2a; }
      `}</style>
    </div>
  );
}
