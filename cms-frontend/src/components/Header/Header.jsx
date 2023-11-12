import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateIcon from "../../images/Create-Icon-01.svg";
import { usePosts } from "../../PostProvider";
import { useUser } from "../../UserProvider";
import "./Header.scss";
import ActionIcon from "../ActionIcon/ActionIcon";
import LogoutIcon from "../../images/Logout-Icon-03.svg";
import HomeIcon from "../../images/Home-Icons-05.svg";
const Header = () => {
  const { posts, setPosts, drafts, setDrafts } = usePosts();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const goToCreatePost = () => {
    navigate("/dashboard/create");
  };

  const goToHome = () => {
    navigate("/dashboard/");
  };

  const logOut = async () => {
    const response = await fetch("http://localhost:5000/api/v1/log-out", {
      credentials: "include",
      method: "POST",
    });

    if (response.ok) {
      setUser(null);
      setDrafts(null);
      setPosts(null);
      navigate("/log-in");
    }
  };
  if (!user) return null;
  return (
    <header className="action-header">
      <ActionIcon icon={HomeIcon} onClick={goToHome} name={"home"} />
      <ActionIcon icon={CreateIcon} onClick={goToCreatePost} name={"create"} />
      <ActionIcon icon={LogoutIcon} onClick={logOut} name={"log out"} />
    </header>
  );
};

export default Header;
