import React from "react";
import { useNavigate }  from "react-router-dom";
import "./css/header.css";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className={"header"}>
      <div className={"header-content-wrapper"}>
        <div className={"home-link"} onClick={ (e) => navigate('/') }>
          ← Back to Home
        </div>
      </div>
    </div>
  );
}

export default Header;