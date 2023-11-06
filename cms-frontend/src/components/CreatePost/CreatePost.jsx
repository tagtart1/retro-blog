import React from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import "./CreatePost.css";
import { useState } from "react";
import { useUser } from "../../UserProvider";
import { usePosts } from "../../PostProvider";
import ErrorPopUp from "../ErrorPopUp/ErrorPopUp";

const CreatePost = () => {
  const [isDraft, setIsDraft] = useState(false);
  const { posts, setPosts, drafts, setDrafts } = usePosts();
  const [error, setError] = useState();

  const { user } = useUser();
  const navigate = useNavigate();

  const url = "http://localhost:5000/api/v1/posts";

  const submitPost = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const text = form.text.value;

    const postOptions = {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        text: text,
        isDraft: isDraft,
      }),
    };

    try {
      const response = await fetch(url, postOptions);
      if (!response.ok) {
        const err = await response.json();
        setError(err);

        return;
      }
      const result = await response.json();

      setDrafts(null);
      setPosts(null);
      navigate("/");
    } catch (err) {}
  };

  if (!user) {
    return;
  }

  return (
    <main className="create-post-main">
      <header>
        <h1>Create Post</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/random">Random</Link>
        </div>
      </header>
      <form className="create-post-form" onSubmit={submitPost}>
        <div className="input-group">
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Why frogs are..."
            maxLength={50}
          />
        </div>
        <div className="input-group">
          <label htmlFor="text">Text: </label>
          <textarea
            type="text"
            id="text"
            name="text"
            placeholder="Today is cool..."
            maxLength={2000}
          />
        </div>
        <button type="submit">Post</button>
        <button type="submit" onClick={() => setIsDraft(true)}>
          Save to drafts
        </button>
      </form>

      <ErrorPopUp
        isVisible={error ? true : false}
        message={error ? error.messages[0] : null}
        onClose={() => setError(null)}
      />
    </main>
  );
};

export default CreatePost;
