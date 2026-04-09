import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const fallbackPhoto =
  "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";

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
      const res = await axios.get(`${BASE_URL}/user/profile/${userId}`, {
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-card mx-auto max-w-2xl px-8 py-16 text-center">
        <h1 className="text-2xl text-error">{error}</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="premium-card mx-auto max-w-2xl px-8 py-16 text-center">
        <h1 className="text-2xl">User not found</h1>
      </div>
    );
  }

  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;

  return (
    <div className="grid gap-6 pb-4 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="premium-card overflow-hidden p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-[32px]">
          <img
            src={photoUrl || fallbackPhoto}
            alt={firstName}
            className="h-[420px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">
              Connected profile
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              {firstName} {lastName}
            </h1>
            {(age || gender) && (
              <p className="mt-2 text-sm text-white/85">
                {[age ? `${age}` : null, gender].filter(Boolean).join(" • ")}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="premium-card p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-base-content/45">
          About
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-balance">
          A closer look at the person behind the profile.
        </h2>
        <p className="mt-5 text-base leading-8 text-base-content/90">
          {about || "No introduction has been added yet."}
        </p>

        <div className="soft-surface mt-8 rounded-[28px] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-base-content/80">
            Connection context
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-base-content/75">Age</p>
              <p className="mt-1 text-lg font-semibold">{age || "Not shared"}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/75">Gender</p>
              <p className="mt-1 text-lg font-semibold">
                {gender || "Not shared"}
              </p>
            </div>
          </div>
        </div>

        {skills && skills.length > 0 && (
          <div className="mt-8">
            <p className="text-sm uppercase tracking-[0.24em] text-base-content/45">
              Skills
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gradient-to-r from-primary/15 to-secondary/20 px-4 py-2 text-sm font-semibold text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ConnectionProfile;
