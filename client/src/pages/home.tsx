import React from "react";
import axios from "axios";
import { useNavigate }  from "react-router-dom";
import { useInterval } from "../tools/interval";
import "./css/home.css";
import { SAPIBase } from "../tools/api";


const HomePage = (props: {}) => {
  const navigate = useNavigate();
  const [ BServerConnected, setBServerConnected ] = React.useState<boolean>(false);

  useInterval(()=>{
    // Note that this may not be the best practice.
    // Race condition may occur if component is unmounted after API call and before state update
    interface IStatusAPIRes { isOnline: boolean };
    const asyncFun = async () => {
      const res = await axios.get<IStatusAPIRes>(SAPIBase + "/status");
      setBServerConnected(res.data.isOnline);
    }
    asyncFun().catch((e) => setBServerConnected(false));
  }, 5000);


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
            <div className={"page-title"}>Middleware & Authorization</div>
          </div>
          <div className={"page-link"} onClick={ () => navigate("/kawaii-stagram") }>
            <div className={"page-subtitle"}>cyber's example</div>
            <div className={"page-title"}>Kawaii-stagram</div>
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