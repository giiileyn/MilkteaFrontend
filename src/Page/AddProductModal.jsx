import React, { useState } from "react";

export default function AddProductModal({ categories, onClose }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    flavor: "",
    price: 0,
    sizes: [{ name: "Regular", price: 0 }],
    toppings: [],
    image: null,
    preview: null,
    stock: 0,
    status: "available",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      setNewProduct((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = () => {
        setNewProduct((prev) => ({ ...prev, preview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle dynamic sizes
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...newProduct.sizes];
    updatedSizes[index][field] = field === "price" ? Number(value) : value;
    setNewProduct((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const addSize = () => {
    setNewProduct((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { name: "", price: 0 }],
    }));
  };

  const removeSize = (index) => {
    const updatedSizes = newProduct.sizes.filter((_, i) => i !== index);
    setNewProduct((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  // Handle toppings
  const handleToppingsChange = (index, value) => {
    const updatedToppings = [...newProduct.toppings];
    updatedToppings[index] = value;
    setNewProduct((prev) => ({ ...prev, toppings: updatedToppings }));
  };

  const addTopping = () => {
    setNewProduct((prev) => ({ ...prev, toppings: [...prev.toppings, ""] }));
  };

  const removeTopping = (index) => {
    const updatedToppings = newProduct.toppings.filter((_, i) => i !== index);
    setNewProduct((prev) => ({ ...prev, toppings: updatedToppings }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Cloudinary or another service if needed
    const imageUrl = newProduct.preview || "";

    const payload = {
      name: newProduct.name,
      category: newProduct.category,
      flavor: newProduct.flavor,
      price: Number(newProduct.price),
      sizes: newProduct.sizes,
      toppings: newProduct.toppings.filter((t) => t.trim() !== ""),
      image: imageUrl,
      stock: Number(newProduct.stock),
      status: newProduct.status,
    };

    try {
      const response = await fetch("https://milkteabackend-js.onrender.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create product");

      const data = await response.json();
      console.log("Product created:", data);
      onClose(); // close modal after success
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  return (
    <div className="addproduct-overlay">
      <div className="addproduct-modal">
        <h2>Add New Product</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleChange}
            required
          />

         <select
  name="category"
  value={newProduct.category}
  onChange={handleChange}
  required
>
  <option value="">Select Category</option>
  {categories.map((cat, index) => (
    <option key={cat.id || index} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>


          <input
            type="text"
            name="flavor"
            placeholder="Flavor"
            value={newProduct.flavor}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Base Price"
            value={newProduct.price}
            onChange={handleChange}
            required
          />

          <div>
            <h4>Sizes</h4>
            {newProduct.sizes.map((size, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
                <input
                  type="text"
                  placeholder="Size Name"
                  value={size.name}
                  onChange={(e) => handleSizeChange(i, "name", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={size.price}
                  onChange={(e) => handleSizeChange(i, "price", e.target.value)}
                  required
                />
                {i > 0 && <button type="button" onClick={() => removeSize(i)}>✖</button>}
              </div>
            ))}
            <button type="button" onClick={addSize}>➕ Add Size</button>
          </div>

          <div>
            <h4>Toppings</h4>
            {newProduct.toppings.map((topping, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
                <input
                  type="text"
                  placeholder="Topping"
                  value={topping}
                  onChange={(e) => handleToppingsChange(i, e.target.value)}
                />
                <button type="button" onClick={() => removeTopping(i)}>✖</button>
              </div>
            ))}
            <button type="button" onClick={addTopping}>➕ Add Topping</button>
          </div>

          <div className="file-input-block">
            <label className="file-label">Upload Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
          </div>

          {newProduct.preview && (
            <img className="preview-img" src={newProduct.preview} alt="Preview" />
          )}

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={newProduct.stock}
            onChange={handleChange}
          />

          <select name="status" value={newProduct.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="btn submit-btn">➕ Add Product</button>
            <button type="button" className="btn cancel-btn" onClick={onClose}>✖ Cancel</button>
          </div>
        </form>
      </div>

      <style>{`
        .addproduct-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .addproduct-modal {
          background: #fff9f4;
          width: 480px;
          max-height: 90vh; /* <-- modal scrolls if content exceeds viewport */
          padding: 25px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          animation: slideUp 0.35s ease;
          font-family: "Poppins", sans-serif;
          overflow-y: auto; /* <-- enable vertical scrolling */
        }

        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #6b3e2e;
          font-weight: 700;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input, select {
          padding: 12px;
          border-radius: 12px;
          border: 2px solid #ffd6c2;
          outline: none;
          font-size: 15px;
          background: #fff;
        }

        input:focus, select:focus {
          border-color: #ff9f9f;
        }

        .file-input-block {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .file-label {
          font-size: 14px;
          color: #6b3e2e;
          font-weight: bold;
        }

        .preview-img {
          width: 100%;
          max-height: 200px;
          border-radius: 12px;
          object-fit: cover;
          margin-top: 5px;
        }

        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        .btn {
          padding: 12px 14px;
          border-radius: 12px;
          border: none;
          font-weight: bold;
          cursor: pointer;
          width: 48%;
        }

        .submit-btn {
          background: #ff8c94;
          color: #3c2c2a;
        }

        .cancel-btn {
          background: #ffb3b3;
          color: #3c2c2a;
        }

        .btn:hover {
          transform: translateY(-2px);
          transition: 0.2s;
        }
      `}</style>
    </div>
  );
}
