import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { useState } from "react";

const Request = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requests = useSelector((store) => store.requests);

  // Add CSS for hiding scrollbars
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Prevent body scroll when component mounts
  useEffect(() => {
    // Remove body scroll prevention since we need to see footer
    // document.body.style.overflow = 'hidden';
    // return () => {
    //   document.body.style.overflow = 'auto';
    // };
  }, []);

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
      console.log(res.data.data);
    } catch (error) {
      console.error("Error fetching requests requests", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const handleAcceptRequest = async () => {
    try {
      const res = await axios.post(BASE_URL + "/request/review/accepted/"+ requests._id);
    } catch (error) {
      console.error(error);
    }
  }

  console.log("Redux requests:", requests); // Add this debug line

  if (loading)
    return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold">My Requests</h1>
        </div>
      </div>

      {/* Scrollable Content - Limited to 4 items height */}
      <div className="flex-1 px-6 pb-6">
        {!requests || requests.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <h2 className="text-2xl mb-4">No new requests found</h2>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div
              className="space-y-4 overflow-y-auto overflow-x-hidden scrollbar-hide"
              style={{
                maxHeight: "calc(4 * (140px + 16px))", // 4 cards * (estimated card height + gap)
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE and Edge */,
              }}
            >
              {requests.map((request) => {
                const { firstName, lastName, photoUrl, about, age, gender } =
                  request.fromUserId;

                return (
                  <div
                    key={request._id}
                    className="flex bg-base-300 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Photo */}
                    <div className="flex-shrink-0 mr-4">
                      <img
                        src={photoUrl}
                        alt={`${firstName} ${lastName}`}
                        className="w-20 h-20 object-cover rounded-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      {/* Name */}
                      <h2 className="text-lg font-bold mb-1">
                        {firstName} {lastName}
                      </h2>

                      {/* Age and Gender */}
                      {(age || gender) && (
                        <p className="text-sm opacity-75 mb-2">
                          {age && `${age} years old`}
                          {age && gender && " • "}
                          {gender}
                        </p>
                      )}

                      {/* About */}
                      {about && (
                        <p className="text-sm opacity-80 mb-3 leading-relaxed">
                          {about.length > 120
                            ? about.substring(0, 120) + "..."
                            : about}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex flex-col gap-2 ml-4">
                      <button className="btn btn-primary btn-sm" onClick={handleAcceptRequest} >Accept</button>
                      <button className="btn btn-error btn-sm">Reject</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
