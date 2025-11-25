import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar"; // make sure the path is correct

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />

      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>

      <style>{`
        /* Prevent horizontal scroll */
        html, body, #root {
          overflow-x: hidden;
        }

        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f5f3ee;
          width: 100%;
        }

        .content-wrapper {
          display: flex;
          flex: 1;
          width: 100%;
        }

        .sidebar {
          width: 250px;
          min-height: calc(100vh - 70px);
        }

        .main-content {
          flex: 1;
          padding: 25px 35px;
          min-height: calc(100vh - 70px);
          overflow-y: auto;
          /* prevent horizontal scroll caused by child elements */
          overflow-x: hidden;
        }

        /* Optional: make all child elements wrap inside main-content */
        .main-content > * {
          max-width: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};


export default Layout;
