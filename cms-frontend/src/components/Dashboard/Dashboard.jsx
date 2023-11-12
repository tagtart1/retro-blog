import React, { useEffect, useState } from "react";

import { useUser } from "../../UserProvider";
import "./Dashboard.scss";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import CreateIcon from "../../images/Create-Icon-01.svg";
import { usePosts } from "../../PostProvider";
import ActionIcon from "../ActionIcon/ActionIcon";
import DraftIcon from "../../images/Draft-Icons-04.svg";
import FileIcon from "../../images/File-Icon-08.svg";
import EarthIcon from "../../images/Earth.svg";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { posts, setPosts, drafts, setDrafts } = usePosts();

  const [isLoading, setIsLoading] = useState(false);

  const openPost = (postId) => {
    navigate(`/dashboard/posts/${postId}`);
  };

  const goToDraft = () => {
    navigate("/dashboard/drafts");
  };

  const openBlog = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!user) return; // No user, don't do anything!

    const fetchPosts = async () => {
      setIsLoading(true);
      const response = await fetch(
        `https://api.retropublishingblog.com/api/v1/posts?user_id=${user.id}`
      );

      const results = await response.json();

      setPosts(results.data.posts);
      setIsLoading(false);
    };

    const fetchDrafts = async () => {
      setIsLoading(true);
      const response = await fetch(
        `https://api.retropublishingblog.com/api/v1/posts/drafts`,
        {
          credentials: "include",
        }
      );

      const results = await response.json();
      setDrafts(results.data.posts);
      setIsLoading(false);
    };

    if (!posts) {
      fetchPosts();
    }
    if (!drafts) {
      fetchDrafts();
    }
  }, [user]);

  if (!user) {
    return;
  }

  return (
    <>
      <div className="dashboard-parent">
        <main>
          <div className="tab-top">
            <h2>Your Posts</h2>
            <div className="action-group">
              <span>_</span>
              <span>O</span>
              <span>X</span>
            </div>
          </div>

          <section className="posts-feed">
            <div className="label-section">
              <div>Title</div>
              <div>Date Posted</div>
            </div>
            {isLoading ? (
              <p>LOADING</p>
            ) : posts && posts.length > 0 ? (
              posts.map((post, index) => {
                const colorClass = ["pink", "yellow", "blue"][index % 3];
                return (
                  <article
                    key={post.id}
                    className={`post-parent ${colorClass}`}
                    onClick={() => openPost(post.id)}
                  >
                    <div className="label-box">
                      <h2>{post.title}</h2>
                    </div>
                    <div className="label-box">
                      <div className="post-date">
                        {moment(post.created_timestamp).format("MMM Do, YYYY")}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <h1>You have 0 posts</h1>
            )}
          </section>
        </main>
      </div>
      <section className="actions">
        <ActionIcon icon={DraftIcon} name={"drafts"} onClick={goToDraft} />
        <ActionIcon icon={FileIcon} name={"blogs.exe"} onClick={openBlog} />
      </section>
    </>
  );
};

export default Dashboard;
