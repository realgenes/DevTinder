import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  // Safety check for undefined user
  if (!user) {
    return (
      <div className="card-xl bg-base-300 w-72 shadow-md mb-10 rounded-lg h-[480px] flex items-center justify-center">
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }

  const { firstName, lastName, photoUrl, age, gender, about } = user;
  const [showFullAbout, setShowFullAbout] = useState(false);
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUserFeed(userId));
    } catch (error) {
      console.error(error);
    }
  };

  const isLongAbout = about && about.length > 120;

  return (
    <>
      <div className="card-xl bg-base-300 w-72 shadow-md mb-10 rounded-lg h-[480px] flex flex-col">
        <figure className="h-64 flex-shrink-0">
          <img
            src={user.photoUrl}
            alt="Profile"
            className="w-full h-full object-cover bg-gray-200 rounded-t-lg"
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
              <p
                className={!showFullAbout && isLongAbout ? "line-clamp-3" : ""}
              >
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

          <div className="card-actions justify-center my-2 flex-shrink-0">
            <button
              className="btn btn-primary"
              onClick={() => handleSendRequest("ignored", user._id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSendRequest("interested", user._id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
