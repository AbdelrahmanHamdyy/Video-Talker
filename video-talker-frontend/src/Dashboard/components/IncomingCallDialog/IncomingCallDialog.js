import React from "react";
import "./IncomingCallDialog.css";

const IncomingCallDialog = ({ callerUsername }) => {
  const handleAcceptButtonPressed = () => {
    // Accepting the call
  };

  const handleRejectButtonPressed = () => {
    // Reject the call
  };

  return (
    <div className="direct_call_dialog background_secondary_color">
      <span className="direct_call_dialog_caller_name">{callerUsername}</span>
      <div className="direct_call_dialog_button_container">
        <button
          className="direct_call_dialog_accept_button"
          onclick={handleAcceptButtonPressed}
        >
          Accept
        </button>
        <button
          className="direct_call_dialog_accept_button"
          onclick={handleRejectButtonPressed}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default IncomingCallDialog;
