import React from "react";
import Header from "../components/header";
import {SAPIBase} from "../tools/api";

const CatImagePage = () => {
  return (
    <div className={"cat-image"}>
      <Header/>
      <h2>Static *Cute* Image</h2>
      <img alt={"cute cat"} src={ SAPIBase + "/static/cat.jpeg" } className={"cat-image"}/>
      <p>Wow so cute from static</p>
    </div>
  );
};

export default CatImagePage;