import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import he from "he";
import "./UpdatePost.css";
import { usePosts } from "../../PostProvider";

const UpdatePost = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { posts, setPosts, drafts, setDrafts } = usePosts();

  const [currentPost, setCurrentPost] = useState(null);
  const [shouldDraft, setShouldDraft] = useState();
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const url = `http://localhost:5000/api/v1/posts/${params.id}`;

    const fetchPost = async () => {
      const res = await fetch(url);

      if (!res.ok) {
        const errs = await res.json();

        setErrors(errs);
        return;
      }
      const result = await res.json();

      setCurrentPost(result.data.post);
      setShouldDraft(result.data.post.is_draft);
    };

    fetchPost();
  }, []);

  const cancelEdit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const updatePost = async (e) => {
    e.preventDefault();
    const endpoint = `http://localhost:5000/api/v1/posts/${params.id}`;
    const options = {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: params.id,
        title: e.target.title.value,
        text: e.target.text.value,
        isDraft: shouldDraft,
      }),
    };

    try {
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        const result = await response.json();
        setErrors(result);
        return;
      }

      setDrafts(null);
      setPosts(null);
      navigate("/");
    } catch {
      setErrors("Could not update post");
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    const endpoint = `http://localhost:5000/api/v1/posts/${params.id}`;
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
      navigate("/");
    } catch (err) {
      setErrors("Could not delete post");
    }
  };
  if (errors && errors.code === "NOT_FOUND") {
    return <div>POST NOT FOUND</div>;
  }

  if (!currentPost) return;

  return (
    <main className="update-post-main" onSubmit={updatePost}>
      <form className="update-post-form">
        <div className="label-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={currentPost.title}
          />
        </div>
        <div className="label-group">
          <label htmlFor="text">Text:</label>
          <textarea
            name="text"
            id="text"
            cols="30"
            rows="10"
            defaultValue={he.decode(currentPost.text)}
          ></textarea>
        </div>
        <button onClick={cancelEdit} type="button">
          Cancel
        </button>
        <button type="submit">Save</button>
        <button type="button" onClick={deletePost}>
          Delete
        </button>
        {currentPost.is_draft ? (
          <button type="submit" onClick={() => setShouldDraft(false)}>
            Post
          </button>
        ) : (
          <button type="submit" onClick={() => setShouldDraft(true)}>
            Send to drafts
          </button>
        )}
      </form>
      {errors ? <div>{errors.message}</div> : null}
    </main>
  );
};

export default UpdatePost;
