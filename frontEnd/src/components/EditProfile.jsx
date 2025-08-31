import React from "react";
import { useState } from "react";
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
  const [about, setAbout] = useState(user.about);
  const [error, setError] = useState("");
  const [showtoast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    // Validate mandatory fields
    if (!age || !gender) {
      setError("Age and Gender are required fields");
      return;
    }

    // Validate age is a valid number
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      setError("Please enter a valid age between 18 and 100");
      return;
    }

    try {
      setError(""); // Clear any previous errors
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

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="">
      {showtoast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success text-white bg-cyan-900">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center space-x-8">
        <div className="flex justify-center my-2">
          <div className="card w-96 bg-base-300 card-md shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Edit Profile</h2>
              <p className="text-sm text-gray-600 mb-4">
                Fields marked with * are required
              </p>
              <div className="">
                <fieldset className="fieldset py-.5">
                  <legend className="fieldset-legend textarea-md">
                    First name -
                  </legend>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input"
                    placeholder="Enter your first name here"
                  />
                </fieldset>

                <fieldset className="fieldset py-.5">
                  <legend className="fieldset-legend textarea-md">
                    Last name -
                  </legend>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input"
                    placeholder="Enter your lastName"
                  />
                </fieldset>

                <fieldset className="fieldset py-.5">
                  <legend className="fieldset-legend textarea-md">
                    PhotoUrl -
                  </legend>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="input"
                    placeholder="your photourl"
                  />
                </fieldset>

                <fieldset className="fieldset py-.5 ">
                  <legend className="fieldset-legend textarea-md">
                    Age * (Required)
                  </legend>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className={`input ${
                      !age ? "input-error border-red-500" : ""
                    }`}
                    placeholder="Enter your Age (18-100)"
                    min="18"
                    max="100"
                    required
                  />
                  {!age && (
                    <p className="text-red-500 text-xs mt-1">Age is required</p>
                  )}
                </fieldset>

                <fieldset className="fieldset py-.5 ">
                  <legend className="fieldset-legend textarea-md">
                    Gender * (Required)
                  </legend>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`select select-bordered w-full ${
                      !gender ? "select-error border-red-500" : ""
                    }`}
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer not to say">Prefer not to say</option>
                  </select>
                  {!gender && (
                    <p className="text-red-500 text-xs mt-1">
                      Gender is required
                    </p>
                  )}
                </fieldset>
                <fieldset className="fieldset py-.5 ">
                  <legend className="fieldset-legend textarea-md">
                    About -
                  </legend>
                  <input
                    type="text"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="input"
                    placeholder="About"
                  />
                </fieldset>
              </div>

              <div className="flex flex-col justify-center items-center card-actions">
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  className={`btn btn-primary ${
                    !age || !gender ? "btn-disabled" : ""
                  }`}
                  onClick={saveProfile}
                  disabled={!age || !gender}
                >
                  Save profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="my-2">
          <UserCard
            user={{ firstName, lastName, age, gender, photoUrl, about }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
