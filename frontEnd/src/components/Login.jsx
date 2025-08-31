import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setLoginForm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res.data));
      return navigate("/");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong!");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        {
          withCredentials: true,
        }
      );

     
      // Extract user data from the nested response
      const userData = res.data.data;

      if (userData) {
        dispatch(addUser(userData));
        return navigate("/profile");
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      setError(error?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center my-12">
      <div className="card w-96 bg-base-300 card-xl shadow-sm transition-all duration-700 ease-in-out">
        <div className="card-body">
          <h2 className="card-title text-2xl transition-all duration-300">
            {isLoginForm ? "Login" : "Signup"}
          </h2>
          <div className="space-y-2">
            {/* Name fields with smooth transition */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                !isLoginForm ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <fieldset className="fieldset py-1 mb-1">
                <legend className="fieldset-legend textarea-lg">
                  First Name-
                </legend>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input py-6 w-full"
                  placeholder="Enter your firstName here"
                />
              </fieldset>

              <fieldset className="fieldset py-1 mb-1">
                <legend className="fieldset-legend textarea-lg">
                  Last Name -
                </legend>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input py-6 w-full"
                  placeholder="Enter your last name here"
                />
              </fieldset>
            </div>

            <fieldset className="fieldset py-1 mb-1">
              <legend className="fieldset-legend textarea-lg">
                Email ID -
              </legend>
              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="input py-6 w-full"
                placeholder="Enter your email here"
              />
            </fieldset>

            <fieldset className="fieldset py-1 mb-1">
              <legend className="fieldset-legend textarea-lg">
                Password -
              </legend>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input py-6 w-full"
                placeholder="Enter your password"
              />
            </fieldset>
          </div>

          <div className="flex flex-col justify-center items-center card-actions">
            <p className="text-red-500 text-sm transition-all duration-300">
              {error}
            </p>
            <button
              className="btn btn-primary text-lg transition-all duration-200 hover:scale-105"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign up"}
            </button>
            <p
              onClick={() => setLoginForm((value) => !value)}
              className="cursor-pointer mt-2 -mb-3 transition-all duration-200 hover:text-primary hover:scale-105"
            >
              {isLoginForm
                ? "New User? Sign up here "
                : "Existing User? Login Here"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
