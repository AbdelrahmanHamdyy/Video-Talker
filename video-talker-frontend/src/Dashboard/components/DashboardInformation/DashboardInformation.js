import React from "react";

import "./DashboardInformation.css";

const DashboardInformation = ({ username }) => {
  return (
    <div className="dashboard_info_text_container">
      <span className="dashboard_info_text_title">
        Hello {username}! Welcome to VideoTalker.
      </span>
      <span className="dashboard_info_text_description">
        You can start a call directly to another person from the list or
        create/join a group call.
      </span>
    </div>
  );
};

export default DashboardInformation;
