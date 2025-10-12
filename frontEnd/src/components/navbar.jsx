import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import axios from "axios";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Array of available themes
  const themes = ["light", "dark", "cupcake", "cyberpunk", "dracula"];
  const [themeIndex, setThemeIndex] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    return Math.max(0, themes.indexOf(savedTheme));
  });


  // Effect to apply theme to the document and save preference
  useEffect(() => {
    const currentTheme = themes[themeIndex];
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [themeIndex]);

  // Function to cycle to the next theme
  const handleThemeToggle = () => {
    setThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

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
      <div className="navbar-start">
        <Link
          to={"/"}
          className="btn btn-ghost text-2xl font-mono text-primary hover:bg-transparent"
        >
          {"</> DevTinder"}
        </Link>
      </div>

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

      <div className="navbar-end">
        {/* Theme Toggle Button */}
        <button
          className="btn btn-ghost btn-circle"
          onClick={handleThemeToggle}
        >
          {/* Your theme icons here, for simplicity we'll use a text icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </button>

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
              className="menu menu-md dropdown-content bg-base-200 rounded-box z-[1] mt-4 w-64 p-2 shadow"
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
