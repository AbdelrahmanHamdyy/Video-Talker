import React from "react";
import { connect } from "react-redux";
import ActiveUsersListItem from "./ActiveUsersListItem";
import "./ActiveUsersList.css";

const ActiveUsersList = (props) => {
  const { activeUsers, callState } = props;
  return (
    <div className="active_users_list_container">
      {activeUsers.map((activeUser) => (
        <ActiveUsersListItem
          key={activeUser.socketId}
          activeUser={activeUser}
          callState={callState}
        />
      ))}
    </div>
  );
};

const mapStateToProps = ({ dashboard, call }) => ({
  ...dashboard,
  ...call,
});

export default connect(mapStateToProps)(ActiveUsersList);
