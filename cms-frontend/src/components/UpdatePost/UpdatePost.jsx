import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import he from "he";
import "./UpdatePost.scss";
import { usePosts } from "../../PostProvider";
import ActionIcon from "../ActionIcon/ActionIcon";
import TrashIcon from "../../images/Trash-Icons-06.svg";
import SaveIcon from "../../images/Save-Icon-02.svg";
import DraftIcon from "../../images/Draft-Icons-04.svg";
import PostIcon from "../../images/Post-Icon.svg";
import ErrorPopUp from "../ErrorPopUp/ErrorPopUp";
import { useError } from "../../ErrorProvider";

const UpdatePost = () => {
  const params = useParams();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { posts, setPosts, drafts, setDrafts } = usePosts();

  const [currentPost, setCurrentPost] = useState(null);

  const { setError, error } = useError();

  useEffect(() => {
    const url = `https://api.retropublishingblog.com/api/v1/posts/${params.id}`;

    const fetchPost = async () => {
      try {
        const res = await fetch(url, { credentials: "include" });

        if (!res.ok) {
          const errs = await res.json();

          setError(errs.message);
          return;
        }
        const result = await res.json();

        setCurrentPost(result.data.post);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPost();
  }, []);

  const updatePost = async (form, shouldDraft) => {
    const endpoint = `https://api.retropublishingblog.com/api/v1/posts/${params.id}`;
    const options = {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: params.id,
        title: form.title.value,
        text: form.text.value,
        isDraft: shouldDraft,
      }),
    };

    try {
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const result = await response.json();

        setError(result.message);
        return;
      }

      setDrafts(null);
      setPosts(null);
      navigate("/dashboard");
    } catch {
      setError("Could not update post");
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    const endpoint = `https://api.retropublishingblog.com/api/v1/posts/${params.id}`;
    const options = {
      credentials: "include",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id }),
    };
    try {
      await fetch(endpoint, options);

      setDrafts(null);
      setPosts(null);
      navigate("/dashboard");
    } catch (err) {
      setError("Could not delete post");
    }
  };

  return (
    <>
      <div className="update-post-parent">
        <main className="update-post-main">
          <div className="tab-top">
            <h2>Update Post</h2>
            <div className="action-group">
              <span>_</span>
              <span>O</span>
              <span>X</span>
            </div>
          </div>
          <form className="update-post-form" ref={formRef}>
            <div className="label-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                id="title"
                defaultValue={currentPost ? currentPost.title : null}
              />
            </div>
            <div className="label-group">
              <label htmlFor="text">Text:</label>
              <textarea
                name="text"
                id="text"
                cols="30"
                rows="10"
                defaultValue={currentPost ? he.decode(currentPost.text) : null}
              ></textarea>
            </div>
          </form>
        </main>
      </div>
      <section className="actions">
        {currentPost ? (
          !currentPost.is_draft ? (
            <ActionIcon
              icon={DraftIcon}
              name={"save draft"}
              onClick={() => updatePost(formRef.current, true)}
            />
          ) : (
            <ActionIcon
              icon={PostIcon}
              name={"post"}
              onClick={() => updatePost(formRef.current, false)}
            />
          )
        ) : null}

        <ActionIcon
          icon={SaveIcon}
          name={"save"}
          onClick={() => updatePost(formRef.current, currentPost.is_draft)}
        />
        <ActionIcon icon={TrashIcon} name={"delete"} onClick={deletePost} />
      </section>
    </>
  );
};

export default UpdatePost;
