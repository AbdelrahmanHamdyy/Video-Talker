import React from "react";
import { connect } from "react-redux";
import CallingDialog from "../CallingDialog/CallingDialog";
import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";

const DirectCall = (props) => {
  const { localStream, remoteStream } = props;

  return (
    <div>
      <LocalVideoView localStream={localStream} />
      {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
      {/* <CallRejectedDialog />
      <IncomingCallDialog />
      <CallingDialog /> */}
    </div>
  );
};

function mapStoreStateToProps({ call }) {
  return {
    ...call,
  };
}

export default connect(mapStoreStateToProps)(DirectCall);
