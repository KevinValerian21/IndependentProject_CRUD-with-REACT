import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Home from './Components/LoginSignup/Home';
import DetailIOM from './Components/LoginSignup/DetailIOM';
import PagesUbah from './Components/LoginSignup/PagesUbah';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DataIOM from './Components/LoginSignup/DataIOM';
import TambahIOM from './Components/LoginSignup/TambahIOM';


function App() {
  const isLoggedIn = localStorage.getItem("Login");
  const [userData, setUserData] = useState(null); // State to store user data

  
  const handleLogin = (data) => {

    // Update user data in state
    setUserData(data); 

  };

  return (
    <Router>
    <Routes>
      <Route
        path="/"
        element={<LoginSignup onLogin={handleLogin} />}
      />
      <Route
        path="/Home"
        element={isLoggedIn ? <Home /> : <Navigate to="/" />}
      />
      <Route
        path="/DataIOM"
        element={isLoggedIn ? <DataIOM /> : <Navigate to="/" />}
      />
      <Route
        path="/DetailIOM"
        element={isLoggedIn ? <DetailIOM /> : <Navigate to="/" />}
      />
      <Route
        path="/PagesUbah/:pageId"
        element={isLoggedIn ? <PagesUbah /> : <Navigate to="/" />}
      />
      <Route
        path="/TambahIOM"
        element={isLoggedIn ? <TambahIOM /> : <Navigate to="/" />}
      />
    </Routes>
  </Router>
  );
}

export default App;
  