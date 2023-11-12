import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserProvider";
import { PostProvider } from "./PostProvider";
import SignUp from "./components/SignUp/SignUp";
import LogIn from "./components/LogIn/LogIn";
import { ErrorProvider } from "./ErrorProvider";
import NotFound from "./components/NotFound/NotFound";
import BlogApp from "./components/BlogApp/BlogApp";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PostProvider>
          <ErrorProvider>
            <Routes>
              <Route path="/" element={<BlogApp />} />
              <Route path="/dashboard/*" element={<App />} />
              <Route path="/log-in" element={<LogIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="*" element={<NotFound isTopLevel={true} />} />
            </Routes>
          </ErrorProvider>
        </PostProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
