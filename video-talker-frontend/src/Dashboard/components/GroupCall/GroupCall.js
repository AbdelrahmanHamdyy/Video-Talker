import React from "react";
import { connect } from "react-redux";
import GroupCallButton from "../GroupCallButton/GroupCallButton";
import { callStates } from "../../../store/actions/callActions";

const GroupCall = (props) => {
  const { callState, localStream } = props;

  const createRoom = () => {
    // Create room for the group call
  };

  return (
    <>
      {localStream && callState !== callStates.CALL_IN_PROGRESS && (
        <GroupCallButton onClickHandler={createRoom} label="Create Room" />
      )}
    </>
  );
};

const mapStateToProps = ({ call }) => ({
  ...call,
});

export default connect(mapStateToProps)(GroupCall);
