import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeUserFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    if (feed.length === 0) {
      getFeed();
    }
  }, []);

  const removeCard = (userId) => {
    dispatch(removeUserFeed(userId));
  };

  return (
    <div className="space-y-6 pb-4">
      <section className="premium-card overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-base-content/75">
              Discover
            </p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
              Find your next dev connection
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-base-content/80 sm:text-base">
              Swipe through profiles, keep what feels right, and start a chat
              when someone accepts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-[320px]">
            <div className="soft-surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-base-content/70">
                Signed in
              </p>
              <p className="mt-2 truncate text-2xl font-semibold">
                {user?.firstName || "Developer"}
              </p>
            </div>
            <div className="soft-surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-base-content/70">
                Profiles left
              </p>
              <p className="mt-2 text-2xl font-semibold">{feed.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-card p-4 sm:p-5">
        <div className="flex items-center justify-between px-1 pb-4">
          <p className="text-xs uppercase tracking-[0.24em] text-base-content/70">
            Swipe deck
          </p>
          <p className="text-xs text-base-content/70">
            Left = pass, Right = interested
          </p>
        </div>

        <div className="relative mx-auto h-[560px] w-[320px] sm:w-[360px]">
          {feed.length > 0 ? (
            feed
              .map((userProfile, index) => (
                <UserCard
                  key={userProfile._id}
                  user={userProfile}
                  removeCard={removeCard}
                  isTopCard={index === 0}
                />
              ))
              .reverse()
          ) : (
            <div className="premium-card flex h-[560px] w-full flex-col items-center justify-center px-8 text-center">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary/25 to-secondary/25 text-2xl">
                ✓
              </div>
              <h3 className="text-2xl font-semibold">You’re caught up</h3>
              <p className="mt-3 text-sm leading-7 text-base-content/80">
                No more profiles right now. New developers will appear here
                automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="premium-card p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-base-content/70">
            How it works
          </p>
          <div className="mt-4 space-y-3">
            <div className="soft-surface rounded-2xl p-4">
              <p className="text-sm font-semibold">Swipe right to connect</p>
              <p className="mt-1 text-sm text-base-content/80">
                Interested requests are sent instantly.
              </p>
            </div>
            <div className="soft-surface rounded-2xl p-4">
              <p className="text-sm font-semibold">Swipe left to skip</p>
              <p className="mt-1 text-sm text-base-content/80">
                Keep your queue focused and uncluttered.
              </p>
            </div>
            <div className="soft-surface rounded-2xl p-4">
              <p className="text-sm font-semibold">Chat after acceptance</p>
              <p className="mt-1 text-sm text-base-content/80">
                Accepted connections unlock real-time messaging.
              </p>
            </div>
          </div>
        </div>

        <div className="premium-card p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-base-content/70">
            Better profile tips
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-base-content/85">
            <li>Use a clear photo with good lighting.</li>
            <li>Write a short intro about what you build.</li>
            <li>Mention your primary stack and interests.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Feed;
