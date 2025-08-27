import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("its.shishupal@gmail.com");
  const [password, setPassword] = useState("Desk@0402");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
   

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password,
      }, {
        withCredentials:true,
      });
      

      dispatch(addUser(res.data));
      return navigate("/");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong!");
    }
  };


  return (
    <div className="flex justify-center my-16">
      <div className="card w-96 bg-base-300 card-xl shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <div className="">
            <fieldset className="fieldset py-3">
              <legend className="fieldset-legend textarea-lg">
                Enter your email id -
              </legend>
              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="input"
                placeholder="Enter your email here"
              />
            </fieldset>

            <fieldset className="fieldset py-3 my-1.5">
              <legend className="fieldset-legend textarea-lg">
                Enter your password -
              </legend>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
              />
            </fieldset>
          </div>

          <div className="flex flex-col justify-center items-center card-actions">
            <p className="text-red-500 text-sm">{error}</p>
            <button className="btn btn-primary " onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
