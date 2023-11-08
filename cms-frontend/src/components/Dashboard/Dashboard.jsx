import React, { useEffect, useState } from "react";

import { useUser } from "../../UserProvider";
import "./Dashboard.css";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import CreateIcon from "../../images/Create-Icon-01.svg";
import { usePosts } from "../../PostProvider";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { posts, setPosts, drafts, setDrafts } = usePosts();

  const [isLoading, setIsLoading] = useState(false);

  const openPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  useEffect(() => {
    if (!user) return; // No user, don't do anything!

    const fetchPosts = async () => {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/posts?user_id=${user.id}`
      );

      const results = await response.json();

      setPosts(results.data.posts);
      setIsLoading(false);
    };

    const fetchDrafts = async () => {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/v1/posts/drafts`,
        {
          credentials: "include",
        }
      );

      const results = await response.json();
      setDrafts(results.data.posts);
      setIsLoading(false);
    };
    console.log("IN DASHBOARD USE EFFECT");

    if (!posts) {
      fetchPosts();
      console.log("FETCHING POSTS");
    }
    if (!drafts) {
      fetchDrafts();
      console.log("FETCHING DRAFTS");
    }
  }, [user]);

  if (!user) {
    return;
  }

  return (
    <main className="dashboard-main">
      <div className="user-post-sections">
        <section className="posts-feed">
          <h2>Posted</h2>
          {isLoading ? (
            <p>LOADING</p>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => {
              return (
                <article
                  key={post.id}
                  className="post-parent"
                  onClick={() => openPost(post.id)}
                >
                  <h2>{post.title}</h2>
                  <div className="post-date">
                    Posted on{" "}
                    {moment(post.createdTimestamp).format("MMM Do, YYYY")}
                    {post.lastUpdatedTimestamp ? (
                      <span>
                        Last updated:{" "}
                        {moment(post.lastUpdatedTimestamp).format(
                          "MMM Do, YYYY"
                        )}
                      </span>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <h1>You have 0 posts</h1>
          )}
        </section>
        <section className="posts-feed">
          <h2>Drafts</h2>
          {isLoading ? (
            <p>LOADING</p>
          ) : drafts && drafts.length > 0 ? (
            drafts.map((post) => {
              return (
                <article
                  key={post.id}
                  className="post-parent"
                  onClick={() => openPost(post.id)}
                >
                  <h2>{post.title}</h2>
                  <p className="post-date">
                    Started on{" "}
                    {moment(post.createdTimestamp).format("MMM Do, YYYY")}
                  </p>
                </article>
              );
            })
          ) : (
            <h1>You have 0 drafts</h1>
          )}
        </section>
      </div>
      <a
        href="http://localhost:3000/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Goto blog
      </a>
    </main>
  );
};

export default Dashboard;
