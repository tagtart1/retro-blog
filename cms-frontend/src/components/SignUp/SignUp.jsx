import React from "react";
import { useUser } from "../../UserProvider";

import useAuthForm from "../../useAuthForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ErrorPopUp from "../ErrorPopUp/ErrorPopUp";

const SignUp = () => {
  const { user, setUser } = useUser();

  const { handleSubmit, errors, setErrors } = useAuthForm(
    "https://api.retropublishingblog.com/api/v1/sign-up",
    setUser
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="auth-wrapper">
      <section className="auth-form-section">
        <div className="call-to-action-box">
          Go <Link to="/">back</Link> to blogs
        </div>
        <div className="auth-form-panel">
          <div className="form-header-bar">
            <h1 className="form-title">Sign Up</h1>
            <div className="tab-action-group">
              <span>_</span>
              <span>O</span>
              <span className="close-x">X</span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group username-group">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" />
            </div>
            <div className="auth-form-group password-group">
              <label htmlFor="password">Password:</label>
              <input type="text" id="password" name="password" />
            </div>
            <div className="submit-group">
              <button type="submit ">Join</button>
            </div>
          </form>
        </div>
        <div className="call-to-action-box">
          Have an account? <Link to="/log-in">Log in now</Link>
        </div>

        <ErrorPopUp
          isVisible={errors !== null}
          message={errors ? errors : null}
          onClose={() => setErrors(null)}
        />
      </section>
    </div>
  );
};

export default SignUp;
