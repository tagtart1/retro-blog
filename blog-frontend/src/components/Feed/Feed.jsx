import React from "react";
import { useState, useEffect } from "react";
import "./Feed.scss";
import CommentBox from "./commentBox/commentBox";
import moment from "moment";
import he from "he";

const Feed = () => {
  const [posts, setPosts] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        const result = await response.json();
        setPosts(result.data.posts);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchPosts();
  }, []);

  if (!posts) return "Loading...";

  return (
    <main>
      {posts.map((post) => {
        return (
          <section key={post._id}>
            <div className="header">
              <div className="name-title">
                <h1>{post.title}</h1>
                <p>By: {post.author.username}</p>
              </div>
              <div className="date">
                {moment(post.createdTimestamp).format("MMM Do, YYYY")}
                {post.lastUpdatedTimestamp ? (
                  <p className="last-updated-date">
                    Last updated:{" "}
                    {moment(post.lastUpdatedTimestamp).format("MMM Do, YYYY")}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="text">{he.decode(post.text)}</p>
          </section>
        );
      })}
    </main>
  );
};

export default Feed;
