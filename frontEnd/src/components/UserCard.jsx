import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = user;
  return (
    <>
      <div className="card-xs bg-base-300 w-80 shadow-md  mb-10  rounded-lg">
        <figure className="h-64">
          <img src={user.photoUrl} alt="Shoes" className="w-full h-full object-cover rounded-lg"/>
        </figure>
        <div className="card-body p-6">
          <h2 className="card-title text-xl">{firstName + " " + lastName}</h2>
          {age && gender && <p className="text-lg">{age + " " + gender}</p>}
          <p className="text-sm break-words overflow-hidden text-ellipsis">{about}</p>
          <div className="card-actions justify-center my-2">
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
