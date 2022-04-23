import React from "react";
import { useNavigate }  from "react-router-dom";
import "./css/home.css";

const HomePage = (props: {}) => {
  const navigate = useNavigate();
  const [ BServerConnected, setBServerConnected ] = React.useState<boolean>(false);

  return (
    <div className={"home"}>
      <div className={"home-banner"}>
        <div className={"sparcs-logo-wrapper"}>
          <span className={"sparcs-logo"}>SPARCS</span> Backend Seminar
        </div>
      </div>
      <div className={"link-wrapper"}>
        <div className={"link-options"}>
          <div className={"page-link"} onClick={ () => navigate("/feed") }>
            <div className={"page-subtitle"}>Example #1</div>
            <div className={"page-title"}>CRUD Feed from Server</div>
          </div>
          <div className={"page-link"} onClick={ () => navigate("/account") }>
            <div className={"page-subtitle"}>Example #2</div>
            <div className={"page-title"}>Account State Management</div>
          </div>
          <div className={"page-link"} onClick={ () => navigate("/cat-image") }>
            <div className={"page-subtitle"}>Example #3</div>
            <div className={"page-title"}>Serve *Cute* Image Files</div>
          </div>
          <div className={"page-link"} onClick={ () => navigate("/homework") }>
            <div className={"page-subtitle"}>Example #4</div>
            <div className={"page-title"}>Homework Page</div>
          </div>
        </div>
      </div>
      <div className={"server-status"}>
        <span className={"status-icon " + ( BServerConnected ? "status-connected" : "status-disconnected" )}>•</span>
        &nbsp;&nbsp;{ BServerConnected ? "Connected to API Server 🥳" : "Not Connected to API Server 😭" }
      </div>
    </div>
  )
};

export default HomePage;