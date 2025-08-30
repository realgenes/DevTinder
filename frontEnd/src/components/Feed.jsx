import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);


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
    getFeed();
  }, []);

  return (
    <div className="flex justify-center mt-10">
      {feed && feed.length > 0 ? (
        <UserCard user={feed[0]} />
      ) : (
        <div className="card-xl bg-base-300 w-72 shadow-md mb-10 rounded-lg h-[480px] flex items-center justify-center">
          <p className="text-gray-500">No more users to show!</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
