import React from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { useDispatch, useSelector } from 'react-redux'
import { logout } from "../../redux/userRedux";
import { useLocation, useHistory } from "react-router-dom"

export default function Topbar() {

  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    history.push("/login");
  }

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Admin Panel</span>  
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          {/* <img src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="topAvatar" /> */}
          <p onClick={handleLogout}>{user.username}</p>
        </div>
      </div>
    </div>
  );
}
