import React, { useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showtoast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    if (!age || !gender) {
      setError("Age and Gender are required fields");
      return;
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      setError("Please enter a valid age between 18 and 100");
      return;
    }
    try {
      setError("");
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age: ageNum,
          gender,
          photoUrl,
          about,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div>
      {showtoast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-4 lg:p-8 place-items-center">
        {/* FORM SECTION */}
        <div className="card w-full max-w-lg bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title font-mono text-2xl">Edit Profile</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Fields marked with * are required
            </p>

            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Age * (Required)</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`input input-bordered w-full ${
                      !age ? "input-error" : ""
                    }`}
                    placeholder="e.g., 25"
                    min="18"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Gender * (Required)</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`select select-bordered w-full ${
                      !gender ? "select-error" : ""
                    }`}
                    required
                  >
                    <option disabled value="">
                      Select...
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text">About</span>
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  placeholder="Tell us a bit about yourself and your skills"
                  rows={3}
                ></textarea>
              </div>

              <div className="card-actions flex-col items-center pt-4">
                {error && <p className="text-error text-sm mb-2">{error}</p>}
                <button
                  className="btn btn-primary w-full max-w-xs"
                  onClick={saveProfile}
                  disabled={!age || !gender}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* PREVIEW SECTION */}
        <div className="w-full max-w-sm flex flex-col items-center">
          <h3 className="text-xl font-mono text-center mb-4">Live Preview</h3>
          <UserCard
            user={{ firstName, lastName, age, gender, photoUrl, about }}
            preview={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
