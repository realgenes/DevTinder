import axios from "axios";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pendingRequestCount = Array.isArray(requests) ? requests.length : 0;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="navbar-start">
        <Link
          to={"/"}
          className="btn btn-ghost text-2xl font-mono text-primary hover:bg-transparent"
        >
          {"</> DevTinder"}
        </Link>
      </div>

      {/* Main Navigation Links */}
      {user && (
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 text-base">
            <li>
              <NavLink to="/connections">Connections</NavLink>
            </li>
            <li>
              <NavLink to="/requests/received">
                Requests
                {pendingRequestCount > 0 && (
                  <div className="badge badge-secondary ml-2">
                    {pendingRequestCount}
                  </div>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      {/* User Menu */}
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end flex items-center">
            <p className="mr-4 hidden sm:block">Welcome, {user?.firstName}</p>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img alt="user photo" src={user.photoUrl} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-4 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/profile"} className="justify-between">
                  Profile
                </Link>
              </li>
              <li className="lg:hidden">
                <Link to={"/connections"}>Connections</Link>
              </li>
              <li className="lg:hidden">
                <Link to={"/requests/received"}>Requests</Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
