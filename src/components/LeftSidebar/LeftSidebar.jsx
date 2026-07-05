import React, { useState } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";

const LeftSidebar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="left-sidebar">
      <div className="sidebar-top">

        <div className="logo-row">
          <img src={assets.logo} alt="Logo" className="logo" />

          <div className="menu">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="menu-icon"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="sub-menu">
                <p>Edit Profile</p>
                <hr />
                <p>Logout</p>
              </div>
            )}
          </div>
        </div>

        <div className="search-box">
          <img
            src={assets.search_icon}
            alt="Search"
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Search user..."
          />
        </div>

      </div>

      <div className="users-list">
        {Array(12).fill("").map((item, index) => (
          <div key={index} className="user">
            <img
              src={assets.profile_img}
              alt=""
              className="profile-img"
            />

            <div className="user-info">
              <p>John Doe</p>
              <span>Hello! How are you?</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;