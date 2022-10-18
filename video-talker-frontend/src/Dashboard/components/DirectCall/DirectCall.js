import React from "react";
import { connect } from "react-redux";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";

const DirectCall = (props) => {
  const { localStream, remoteStream } = props;

  return (
    <div>
      <LocalVideoView localStream={localStream} />
      {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
    </div>
  );
};

function mapStoreStateToProps({ call }) {
  return {
    ...call,
  };
}

export default connect(mapStoreStateToProps)(DirectCall);
