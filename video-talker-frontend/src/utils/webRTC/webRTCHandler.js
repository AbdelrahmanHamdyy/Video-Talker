import {
  setLocalStream,
  setCallState,
  callStates,
  setCallingDialogVisible,
  setCallerUsername,
} from "../../store/actions/callActions";
import store from "../../store/store";
import * as ws from "../wsConnection/wsConnection";

const defaultConstraints = {
  video: true,
  audio: true,
};

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
    })
    .catch((err) => {
      // Permission Denied
      console.log("Error occured when trying to access the local stream");
      console.log(err);
    });
};

let connectedUserSocketId;

export const callToOtherUser = (calleeDetails) => {
  connectedUserSocketId = calleeDetails.socketId;
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
  store.dispatch(setCallingDialogVisible(true));
  ws.sendPreOffer({
    callee: calleeDetails,
    caller: {
      username: store.getState().dashboard.username,
    },
  });
};

export const handlePreOffer = (data) => {
  connectedUserSocketId = data.caller.socketId;
  store.dispatch(setCallerUsername(data.callerUsername));
  store.dispatch(setCallState(callStates.CALL_REQUESTED));
};
