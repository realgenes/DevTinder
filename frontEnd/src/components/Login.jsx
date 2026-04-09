import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [isLoginForm, setLoginForm] = useState(true);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [devResetToken, setDevResetToken] = useState("");

  useEffect(() => {
    const tokenFromQuery = searchParams.get("resetToken");
    if (tokenFromQuery) {
      setShowForgotPassword(true);
      setIsResetMode(true);
      setResetToken(tokenFromQuery);
      setResetMessage("Reset token detected. Enter your new password.");
      setResetError("");
    }
  }, [searchParams]);

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
        navigate("/profile");
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      setError(error?.response?.data || "Signup failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isLoginForm) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  const handleForgotPasswordRequest = async () => {
    try {
      setResetError("");
      setResetMessage("");
      setDevResetToken("");
      const res = await axios.post(`${BASE_URL}/password/forgot`, {
        emailId: resetEmail,
      });
      setResetMessage(res.data?.message || "Reset request sent.");
      if (res.data?.resetToken) {
        setDevResetToken(res.data.resetToken);
        setResetToken(res.data.resetToken);
      }
      setIsResetMode(true);
    } catch (err) {
      setResetError(
        err?.response?.data?.message || "Failed to request password reset."
      );
    }
  };

  const handlePasswordReset = async () => {
    try {
      setResetError("");
      setResetMessage("");
      await axios.post(`${BASE_URL}/password/reset/${resetToken}`, {
        newPassword,
      });
      setResetMessage("Password reset successful. Please login now.");
      setNewPassword("");
      setIsResetMode(false);
      setResetToken("");
    } catch (err) {
      setResetError(
        err?.response?.data?.message || "Failed to reset password."
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute right-[-4rem] top-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-1/3 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_minmax(460px,0.95fr)]">
        <section className="premium-card relative overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-primary/20 via-secondary/15 to-transparent" />
          <div className="relative">
            <span className="soft-surface inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-base-content/80">
              Premium developer dating
            </span>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.96] text-balance sm:text-6xl">
              Meet ambitious builders in a warmer, more human way.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-base-content/70">
              DevTinder brings together developers who care about craft,
              chemistry, and meaningful conversations.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="soft-surface rounded-[26px] p-5">
                <p className="font-display text-3xl font-semibold">12k+</p>
                <p className="mt-2 text-sm text-base-content/85">
                  profiles explored with polished onboarding
                </p>
              </div>
              <div className="soft-surface rounded-[26px] p-5">
                <p className="font-display text-3xl font-semibold">Live</p>
                <p className="mt-2 text-sm text-base-content/85">
                  messaging with elegant, focused chat flows
                </p>
              </div>
              <div className="soft-surface rounded-[26px] p-5">
                <p className="font-display text-3xl font-semibold">Curated</p>
                <p className="mt-2 text-sm text-base-content/85">
                  discovery built for developers, not generic swiping
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-card p-6 sm:p-8 lg:p-9">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-base-content/45">
                {isLoginForm ? "Welcome back" : "Create account"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                {isLoginForm ? "Sign in to continue" : "Start your profile"}
              </h2>
            </div>
            <div className="soft-surface rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-base-content/80">
              {isLoginForm ? "Login" : "Join"}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginForm && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-base-content/70">
                    First name
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input field-control h-14 rounded-2xl px-4"
                    placeholder="Aarav"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-base-content/70">
                    Last name
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input field-control h-14 rounded-2xl px-4"
                    placeholder="Mehta"
                  />
                </label>
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-base-content/70">
                Email
              </span>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="input field-control h-14 rounded-2xl px-4"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-base-content/70">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input field-control h-14 rounded-2xl px-4"
                placeholder={isLoginForm ? "Enter your password" : "Create a strong password"}
                required
              />
            </label>

            {isLoginForm && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword((value) => !value);
                    setResetError("");
                    setResetMessage("");
                    setDevResetToken("");
                  }}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {isLoginForm && showForgotPassword && (
              <div className="soft-surface space-y-3 rounded-2xl p-4">
                <p className="text-sm font-semibold">Reset your password</p>
                {!isResetMode && (
                  <>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="input field-control h-12 rounded-xl px-4"
                      placeholder="Enter your email"
                    />
                    <button
                      type="button"
                      onClick={handleForgotPasswordRequest}
                      className="btn h-11 min-h-11 w-full rounded-xl border-none bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      Send reset link
                    </button>
                  </>
                )}

                {isResetMode && (
                  <>
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="input field-control h-12 rounded-xl px-4"
                      placeholder="Reset token"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input field-control h-12 rounded-xl px-4"
                      placeholder="New strong password"
                    />
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="btn h-11 min-h-11 w-full rounded-xl border-none bg-gradient-to-r from-primary to-secondary text-white"
                    >
                      Reset password
                    </button>
                  </>
                )}

                {devResetToken && (
                  <p className="text-xs text-base-content/80">
                    Dev mode token: <span className="font-mono">{devResetToken}</span>
                  </p>
                )}

                {resetMessage && (
                  <p className="text-sm text-success">{resetMessage}</p>
                )}
                {resetError && <p className="text-sm text-error">{resetError}</p>}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn h-14 min-h-14 w-full rounded-2xl border-none bg-gradient-to-r from-primary via-primary to-secondary text-base font-semibold text-white shadow-lg shadow-primary/20"
            >
              {isLoginForm ? "Enter DevTinder" : "Create my account"}
            </button>
          </form>

          <div className="soft-surface mt-6 flex flex-col items-start justify-between gap-4 rounded-[24px] px-4 py-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold">
                {isLoginForm ? "New around here?" : "Already have an account?"}
              </p>
              <p className="text-sm text-base-content/60">
                {isLoginForm
                  ? "Create a polished developer profile in minutes."
                  : "Jump back into your matches and messages."}
              </p>
            </div>
            <button
              onClick={() => {
                setLoginForm((value) => !value);
                setError("");
                setShowForgotPassword(false);
                setIsResetMode(false);
                setResetEmail("");
                setResetToken("");
                setNewPassword("");
                setResetError("");
                setResetMessage("");
                setDevResetToken("");
              }}
              className="btn btn-ghost soft-surface min-h-11 rounded-full px-5 text-base-content"
            >
              {isLoginForm ? "Sign up" : "Login"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
