import {
  setLocalStream,
  setCallState,
  callStates,
  setCallingDialogVisible,
  setCallerUsername,
  setCallRejected,
  setRemoteStream,
  setScreenSharingActive,
  resetCallDataState,
} from "../../store/actions/callActions";
import store from "../../store/store";
import * as ws from "../wsConnection/wsConnection";

const preOfferAnswers = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_NOT_AVAILABLE: "CALL_NOT_AVAILABLE",
};

const defaultConstraints = {
  video: true,
  audio: true,
};

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

let connectedUserSocketId;
let peerConnection;

export const getLocalStream = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setCallState(callStates.CALL_AVAILABLE));
      createPeerConnection();
    })
    .catch((err) => {
      // Permission Denied
      console.log("Error occured when trying to access the local stream");
      console.log(err);
    });
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  const localStream = store.getState().call.localStream;

  for (const track of localStream.getTracks()) {
    peerConnection.addTrack(track, localStream);
  }

  peerConnection.ontrack = ({ streams: [stream] }) => {
    // Dispatch remote stream in the store
    store.dispatch(setRemoteStream(stream));
  };

  peerConnection.onicecandidate = (event) => {
    // Send our ice candidates to the connected user
    console.log("Getting candidates from STUN server");
    if (event.candidate) {
      ws.sendwebRTCCandidate({
        candidate: event.candidate,
        connectedUserSocketId: connectedUserSocketId,
      });
    }
  };

  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection.connectionState === "connected") {
      console.log("Successfully connected with other peer!");
    }
  };
};

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
  if (checkIfCallIsPossible()) {
    connectedUserSocketId = data.callerSocketId;
    store.dispatch(setCallerUsername(data.callerUsername));
    store.dispatch(setCallState(callStates.CALL_REQUESTED));
  } else {
    ws.sendPreOfferAnswer({
      callerSocketId: data.callerSocketId,
      answer: preOfferAnswers.CALL_NOT_AVAILABLE,
    });
  }
};

export const acceptIncomingCallRequest = () => {
  ws.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_ACCEPTED,
  });
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const rejectIncomingCallRequest = () => {
  ws.sendPreOfferAnswer({
    callerSocketId: connectedUserSocketId,
    answer: preOfferAnswers.CALL_REJECTED,
  });
  resetCallData();
};

export const handlePreOfferAnswer = (data) => {
  store.dispatch(setCallingDialogVisible(false));
  if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
    sendOffer();
  } else {
    let rejectionReason;
    if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
      rejectionReason = "Callee is not able to pick up the call right now!";
    } else {
      rejectionReason = "Call rejected by the callee";
    }
    store.dispatch(
      setCallRejected({
        rejected: true,
        reason: rejectionReason,
      })
    );
    resetCallData();
  }
};

const sendOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  ws.sendWebRTCOffer({
    calleeSocketId: connectedUserSocketId,
    offer: offer,
  });
};

export const handleOffer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  ws.sendWebRTCAnswer({
    callerSocketId: connectedUserSocketId,
    answer: answer,
  });
};

export const handleAnswer = async (data) => {
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleCandidate = async (data) => {
  console.log("Adding Ice Candidates");
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (err) {
    console.log(
      "Error occured when trying to add ice candidate to the peer connection!",
      err
    );
  }
};

export const checkIfCallIsPossible = () => {
  if (
    store.getState().call.localStream === null ||
    store.getState().call.callState !== callStates.CALL_AVAILABLE
  ) {
    return false;
  }
  return true;
};

let screenSharingStream;

export const switchForScreenSharingStream = async () => {
  if (!store.getState().call.screenSharingActive) {
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.dispatch(setScreenSharingActive(true));
      const senders = peerConnection.getSenders();
      const sender = senders.find(
        (sender) =>
          sender.track.kind == screenSharingStream.getVideoTracks()[0].kind
      );
      sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
    } catch (err) {
      console.log(
        "Error occured when trying to get the screen sharing stream",
        err
      );
    }
  } else {
    const localStream = store.getState().call.localStream;
    const senders = peerConnection.getSenders();
    const sender = senders.find(
      (sender) =>
        sender.track.kind == screenSharingStream.getVideoTracks()[0].kind
    );
    sender.replaceTrack(localStream.getVideoTracks()[0]);
    stopScreenSharing();
  }
};

const stopScreenSharing = () => {
  screenSharingStream.getTracks().forEach((track) => track.stop());
};

export const handleUserHangUp = () => {
  resetCallDataAfterHangUp();
};

export const hangUp = () => {
  ws.sendUserHangedUp({
    connectedUserSocketId: connectedUserSocketId,
  });
  resetCallDataAfterHangUp();
};

export const resetCallData = () => {
  connectedUserSocketId = null;
  store.dispatch(setCallState(callStates.CALL_AVAILABLE));
};

const resetCallDataAfterHangUp = () => {
  if (store.getState().call.screenSharingActive) {
    stopScreenSharing();
  }

  store.dispatch(resetCallDataState());
  peerConnection.close();
  peerConnection = null;
  createPeerConnection();
  resetCallData();

  const localStream = store.getState().call.localStream;
  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;
};
