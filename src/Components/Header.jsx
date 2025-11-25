import React, { useEffect, useState } from "react";
import logo from "../assets/milkymood.jpg";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Load user initially
    loadUser();

    // Listen to storage changes (triggered when avatar updated in Profile)
    const handleStorageChange = () => {
      loadUser();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="header-center">
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <div className="header-right">
        {user && user.avatar ? (
          <img
            src={`http://localhost:5000${user.avatar}`}
            alt="Avatar"
            className="avatar"
          />
        ) : (
          <div className="avatar-placeholder" />
        )}
      </div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 50px;
          background-color: #3e2c26;
          color: #e0d6c1;
        }

        .logo {
          height: 80px;
          width: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar {
          height: 50px;
          width: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e0d6c1;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .avatar:hover {
          transform: scale(1.1);
        }

        .avatar-placeholder {
          height: 50px;
          width: 50px;
          background: #a38b6d;
          border-radius: 50%;
        }

        .header-center {
          flex: 1;
          margin: 0 30px;
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-container input {
          width: 90%;
          padding: 12px 40px 12px 20px;
          border-radius: 30px;
          border: none;
          outline: none;
          background-color: #c2b89b;
          color: #3e2c26;
          font-size: 16px;
        }

        .search-icon {
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%);
          color: #3e2c26;
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            padding: 10px 20px;
          }

          .header-center {
            margin: 10px 0;
            width: 100%;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
