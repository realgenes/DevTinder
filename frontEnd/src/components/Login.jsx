import React, { useState } from "react";
import axios from "axios";
const Login = () => {
  const [emailId, setEmailId] = useState("its.shishupal@gmail.com");
  const [password, setPassword] = useState("Desk@0402");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:7777/login", {
        emailId,
        password,
      }, {
        withCredentials:true,
      });
    } catch (error) {
      console.error(error);
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
          <div className="justify-center card-actions">
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
