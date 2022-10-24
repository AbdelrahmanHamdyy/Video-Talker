import React from "react";
import { connect } from "react-redux";
import GroupCallButton from "../GroupCallButton/GroupCallButton";
import {
  callStates,
  setLocalCameraEnabled,
  setLocalMicrophoneEnabled,
} from "../../../store/actions/callActions";
import * as webRTCGroupCallHandler from "../../../utils/webRTC/webRTCGroupCallHandler";
import GroupCallRoom from "../GroupCallRoom/GroupCallRoom";

const GroupCall = (props) => {
  const { callState, localStream, groupCallActive } = props;

  const createRoom = () => {
    // Create room for the group call
    webRTCGroupCallHandler.createNewGroupCall();
  };

  const leaveRoom = () => {
    webRTCGroupCallHandler.leaveGroupCall();
  };

  return (
    <>
      {!groupCallActive &&
        localStream &&
        callState !== callStates.CALL_IN_PROGRESS && (
          <GroupCallButton onClickHandler={createRoom} label="Create Room" />
        )}
      {groupCallActive && <GroupCallRoom {...props} />}
      {groupCallActive && (
        <GroupCallButton label="Leave Room" onClickHandler={leaveRoom} />
      )}
    </>
  );
};

const mapStateToProps = ({ call }) => ({
  ...call,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCameraEnabled: (enabled) => dispatch(setLocalCameraEnabled(enabled)),
    setMicEnabled: (enabled) => dispatch(setLocalMicrophoneEnabled(enabled)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupCall);
