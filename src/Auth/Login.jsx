import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });


      console.log("LOGIN RESPONSE:", response.data);

      const { user, token } = response.data;

      if (!user) {
        setError("Login failed: user data missing");
        return;
      }

      // Save full user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);
      if (token) localStorage.setItem("authToken", token);

      navigate("/admin"); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1 className="login-title">Milktea Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
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

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      {/* CSS */}
      <style>{`
        html, body, #root { height: 100%; margin: 0; }
        .login-wrapper { height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; background-color: #f4e3d7; }
        .login-container { width: 350px; padding: 40px 30px; background: #fff2e6; border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); text-align: center; font-family: Arial, sans-serif; }
        .login-title { color: #7b4f3b; margin-bottom: 20px; font-size: 28px; font-weight: bold; }
        .error-message { color: red; margin-bottom: 10px; }
        .login-form .form-group { margin-bottom: 15px; text-align: left; }
        .login-form label { display: block; margin-bottom: 5px; color: #5a3e2b; font-weight: bold; }
        .login-form input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #d0b8a8; background-color: #fff; font-size: 16px; }
        .password-container { position: relative; }
        .toggle-password { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 14px; color: #7b4f3b; }
        .login-button { width: 100%; padding: 12px; background-color: #b78563; color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background 0.3s; margin-top: 10px; }
        .login-button:hover { background-color: #a16b4d; }
      `}</style>
    </div>
  );
};

export default Login;
