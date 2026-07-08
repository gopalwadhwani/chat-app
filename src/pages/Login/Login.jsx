import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { signup, login } from "../../config/firebase"; // adjust path to your firebase config file

const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (currState === "Sign up") {
      await signup(username, email, password);
    } else {
      await login(email, password);
    }

    setLoading(false);
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Gmail"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : currState}
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