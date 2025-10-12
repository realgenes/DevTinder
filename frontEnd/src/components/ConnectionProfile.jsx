import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ConnectionProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/${userId}`, {
        withCredentials: true,
      });
      setUser(res.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl text-error">{error}</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl">User not found</h1>
      </div>
    );
  }

  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <img
            src={photoUrl}
            alt={firstName}
            className="rounded-full w-40 h-40 object-cover"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl">{firstName + " " + lastName}</h2>
          {age && gender && (
            <p className="text-lg">
              {age}, {gender}
            </p>
          )}
          <p className="py-4">{about}</p>
          {skills && skills.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {skills.map((skill, index) => (
                <span key={index} className="badge badge-primary">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionProfile;
