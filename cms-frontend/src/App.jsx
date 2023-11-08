import { useEffect } from "react";
import "./App.css";

import { useUser } from "./UserProvider";

import { Routes, Route, useNavigate } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import CreatePost from "./components/CreatePost/CreatePost";
import UpdatePost from "./components/UpdatePost/UpdatePost";
import Header from "./components/Header/Header";

function App() {
  const { user, setUser } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/validate-user",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.log("FAILED TO VALIDATE");
          navigate("/log-in");
          return;
        }
        const result = await response.json();
        console.log("SETTING USER");
        setUser(result.data.user);
      } catch (err) {
        navigate("/log-in");
      }
    };
    fetchUser();
  }, [setUser, navigate, user]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/posts/:id" element={<UpdatePost />} />
      </Routes>
    </div>
  );
}

export default App;
