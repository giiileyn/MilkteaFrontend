import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Account Details");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const parsedUser = JSON.parse(storedUser);
  if (!storedUser) return;

  try {
    const parsedUser = JSON.parse(storedUser);

    // if somehow `id` is missing, set it from _id
    if (!parsedUser.id && parsedUser._id) {
      parsedUser.id = parsedUser._id;
    }

    setUser(parsedUser);
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
  }
}, []);


  if (!user) return <p>Loading profile...</p>;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ========== UPDATE PROFILE (name, email, avatar) ==========
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    if (avatarFile) formData.append("avatar", avatarFile);

    const res = await axios.patch(
      `https://milkteabackend-py.onrender.com/api/users/${user.id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } } // <-- important
    );

    if (res.data.success) {
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setAvatarFile(null);
      setSuccess("Profile updated successfully!");
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.detail || "Failed to update profile. Try again.");
  }
};


  // ========== UPDATE PASSWORD ==========
const handlePasswordUpdate = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (newPassword !== confirmPassword) {
    setError("New password and confirm password do not match.");
    return;
  }

  try {
    const payload = {
      currentPassword,
      newPassword
    };

    const res = await axios.patch(
      `https://milkteabackend-js.onrender.com/password/${user.id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.data.success) {
      setSuccess(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Preserve avatar in localStorage
      const updatedUser = { ...user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Failed to update password");
  }
};



  return (
    <div className="profile-container">
      <aside className="sidebar">
        <div className="profile-image">
          <img 
            src={avatarFile 
                  ? URL.createObjectURL(avatarFile) 
                  : (user.avatar 
                      ? `https://milkteabackend-py.onrender.com/api/${user.avatar}` 
                      : "https://via.placeholder.com/100")} 
            alt="Profile" 
          />

        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === "Account Details" ? "active" : ""} onClick={() => handleTabClick("Account Details")}>
              Account Details
            </li>
            <li className={activeTab === "Change Password" ? "active" : ""} onClick={() => handleTabClick("Change Password")}>
              Change Password
            </li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="profile-main">
        {activeTab === "Account Details" && (
          <>
            <h2>Account Settings</h2>
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="profile-form" onSubmit={handleProfileUpdate}>
              <label>Email address</label>
              <input
                type="email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />

              <label>Full name</label>
              <input
                type="text"
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />

              <label>Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />

              <button type="submit">Update Profile</button>
            </form>
          </>
        )}

        {activeTab === "Change Password" && (
          <>
            <h2>Change Password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form className="profile-form" onSubmit={handlePasswordUpdate}>
              <label>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />

              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

              <button type="submit">Update Password</button>
            </form>
          </>
        )}
      </main>

      <style>{`
        .profile-container { display: flex; font-family: 'Arial'; background: #fff0f5; min-height: 100vh; width: 100vw; overflow-x: hidden; }
        .sidebar { width: 220px; background: #d1a37f; padding: 20px; display: flex; flex-direction: column; align-items: center; color: white; }
        .profile-image img { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #fff; margin-bottom: 20px; object-fit: cover; }
        .sidebar-nav ul { list-style: none; padding: 0; width: 100%; }
        .sidebar-nav li { padding: 10px 15px; margin: 5px 0; border-radius: 8px; cursor: pointer; transition: background 0.3s; }
        .sidebar-nav li.active, .sidebar-nav li:hover { background: #f3c6a9; color: #333; }
        .profile-main { flex: 1; padding: 40px; }
        .profile-main h2 { margin-bottom: 20px; color: #8b4513; }
        .profile-form { display: flex; flex-direction: column; gap: 15px; }
        .profile-form label { font-weight: bold; color: #5a2d0c; }
        .profile-form input { padding: 10px; border: 1px solid #d1a37f; border-radius: 8px; outline: none; font-size: 14px; }
        .profile-form button { padding: 10px; background: #b97f60; border: none; color: white; font-weight: bold; border-radius: 8px; cursor: pointer; transition: background 0.3s; }
        .profile-form button:hover { background: #8b5a3c; }
      `}</style>
    </div>
  );
}
