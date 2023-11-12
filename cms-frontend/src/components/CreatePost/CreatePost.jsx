import React from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import "./CreatePost.scss";
import { useState, useRef } from "react";
import { useUser } from "../../UserProvider";
import { usePosts } from "../../PostProvider";
import ErrorPopUp from "../ErrorPopUp/ErrorPopUp";
import ActionIcon from "../ActionIcon/ActionIcon";
import DraftIcon from "../../images/Draft-Icons-04.svg";
import PostIcon from "../../images/Post-Icon.svg";
import { useError } from "../../ErrorProvider";

const CreatePost = () => {
  const { posts, setPosts, drafts, setDrafts } = usePosts();

  const formRef = useRef(null);
  const { user } = useUser();
  const { setError } = useError();
  const navigate = useNavigate();

  const url = "http://localhost:5000/api/v1/posts";

  const submitPost = async (form, shouldDraft) => {
    const title = form.title.value;
    const text = form.text.value;

    const postOptions = {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        text: text,
        isDraft: shouldDraft,
      }),
    };

    try {
      const response = await fetch(url, postOptions);
      if (!response.ok) {
        const err = await response.json();
        setError(err.message);

        return;
      }
      const result = await response.json();

      setDrafts(null);
      setPosts(null);
      if (shouldDraft) {
        navigate("/dashboard/drafts");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {}
  };

  if (!user) {
    return;
  }

  return (
    <>
      <div className="create-post-parent">
        <main className="create-post-main">
          <div className="tab-top">
            <h2>Create Post</h2>
            <div className="action-group">
              <span>_</span>
              <span>O</span>
              <span>X</span>
            </div>
          </div>
          <form className="create-post-form" ref={formRef}>
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
          </form>
        </main>
      </div>
      <section className="actions">
        <ActionIcon
          icon={DraftIcon}
          name={"save draft"}
          onClick={() => submitPost(formRef.current, true)}
        />
        <ActionIcon
          icon={PostIcon}
          name={"post"}
          onClick={() => submitPost(formRef.current, false)}
        />
      </section>
    </>
  );
};

export default CreatePost;
