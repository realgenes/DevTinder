import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  // Default form is now 'Login'
  const [isLoginForm, setLoginForm] = useState(true);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      setError(error?.response?.data || "Login failed. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      const userData = res.data.data;
      if (userData) {
        dispatch(addUser(userData));
        navigate("/profile"); // Redirect to profile to complete setup
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      setError(error?.response?.data || "Signup failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    if (isLoginForm) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="flex justify-center my-12 px-4">
      <div className="card w-full max-w-md bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-mono justify-center mb-4">
            {isLoginForm ? "Login" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name fields - only for signup */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                !isLoginForm
                  ? "max-h-96 opacity-100 space-y-3"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div>
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Email and Password fields */}
            <div>
              <label className="label mb-1">
                <span className="label-text">Email ID</span>
              </label>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="input input-bordered w-full"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label mb-1">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="card-actions flex-col items-center pt-4">
              {error && <p className="text-error text-sm mb-2">{error}</p>}
              <button type="submit" className="btn btn-primary w-full max-w-xs">
                {isLoginForm ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => {
                setLoginForm((value) => !value);
                setError(""); // Clear errors on toggle
              }}
              className="link link-hover text-sm"
            >
              {isLoginForm
                ? "New User? Create an account"
                : "Already have an account? Login here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
