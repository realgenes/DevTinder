import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { useNavigate, Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    } catch (error) {
      if (error.response?.status === 401) {
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
    <div className="card bg-base-300 shadow-xl animate-pulse">
      <div className="card-body items-center text-center p-6">
        <div className="avatar">
          <div className="w-24 rounded-full bg-base-100"></div>
        </div>
        <div className="h-6 w-32 bg-base-100 rounded mt-4"></div>
        <div className="h-4 w-24 bg-base-100 rounded mt-2"></div>
        <div className="h-10 w-48 bg-base-100 rounded mt-2"></div>
        <div className="card-actions justify-center mt-4">
          <div className="h-10 w-24 bg-base-100 rounded"></div>
          <div className="h-10 w-24 bg-base-100 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-mono font-bold text-center mb-8">
        My Connections
      </h1>
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <ConnectionSkeleton key={i} />
          ))}
        </div>
      ) : !connections || connections.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-4 text-6xl">😕</div>
          <h2 className="text-2xl font-bold mb-2">No connections yet</h2>
          <p className="text-base-content/70 mb-6">
            It looks a bit empty here. Let's find some developers!
          </p>
          <Link to="/" className="btn btn-primary">
            Find Connections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {connections
            .filter((connection) => connection && connection._id)
            .map((connection) => (
              <div
                key={connection._id}
                className="card bg-base-300 shadow-xl transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1 rounded-4xl p-2"
              >
                <div className="card-body items-center text-center p-6">
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={
                          connection.photoUrl ||
                          "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png"
                        }
                        alt={`${connection.firstName} ${connection.lastName}`}
                      />
                    </div>
                  </div>
                  <h2 className="card-title text-xl mt-4">
                    {connection.firstName} {connection.lastName}
                  </h2>
                  {(connection.age || connection.gender) && (
                    <p className="text-sm opacity-75">
                      {connection.age && `${connection.age} years old`}
                      {connection.age && connection.gender && " • "}
                      {connection.gender}
                    </p>
                  )}
                  {connection.about && (
                    <p className="text-base-content/70 my-2 text-sm">
                      "
                      {connection.about.length > 80
                        ? connection.about.substring(0, 80) + "..."
                        : connection.about}
                      "
                    </p>
                  )}
                  <div className="card-actions justify-center mt-4">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/user/${connection._id}`)}
                    >
                      View Profile
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/chat/${connection._id}`)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
