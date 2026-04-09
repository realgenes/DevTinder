import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";

const fallbackPhoto =
  "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";

const UserCard = ({ user, removeCard, isTopCard, preview = false }) => {
  if (!user) {
    return null;
  }

  const { firstName, lastName, photoUrl, age, gender, about, _id } = user;
  const [showFullAbout, setShowFullAbout] = useState(false);

  const handleSendRequest = async (status, userId) => {
    if (preview) return;
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to send request:", error);
    }
  };

  const onDragEnd = (event, info) => {
    if (preview) return;
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      handleSendRequest("interested", _id);
      removeCard(_id);
    } else if (info.offset.x < -swipeThreshold) {
      handleSendRequest("ignored", _id);
      removeCard(_id);
    }
  };

  const isLongAbout = about && about.length > 130;

  const cardContent = (
    <>
      <figure className="relative h-[300px] flex-shrink-0 overflow-hidden rounded-t-[30px]">
        <img
          src={photoUrl || fallbackPhoto}
          alt="Profile"
          className="h-full w-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.26em] text-white/80">
            Featured profile
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            {firstName} {lastName}
          </h2>
          {(age || gender) && (
            <p className="mt-1 text-sm text-white/85">
              {[age ? `${age}` : null, gender].filter(Boolean).join(" • ")}
            </p>
          )}
        </div>
      </figure>

      <div className="flex min-h-[260px] flex-grow flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Open to connect
          </span>
          {!preview && (
            <span className="text-xs uppercase tracking-[0.18em] text-base-content/70">
              Drag
            </span>
          )}
        </div>

        <div className="flex-grow overflow-hidden">
          <p
            className={`text-sm leading-7 text-base-content/90 ${
              !showFullAbout ? "line-clamp-5" : ""
            }`}
          >
            {about || "A thoughtful builder with room for a great introduction."}
          </p>
          {isLongAbout && (
            <button
              onClick={() => setShowFullAbout(!showFullAbout)}
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              {showFullAbout ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {!preview && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="soft-surface rounded-[22px] p-4 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-base-content/80">
                Ignore
              </p>
              <p className="mt-2 text-sm font-semibold text-base-content/90">
                Swipe left
              </p>
            </div>
            <div className="rounded-[22px] bg-gradient-to-r from-primary to-secondary p-4 text-center text-white shadow-lg shadow-primary/15">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                Interested
              </p>
              <p className="mt-2 text-sm font-semibold">Swipe right</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (preview) {
    return (
      <div className="premium-card h-[560px] w-full overflow-hidden">
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={onDragEnd}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      initial={{ scale: 0.96, opacity: 0.82 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className="premium-card absolute left-0 top-0 flex h-[560px] w-full cursor-grab flex-col overflow-hidden"
      style={{ touchAction: isTopCard ? "none" : "auto" }}
    >
      {cardContent}
    </motion.div>
  );
};

export default UserCard;
