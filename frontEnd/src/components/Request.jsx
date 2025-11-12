import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { Link } from "react-router-dom";

const Request = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requests = useSelector((store) => store.requests);

  const fetchRequest = async () => {
    // No need to refetch if we already have requests in the store
    if (requests.length > 0) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data || []));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const handleRequestReview = async (status, requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      // Optimistically update the UI by removing the handled request
      const updatedRequests = requests.filter((req) => req._id !== requestId);
      dispatch(addRequests(updatedRequests));
    } catch (error) {
      setError(error.response?.data?.message || "Action failed.");
    }
  };

  const RequestSkeleton = () => (
    <div className="flex items-center bg-base-300 shadow-lg rounded-lg p-4 animate-pulse">
      <div className="avatar mr-4">
        <div className="w-20 h-20 rounded-full bg-base-100"></div>
      </div>
      <div className="flex-grow space-y-2">
        <div className="h-5 w-1/3 bg-base-100 rounded"></div>
        <div className="h-4 w-1/4 bg-base-100 rounded"></div>
        <div className="h-4 w-2/3 bg-base-100 rounded"></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 ml-4">
        <div className="h-10 w-24 bg-base-100 rounded"></div>
        <div className="h-10 w-24 bg-base-100 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-mono font-bold text-center mb-8">
        Connection Requests
      </h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <RequestSkeleton key={i} />
            ))}
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4 text-6xl">👍</div>
            <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
            <p className="text-base-content/70">
              You have no new connection requests right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              if (!request.fromUserId) return null; // Safety check
              const { firstName, lastName, photoUrl, about, age, gender } =
                request.fromUserId;

              return (
                <div
                  key={request._id}
                  className="flex items-center bg-base-300 shadow-lg rounded-lg p-4 transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"
                >
                  <div className="avatar mr-4">
                    <div className="w-20 h-20 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                      <img src={photoUrl} alt={`${firstName} ${lastName}`} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-bold">
                      {firstName} {lastName}
                    </h2>
                    {(age || gender) && (
                      <p className="text-sm opacity-75">
                        {age && `${age} years old`}
                        {age && gender && " • "}
                        {gender}
                      </p>
                    )}
                    {about && (
                      <p className="text-sm opacity-80 mt-1">
                        "
                        {about.length > 90
                          ? about.substring(0, 90) + "..."
                          : about}
                        "
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 ml-4">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        handleRequestReview("accepted", request._id)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Accept
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() =>
                        handleRequestReview("rejected", request._id)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
