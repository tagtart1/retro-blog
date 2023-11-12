import { useEffect } from "react";
import "./App.scss";

import { useUser } from "./UserProvider";

import { Routes, Route, useNavigate } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import CreatePost from "./components/CreatePost/CreatePost";
import UpdatePost from "./components/UpdatePost/UpdatePost";
import Header from "./components/Header/Header";
import DraftDashboard from "./components/DraftDashboard/DraftDashboard";
import { useError } from "./ErrorProvider";
import ErrorPopUp from "./components/ErrorPopUp/ErrorPopUp";
import NotFound from "./components/NotFound/NotFound";

function App() {
  const { user, setUser } = useUser();
  const { error, setError } = useError();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://api.retropublishingblog.com/api/v1/validate-user",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          navigate("/log-in");
          return;
        }
        const result = await response.json();

        setUser(result.data.user);
      } catch (err) {
        navigate("/log-in");
      }
    };
    fetchUser();
  }, [setUser, navigate, user]);
  if (!user) return null;
  return (
    <div className="app-wrapper">
      <h1>Welcome, {user.username}</h1>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drafts" element={<DraftDashboard />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/posts/:id" element={<UpdatePost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {error ? (
        <ErrorPopUp
          message={error}
          onClose={() => setError(null)}
          isVisible={error !== null}
        />
      ) : null}
    </div>
  );
}

export default App;
