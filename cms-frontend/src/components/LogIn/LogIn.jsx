import React, { useEffect, useState } from "react"; // done
import "../AuthForm.scss"; // done
import { useUser } from "../../UserProvider"; // done
import { useNavigate, Link } from "react-router-dom"; // done
import useAuthForm from "../../useAuthForm"; // done
import ErrorPopUp from "../ErrorPopUp/ErrorPopUp";

const LogIn = () => {
  const { user, setUser } = useUser();

  const { handleSubmit, errors, setErrors } = useAuthForm(
    "http://localhost:5000/api/v1/log-in",
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
            <h1 className="form-title">Log In</h1>
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
              <button type="submit ">Enter</button>
            </div>
          </form>
        </div>
        <div className="call-to-action-box">
          No acccount? <Link to="/sign-up">Sign up now</Link>
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

export default LogIn;
