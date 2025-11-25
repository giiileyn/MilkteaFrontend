import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCategoryModal from "./AddCategoryModal";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All"); // Track which filter is active
  const [searchQuery, setSearchQuery] = useState(""); // Track search input

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/count/categories/count");
      const categoriesData = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setCategories(categoriesData);
      setFilteredCategories(categoriesData); // default to all
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter based on activeFilter AND searchQuery
  const applyFilters = (filter = activeFilter, query = searchQuery) => {
    let filtered = categories;

    // Filter by stock
    if (filter === "Low Stock") {
      filtered = filtered.filter(c => c.total_products > 0 && c.total_products <= 5);
    } else if (filter === "Out of Stock") {
      filtered = filtered.filter(c => c.total_products === 0);
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    }

    setFilteredCategories(filtered);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    applyFilters(filter, searchQuery);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(activeFilter, query);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "#7BBF84";
      case "Low Stock": return "#E3B341";
      case "Out of Stock": return "#D26A5B";
      default: return "#A67C52";
    }
  };

  return (
    <div className="category-container">
      <h2>Manage your categories</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search categories.."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-row">
        <button
          className={`filter-btn ${activeFilter === "All" ? "active" : ""}`}
          onClick={() => handleFilterClick("All")}
        >
          All ({categories.length})
        </button>

        <button
          className={`filter-btn ${activeFilter === "Low Stock" ? "active" : ""}`}
          onClick={() => handleFilterClick("Low Stock")}
        >
          Low Stock ({categories.filter(c => c.total_products > 0 && c.total_products <= 5).length})
        </button>

        <button
          className={`filter-btn ${activeFilter === "Out of Stock" ? "active" : ""}`}
          onClick={() => handleFilterClick("Out of Stock")}
        >
          Out of Stock ({categories.filter(c => c.total_products === 0).length})
        </button>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Category
        </button>
      </div>

      <div className="category-list">
        {filteredCategories.map((c) => (
          <div key={c.id} className="category-card">
            <div>
              <h3>{c.name}</h3>
              <p>Total Products: {c.total_products || 0}</p>
            </div>
            <span
              className="status"
              style={{
                backgroundColor:
                  c.total_products === 0 ? getStatusColor("Out of Stock") :
                  c.total_products <= 5 ? getStatusColor("Low Stock") :
                  getStatusColor("Active")
              }}
            >
              {c.total_products === 0 ? "Out of Stock" : c.total_products <= 5 ? "Low Stock" : "Active"}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          onCategoryAdded={fetchCategories} 
        />
      )}


      <style>{`
        .category-container {
          padding: 30px;
          background: #F8F4EC;
          color: #4B3A2F;
          font-family: 'Inter', sans-serif;
          width: 100vw;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        h2 {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .search-box {
          background: #E8E0D2;
          border-radius: 50px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          width: 100%;
        }
        .search-box input {
          width: 100%;
          border: none;
          background: none;
          outline: none;
          font-size: 15px;
          color: #4B3A2F;
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid #CBB8A0;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          color: #4B3A2F;
        }
        .filter-btn.active {
          background: #A67C52;
          color: #fff;
          border: none;
        }

        .add-btn {
          margin-left: auto;
          padding: 8px 18px;
          background: #A67C52;
          border: none;
          border-radius: 20px;
          color: white;
          font-size: 14px;
          cursor: pointer;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 100%;
        }

        .category-card {
          background: white;
          border: 2px solid #CBB8A0;
          border-radius: 14px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-card h3 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .category-card p {
          font-size: 14px;
          opacity: 0.7;
        }

        .status {
          padding: 6px 12px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Category;
