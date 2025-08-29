import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.error("Error fetching connections:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading)
    return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-center mb-8">
        <h1 className="text-4xl font-bold">My Connections</h1>
      </div>

      {!connections || connections.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <h2 className="text-2xl mb-4">No connections found</h2>
            <p className="text-gray-500">
              You haven't connected with anyone yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className="flex bg-base-300 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {/* Photo */}
              <div className="flex-shrink-0 mr-4">
                <img
                  src={connection.photoUrl}
                  alt={`${connection.firstName} ${connection.lastName}`}
                  className="w-20 h-20 object-cover rounded-full"
                />
              </div>

              {/* Content */}
              <div className="flex-grow">
                {/* Name */}
                <h2 className="text-lg font-bold mb-1">
                  {connection.firstName} {connection.lastName}
                </h2>

                {/* Age and Gender */}
                {(connection.age || connection.gender) && (
                  <p className="text-sm opacity-75 mb-2">
                    {connection.age && `${connection.age} years old`}
                    {connection.age && connection.gender && " • "}
                    {connection.gender}
                  </p>
                )}

                {/* About */}
                {connection.about && (
                  <p className="text-sm opacity-80 mb-3 leading-relaxed">
                    {connection.about.length > 120
                      ? connection.about.substring(0, 120) + "..."
                      : connection.about}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex flex-col gap-2 ml-4">
                <button className="btn btn-primary btn-sm">View Profile</button>
                <button className="btn btn-outline btn-sm">Message</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
