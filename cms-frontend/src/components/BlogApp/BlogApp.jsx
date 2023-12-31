import React, { useEffect, useState } from "react";
import he from "he";
import "./BlogApp.scss";
import moment from "moment";
import ActionIcon from "../ActionIcon/ActionIcon";
import CreateIcon from "../../images/Create-Icon-01.svg";
import { useNavigate } from "react-router-dom";
const BlogApp = () => {
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const gotoAdmin = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      setIsLoading(true);
      const response = await fetch(
        `https://api.retropublishingblog.com/api/v1/posts`
      );

      const results = await response.json();

      setPosts(results.data.posts);
      setIsLoading(false);
    };

    fetchAllPosts();
  }, []);
  if (isLoading || !posts) return <h1>loading</h1>;
  return (
    <main className="blog-app-parent">
      <div className="blog-app-middle">
        <div className="blog-app-feed">
          <div className="top-header">
            <h1>The Retro Blog</h1>
            <ActionIcon
              icon={CreateIcon}
              name={"write a blog"}
              onClick={gotoAdmin}
            />
          </div>
          {posts.map((post, index) => {
            const colorClass = ["pink", "yellow", "blue"][index % 3];
            return (
              <article key={post.id} className="blog-post-parent">
                <div className={`tap-top ${colorClass}`}>
                  <h2>{he.decode(post.title)}</h2>
                  <div className="action-group">
                    <span>_</span>
                    <span>O</span>
                    <span>X</span>
                  </div>
                </div>
                <div className="blog-content">
                  <p className="blog-text">{he.decode(post.text)}</p>
                  <div className="post-info">
                    <p>By: {post.username}</p>
                    <p>
                      {moment(post.created_timestamp).format("MMM Do, YYYY")}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <section className="right-side">
          <ActionIcon
            icon={CreateIcon}
            name={"write a blog"}
            onClick={gotoAdmin}
          />
        </section>
      </div>
    </main>
  );
};

export default BlogApp;
