import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const API_URL = import.meta.env.VITE_API_URL; // ✅ Use Render backend URL

      // Use FormData for file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      const response = await axios.post(
        `${API_URL}/auth/register`, // updated
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess("Registration successful! You can now login.");
      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);

      // Optionally redirect after a short delay
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <h1 className="register-title">Milktea Registration</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {passwordVisible ? "Hide" : "Show"}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>

      {/* CSS */}
      <style>{`
        html, body, #root { height: 100%; margin: 0; }
        .register-wrapper {
          height: 100vh; width: 100vw;
          display: flex; justify-content: center; align-items: center;
          background-color: #f4e3d7;
        }
        .register-container {
          width: 400px; padding: 40px 30px;
          background: #fff2e6; border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          text-align: center; font-family: Arial, sans-serif;
        }
        .register-title { color: #7b4f3b; margin-bottom: 20px; font-size: 28px; font-weight: bold; }
        .error-message { color: red; margin-bottom: 10px; }
        .success-message { color: green; margin-bottom: 10px; }
        .register-form .form-group { margin-bottom: 15px; text-align: left; }
        .register-form label { display: block; margin-bottom: 5px; color: #5a3e2b; font-weight: bold; }
        .register-form input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #d0b8a8; background-color: #fff; font-size: 16px; }
        .password-container { position: relative; }
        .toggle-password {
          position: absolute; right: 10px; top: 50%;
          transform: translateY(-50%);
          cursor: pointer; font-size: 14px; color: #7b4f3b;
        }
        .register-button {
          width: 100%; padding: 12px; background-color: #b78563;
          color: #fff; border: none; border-radius: 10px;
          font-size: 16px; font-weight: bold; cursor: pointer;
          transition: background 0.3s; margin-top: 10px;
        }
        .register-button:hover { background-color: #a16b4d; }
      `}</style>
    </div>
  );
};

export default Register;
