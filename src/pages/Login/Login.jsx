import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
const Login = () => {
  const [currState, setCurrState] = useState("Sign up");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currState === "Sign up") {
      console.log("Sign up");
    } else {
      console.log("Login");
    }
  };

  return (
    <div className="login-container">

      
<div className="logo-section">
  <img src={logo} alt="logo" className="logo" />
</div>

      {/* Form */}
      <div className="form-box">

        <form className="login-form" onSubmit={handleSubmit}>

          <h2>{currState}</h2>

          {currState === "Sign up" && (
            <input
              type="text"
              placeholder="Username"
              className="input"
              required
            />
          )}

          <input
            type="email"
            placeholder="Gmail"
            className="input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            required
          />

          <button type="submit">
            {currState}
          </button>

          {currState === "Sign up" && (
            <div className="checkbox-box">
              <input type="checkbox" id="terms" required />

              <label htmlFor="terms">
                Agree to Terms and Conditions
              </label>
            </div>
          )}

        </form>

        <div className="switch-text">

          {currState === "Sign up" ? (
            <p>
              Already have an account?
              <span
                className="switch"
                onClick={() => setCurrState("Login")}
              >
                {" "}Click here
              </span>
            </p>
          ) : (
            <p>
              Create an account?
              <span
                className="switch"
                onClick={() => setCurrState("Sign up")}
              >
                {" "}Click here
              </span>
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default Login;