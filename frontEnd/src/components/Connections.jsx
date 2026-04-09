import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { useNavigate, Link } from "react-router-dom";

const fallbackPhoto =
  "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const validConnections = useMemo(
    () => (Array.isArray(connections) ? connections.filter((c) => c && c._id) : []),
    [connections]
  );

  const fetchConnections = async () => {
    try {
      setError("");
      const res = await axios.get(BASE_URL + "/connections", {
        withCredentials: true,
      });
      const connectionsData = res.data.data;
      if (Array.isArray(connectionsData)) {
        dispatch(addConnection(connectionsData));
      } else {
        dispatch(addConnection([]));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to fetch connections.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [user]);

  const ConnectionSkeleton = () => (
    <div className="premium-card animate-pulse p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-white/55" />
        <div className="flex-1">
          <div className="h-5 w-40 rounded-full bg-white/55" />
          <div className="mt-3 h-4 w-24 rounded-full bg-white/45" />
        </div>
      </div>
      <div className="mt-4 h-16 rounded-2xl bg-white/45" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="h-11 rounded-full bg-white/55" />
        <div className="h-11 rounded-full bg-white/55" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-4">
      <section className="premium-card p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-base-content/75">
              Your network
            </p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">
              Your conversations hub
            </h1>
            <p className="mt-3 text-sm leading-7 text-base-content/85 sm:text-base">
              Keep up with people you matched with, open profiles quickly, and
              jump straight into chat.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:w-[340px]">
            <div className="soft-surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-base-content/75">
                Total connections
              </p>
              <p className="mt-2 text-2xl font-semibold">{validConnections.length}</p>
            </div>
            <div className="soft-surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-base-content/75">
                Ready to chat
              </p>
              <p className="mt-2 text-2xl font-semibold">{validConnections.length}</p>
            </div>
          </div>
        </div>

        {validConnections.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-base-content/70">
              Active connections
            </p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {validConnections.slice(0, 10).map((connection) => (
                <button
                  key={`chip-${connection._id}`}
                  onClick={() => navigate(`/chat/${connection._id}`)}
                  className="soft-surface flex min-w-[180px] items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:-translate-y-0.5"
                >
                  <img
                    src={connection.photoUrl || fallbackPhoto}
                    alt={`${connection.firstName} ${connection.lastName}`}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-base-content">
                      {connection.firstName} {connection.lastName}
                    </p>
                    <p className="text-xs text-base-content/75">Tap to message</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {error && <div className="alert alert-error rounded-2xl">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <ConnectionSkeleton key={i} />
          ))}
        </div>
      ) : validConnections.length === 0 ? (
        <div className="premium-card mx-auto max-w-2xl px-8 py-16 text-center">
          <h2 className="text-3xl font-semibold">No connections yet</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-base-content/85">
            Once requests are accepted, your network will appear here with quick
            access to profile and chat.
          </p>
          <Link
            to="/"
            className="btn mt-8 h-12 min-h-12 rounded-full border-none bg-gradient-to-r from-primary to-secondary px-6 text-white"
          >
            Find new people
          </Link>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {validConnections.map((connection) => {
            const name = `${connection.firstName} ${connection.lastName}`;
            const ageGender = [
              connection.age ? `${connection.age} years` : null,
              connection.gender,
            ]
              .filter(Boolean)
              .join(" • ");

            return (
              <article
                key={connection._id}
                className="premium-card p-4 sm:p-5 transition duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={connection.photoUrl || fallbackPhoto}
                    alt={name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-xl font-semibold">{name}</h2>
                      <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Connected
                      </span>
                    </div>
                    {ageGender && (
                      <p className="mt-1 text-sm text-base-content/80">{ageGender}</p>
                    )}
                  </div>
                </div>

                <div className="soft-surface mt-4 rounded-2xl px-4 py-3">
                  <p className="line-clamp-2 text-sm leading-7 text-base-content/90">
                    {connection.about
                      ? connection.about
                      : "A connection worth getting to know better. Start with a quick hello."}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    className="btn soft-surface h-11 min-h-11 rounded-full text-base-content"
                    onClick={() => navigate(`/user/${connection._id}`)}
                  >
                    View profile
                  </button>
                  <button
                    className="btn h-11 min-h-11 rounded-full border-none bg-gradient-to-r from-primary to-secondary text-white"
                    onClick={() => navigate(`/chat/${connection._id}`)}
                  >
                    Message
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Connections;
