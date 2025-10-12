import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";

const UserCard = ({ user, removeCard, isTopCard, preview = false }) => {
  if (!user) {
    return null;
  }

  const { firstName, lastName, photoUrl, age, gender, about, _id } = user;
  const [showFullAbout, setShowFullAbout] = useState(false);

  const handleSendRequest = async (status, userId) => {
    // This function is only needed for the feed, not the preview
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

  const isLongAbout = about && about.length > 120;

  const cardContent = (
    <>
      <figure className="h-64 flex-shrink-0">
        <img
          src={photoUrl}
          alt="Profile"
          className="w-full h-full object-cover bg-gray-200 rounded-t-lg pointer-events-none"
        />
      </figure>
      <div className="card-body p-6 flex-grow flex flex-col h-52">
        <h2 className="card-title text-xl flex-shrink-0">
          {firstName + " " + lastName}
        </h2>
        {age && gender && (
          <p className="text-lg flex-shrink-0">{age + " " + gender}</p>
        )}

        <div className="flex-grow overflow-hidden flex flex-col min-h-0">
          <div
            className={`text-sm break-words ${
              showFullAbout ? "overflow-y-auto flex-grow" : "flex-shrink-0"
            }`}
          >
            <p className={!showFullAbout && isLongAbout ? "line-clamp-3" : ""}>
              {about}
            </p>
          </div>
          {isLongAbout && (
            <button
              onClick={() => setShowFullAbout(!showFullAbout)}
              className="text-primary text-sm hover:underline mt-1 flex-shrink-0"
            >
              {showFullAbout ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {!preview && (
          <div className="text-center text-xs text-gray-400 mt-4 flex-shrink-0">
            Swipe left to ignore, right to show interest
          </div>
        )}
      </div>
    </>
  );

  return preview ? (
    <div className="card-xl bg-base-300 w-72 shadow-md rounded-lg h-[480px] flex flex-col">
      {cardContent}
    </div>
  ) : (
    <motion.div
      drag={isTopCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={onDragEnd}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      initial={{ scale: 0.95, opacity: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="card-xl bg-base-300 w-72 shadow-md rounded-lg h-[480px] flex flex-col absolute cursor-grab"
      style={{ touchAction: isTopCard ? "none" : "auto" }}
    >
      {cardContent}
    </motion.div>
  );
};

export default UserCard;
