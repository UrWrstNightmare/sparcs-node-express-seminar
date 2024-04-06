import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import FeedPage from "./pages/feed";
import SSRPage from "./pages/ssr";
import PageNotFound from "./pages/404";
import Footer from "./components/footer";
import './App.css';
import AccountPage from "./pages/account";
import KawaiiStagram from "./pages/kawaii-stagram";


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <HomePage/> }/>
          <Route path="/feed" element={ <FeedPage/> }/>
          <Route path="/account" element={ <AccountPage/> }/>
          <Route path="/kawaii-stagram" element={ <KawaiiStagram/> }/>
          <Route path="/ssr" element={ <SSRPage/> }/>
          <Route path="*" element={ <PageNotFound/> }/>
        </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
