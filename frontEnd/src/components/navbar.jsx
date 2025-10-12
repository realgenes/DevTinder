import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for theme management, reading from localStorage
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "devtinder"
  );

  // Effect to apply theme to the document and save preference
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === "devtinder" ? "devtinderlight" : "devtinder");
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

      {/* Right side actions */}
      <div className="navbar-end">
        {/* Theme Toggle Button */}
        <label className="swap swap-rotate mr-4">
          <input
            type="checkbox"
            onChange={handleThemeToggle}
            checked={theme === "devtinderlight"}
          />
          {/* Sun icon */}
          <svg
            className="swap-on h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-1.41-1.41L12,7.05,19.77,14.83l-1.41,1.41L12,9.88ZM12,3a1,1,0,0,0-1,1V5a1,1,0,0,0,2,0V4A1,1,0,0,0,12,3ZM5.64,7.05,4.23,5.64A1,1,0,0,0,2.81,7.05L4.23,8.46a1,1,0,0,0,1.41-1.41ZM20,12h2a1,1,0,0,0,0-2H20a1,1,0,0,0,0,2ZM18.36,8.46l1.41-1.41A1,1,0,0,0,18.36,5.64L16.95,7.05a1,1,0,0,0,1.41,1.41ZM12,19a1,1,0,0,0,1-1V17a1,1,0,0,0-2,0v1A1,1,0,0,0,12,19ZM2,12H4a1,1,0,0,0,0-2H2a1,1,0,0,0,0,2Z" />
          </svg>
          {/* Moon icon */}
          <svg
            className="swap-off h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22a10.14,10.14,0,0,0,9.57,9.57A8.14,8.14,0,0,1,12.14,19.69Z" />
          </svg>
        </label>

        {/* User Menu */}
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
