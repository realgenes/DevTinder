import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import axios from "axios";

const themes = ["devtinderlux", "devtindernight"];

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "devtinderlux"
  );

  useEffect(() => {
    const currentTheme = themes.includes(theme) ? theme : "devtinderlux";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [theme]);

  const pendingRequestCount = Array.isArray(requests) ? requests.length : 0;
  const userPhoto =
    user?.photoUrl ||
    "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";

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

  const navClassName = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? "soft-surface text-base-content shadow-lg shadow-black/5"
        : "text-base-content/90 hover:bg-white/55 hover:text-base-content"
    }`;

  return (
    <header className="sticky top-3 z-50 pt-3">
      <div className="glass-panel rounded-[28px] px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-sm font-bold text-white shadow-lg shadow-primary/20">
                &lt;/&gt;
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold text-base-content">
                  DevTinder
                </p>
                <p className="hidden text-xs text-base-content/55 sm:block">
                  Meet developers with taste
                </p>
              </div>
            </Link>
          </div>

          {user && (
            <nav className="hidden items-center gap-2 lg:flex">
              <NavLink to="/" className={navClassName}>
                Discover
              </NavLink>
              <NavLink to="/connections" className={navClassName}>
                Connections
              </NavLink>
              <NavLink to="/requests/received" className={navClassName}>
                Requests
                {pendingRequestCount > 0 && (
                  <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-xs text-white">
                    {pendingRequestCount}
                  </span>
                )}
              </NavLink>
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="btn btn-ghost soft-surface h-11 min-h-11 rounded-full px-4 text-sm font-semibold text-base-content hover:bg-white/70"
              onClick={() =>
                setTheme((value) =>
                  value === "devtinderlux" ? "devtindernight" : "devtinderlux"
                )
              }
            >
              {theme === "devtinderlux" ? "Night" : "Day"}
            </button>

            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex cursor-pointer items-center gap-3 rounded-full border border-white/45 bg-white/45 p-1 pr-3 shadow-sm transition hover:bg-white/70"
                >
                  <div className="avatar shrink-0">
                    <div className="w-11 rounded-full ring-2 ring-white/80">
                      <img alt="user photo" src={userPhoto} />
                    </div>
                  </div>
                  <div className="hidden min-w-0 text-left sm:block">
                    <p className="truncate text-sm font-semibold leading-tight">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-base-content/60">Your account</p>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu dropdown-content mt-3 w-64 rounded-[24px] border border-white/50 bg-base-100/90 p-3 shadow-[0_24px_80px_rgba(44,26,31,0.18)] backdrop-blur-xl"
                >
                  <li>
                    <Link to="/profile">Edit profile</Link>
                  </li>
                  <li className="lg:hidden">
                    <Link to="/">Discover</Link>
                  </li>
                  <li className="lg:hidden">
                    <Link to="/connections">Connections</Link>
                  </li>
                  <li className="lg:hidden">
                    <Link to="/requests/received">
                      Requests
                      {pendingRequestCount > 0 && (
                        <span className="badge badge-secondary">
                          {pendingRequestCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn h-11 min-h-11 rounded-full border-none bg-gradient-to-r from-primary to-secondary px-5 text-white shadow-lg shadow-primary/20"
              >
                Enter App
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
