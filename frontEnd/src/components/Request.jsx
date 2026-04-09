import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";

const fallbackPhoto =
  "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";

const Request = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requests = useSelector((store) => store.requests);

  const fetchRequest = async () => {
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
      const updatedRequests = requests.filter((req) => req._id !== requestId);
      dispatch(addRequests(updatedRequests));
    } catch (error) {
      setError(error.response?.data?.message || "Action failed.");
    }
  };

  const RequestSkeleton = () => (
    <div className="premium-card animate-pulse p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-24 w-24 rounded-[28px] bg-white/60" />
        <div className="flex-grow">
          <div className="h-6 w-48 rounded-full bg-white/60" />
          <div className="mt-3 h-4 w-28 rounded-full bg-white/50" />
          <div className="mt-4 h-14 rounded-[20px] bg-white/50" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-56">
          <div className="h-12 rounded-full bg-white/60" />
          <div className="h-12 rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-4">
      <section className="premium-card p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-base-content/45">
          Incoming interest
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-balance sm:text-5xl">
          Decide who gets access to your world.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-base-content/85 sm:text-lg">
          Review new requests in a calmer, more premium queue. Accept the ones
          worth exploring and gracefully pass on the rest.
        </p>
      </section>

      {error && <div className="alert alert-error rounded-[24px]">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <RequestSkeleton key={i} />
          ))}
        </div>
      ) : !requests || requests.length === 0 ? (
        <div className="premium-card mx-auto max-w-2xl px-8 py-16 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 text-4xl">
            ✓
          </div>
          <h2 className="mt-6 text-3xl font-semibold">All caught up</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-base-content/85">
            You have no pending requests right now. When someone shows interest,
            they’ll appear here in this review list.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            if (!request.fromUserId) return null;
            const { firstName, lastName, photoUrl, about, age, gender } =
              request.fromUserId;

            return (
              <article
                key={request._id}
                className="premium-card overflow-hidden p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-28 w-28 overflow-hidden rounded-[30px]">
                    <img
                      src={photoUrl || fallbackPhoto}
                      alt={`${firstName} ${lastName}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold">
                        {firstName} {lastName}
                      </h2>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Wants to connect
                      </span>
                    </div>

                    {(age || gender) && (
                      <p className="mt-2 text-sm text-base-content/80">
                        {[age ? `${age} years old` : null, gender]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}

                    <p className="mt-4 text-sm leading-7 text-base-content/90">
                      {about
                        ? about.length > 150
                          ? `${about.substring(0, 150)}...`
                          : about
                        : "A polished developer profile is waiting for your response."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:w-56">
                    <button
                      className="btn h-12 min-h-12 rounded-full border-none bg-gradient-to-r from-success to-emerald-400 text-white"
                      onClick={() =>
                        handleRequestReview("accepted", request._id)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="btn soft-surface h-12 min-h-12 rounded-full text-base-content"
                      onClick={() =>
                        handleRequestReview("rejected", request._id)
                      }
                    >
                      Pass
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Request;
