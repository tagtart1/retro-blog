import React from "react";
import "./DraftDashboard.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import { useUser } from "../../UserProvider";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../PostProvider";
import ActionIcon from "../ActionIcon/ActionIcon";
import DraftIcon from "../../images/Draft-Icons-04.svg";

const DraftDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { drafts, setDrafts } = usePosts();
  const [isLoading, setIsLoading] = useState(false);

  const openPost = (postId) => {
    navigate(`/dashboard/posts/${postId}`);
  };
  useEffect(() => {
    if (!user) return; // No user, don't do anything!

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

    if (!drafts) {
      fetchDrafts();
    }
  }, [user]);

  if (!user) return;
  return (
    <>
      <div className="draft-dashboard-parent">
        <main>
          <div className="tab-top">
            <h2>Your Drafts</h2>
            <div className="action-group">
              <span>_</span>
              <span>O</span>
              <span>X</span>
            </div>
          </div>

          <section className="drafts-feed">
            <div className="label-section">
              <p>Title</p>
              <p>Date Started</p>
            </div>
            {isLoading ? (
              <p>LOADING</p>
            ) : drafts && drafts.length > 0 ? (
              drafts.map((draft, index) => {
                const colorClass = ["pink", "yellow", "blue"][index % 3];
                return (
                  <article
                    key={draft.id}
                    className={`draft-parent ${colorClass}`}
                    onClick={() => openPost(draft.id)}
                  >
                    <div className="label-box">
                      <h2>{draft.title}</h2>
                    </div>
                    <div className="label-box">
                      <div className="post-date">
                        {moment(draft.created_timestamp).format("MMM Do, YYYY")}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <article className={`no-drafts-bar pink`}>
                <div className="label-box">You have 0 drafts</div>
              </article>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default DraftDashboard;
