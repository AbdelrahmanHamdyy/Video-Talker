import React from "react";
import userAvatar from "../../../resources/userAvatar.png";

const ActiveUsersListItem = (props) => {
  const { activeUser } = props;

  const handleListItemPressed = () => {
    // Call to other user
  };

  return (
    <div className="active_user_list_item" onClick={handleListItemPressed}>
      <div className="active_user_list_image_container">
        <img
          className="active_user_list_image"
          src={userAvatar}
          alt="Active User"
        />
        <span className="active_user_list_text">
          {ActiveUsersListItem.username}
        </span>
      </div>
    </div>
  );
};

export default ActiveUsersListItem;
