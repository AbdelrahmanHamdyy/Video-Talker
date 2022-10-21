import React from "react";
import { connect } from "react-redux";
import {
  callStates,
  setCallRejected,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
} from "../../../store/actions/callActions";
import CallingDialog from "../CallingDialog/CallingDialog";
import CallRejectedDialog from "../CallRejectedDialog/CallRejectedDialog";
import ConversationButtons from "../ConversationButtons/ConversationButtons";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";

const DirectCall = (props) => {
  const {
    localStream,
    remoteStream,
    callState,
    callerUsername,
    callingDialogVisible,
    callRejected,
    hideCallRejectedDialog,
  } = props;

  return (
    <div>
      <LocalVideoView localStream={localStream} />
      {remoteStream && callState === callStates.CALL_IN_PROGRESS && (
        <RemoteVideoView remoteStream={remoteStream} />
      )}
      {callingDialogVisible && <CallingDialog />}
      {callRejected.rejected && (
        <CallRejectedDialog
          reason={callRejected.reason}
          hideCallRejectedDialog={hideCallRejectedDialog}
        />
      )}
      {callState === callStates.CALL_REQUESTED && (
        <IncomingCallDialog callerUsername={callerUsername} />
      )}
      {remoteStream && callState === callStates.CALL_IN_PROGRESS && (
        <ConversationButtons {...props} />
      )}
    </div>
  );
};

function mapStoreStateToProps({ call }) {
  return {
    ...call,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideCallRejectedDialog: (callRejectedDetails) =>
      dispatch(setCallRejected(callRejectedDetails)),
    setCameraEnabled: (enabled) => dispatch(setLocalCameraEnabled(enabled)),
    setMicEnabled: (enabled) => dispatch(setLocalMicrophoneEnabled(enabled)),
  };
}

export default connect(mapStoreStateToProps, mapDispatchToProps)(DirectCall);
