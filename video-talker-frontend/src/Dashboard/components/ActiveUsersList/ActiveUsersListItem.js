import React from "react";
import userAvatar from "../../../resources/userAvatar.png";
import { callStates } from "../../../store/actions/callActions";
import { callToOtherUser } from "../../../utils/webRTC/webRTCHandler";

const ActiveUsersListItem = (props) => {
  const { activeUser, callState } = props;

  const handleListItemPressed = () => {
    if (callState === callStates.CALL_AVAILABLE) {
      callToOtherUser(activeUser);
    }
  };

  return (
    <div className="active_user_list_item" onClick={handleListItemPressed}>
      <div className="active_user_list_image_container">
        <img
          className="active_user_list_image"
          src={userAvatar}
          alt="Active User"
        />
        <span className="active_user_list_text">{activeUser.username}</span>
      </div>
    </div>
  );
};

export default ActiveUsersListItem;
