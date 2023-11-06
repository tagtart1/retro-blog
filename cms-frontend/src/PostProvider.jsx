import React from "react";

import { createContext, useState, useContext } from "react";

const PostContext = createContext(null);

const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState(null);
  const [drafts, setDrafts] = useState(null);

  return (
    <PostContext.Provider value={{ posts, setPosts, drafts, setDrafts }}>
      {children}
    </PostContext.Provider>
  );
};

const usePosts = () => {
  const context = useContext(PostContext);
  return context;
};

export { PostProvider, usePosts };
