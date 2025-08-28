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
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [error, setError] = useState("");
  const [showtoast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
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
      setError(error?.response?.message);
    }
  };

  return (
    <div className="">
      {showtoast&&<div className="toast toast-top toast-center z-50">
        <div className="alert alert-success text-white bg-cyan-900">
          <span>Profile updated successfully.</span>
        </div>
      </div>}

      <div className="flex justify-center items-center space-x-8">
        <div className="flex justify-center my-2">
          <div className="card w-96 bg-base-300 card-md shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Edit Profile</h2>
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
                  <legend className="fieldset-legend textarea-md">Age -</legend>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input"
                    placeholder="Enter your Age"
                  />
                </fieldset>

                <fieldset className="fieldset py-.5 ">
                  <legend className="fieldset-legend textarea-md">
                    Gender -
                  </legend>
                  <input
                    type="text"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="input"
                    placeholder="your gender"
                  />
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
                <button className="btn btn-primary" onClick={saveProfile}>
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
