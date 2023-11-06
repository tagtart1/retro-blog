import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserProvider";
import { PostProvider } from "./PostProvider";
import SignUp from "./components/SignUp/SignUp";
import LogIn from "./components/LogIn/LogIn";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PostProvider>
          <Routes>
            <Route path="*" element={<App />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </PostProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
