import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed, removeUserFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    // Avoid refetching if feed is already populated
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
    // Only fetch feed if it's null (the initial state)
    if (feed === null) {
      getFeed();
    }
  }, [feed]);

  const removeCard = (userId) => {
    dispatch(removeUserFeed(userId));
  };

  return (
    <div className="flex justify-center items-center mt-10 relative h-[500px] w-full">
      <div className="relative w-72 h-[480px]">
        {feed && feed.length > 0 ? (
          feed
            .map((user, index) => (
              <UserCard
                key={user._id}
                user={user}
                removeCard={removeCard}
                isTopCard={index === 0} // The first item in the array is the top card
              />
            ))
            .reverse() // Reverse for a nice stacking effect in the UI
        ) : (
          <div className="card-xl bg-base-300 w-72 shadow-md rounded-lg h-[480px] flex items-center justify-center absolute">
            <p className="text-gray-500">
              {feed === null ? "Loading users..." : "No more users to show!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
