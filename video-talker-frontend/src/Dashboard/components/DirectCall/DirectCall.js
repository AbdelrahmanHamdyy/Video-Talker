import React from "react";
import { connect } from "react-redux";
import {
  callStates,
  setCallRejected,
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
      {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
      {callRejected.rejected && (
        <CallRejectedDialog
          reason={callRejected.reason}
          hideCallRejectedDialog={hideCallRejectedDialog}
        />
      )}
      {callState === callStates.CALL_REQUESTED && (
        <IncomingCallDialog callerUsername={callerUsername} />
      )}
      {callingDialogVisible && <CallingDialog />}
      <ConversationButtons />
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
  };
}

export default connect(mapStoreStateToProps, mapDispatchToProps)(DirectCall);
