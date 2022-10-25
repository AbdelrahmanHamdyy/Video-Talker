import {
  callStates,
  setCallState,
  setGroupCallActive,
  setGroupCallIncomingStreams,
  clearGroupCallData,
} from "../../store/actions/callActions";
import store from "../../store/store";
import * as ws from "../wsConnection/wsConnection";
import { getTurnServers } from "./TURN";

let myPeer;
let myPeerId;
let groupCallRoomId;
let groupCallHost = false;

export const connectWithMyPeer = () => {
  myPeer = new window.Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "5000",
    config: {
      iceServers: [...getTurnServers(), { url: "stun:stun.1und1.de:3478" }],
    },
  });

  myPeer.on("open", (id) => {
    console.log("Client side: Successfully connected with peerJS server");
    myPeerId = id;
  });

  myPeer.on("call", (call) => {
    call.answer(store.getState().call.localStream);
    call.on("stream", (incomingStream) => {
      const streams = store.getState().call.groupCallStreams;
      console.log(streams);
      const stream = streams.find((stream) => stream.id === incomingStream.id);
      if (!stream) addVideoStream(incomingStream);
    });
  });
};

export const createNewGroupCall = () => {
  groupCallHost = true;
  ws.registerGroupCall({
    username: store.getState().dashboard.username,
    peerId: myPeerId,
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const joinGroupCall = (hostSocketId, roomId) => {
  const localStream = store.getState().call.localStream;
  groupCallRoomId = roomId;

  ws.userWantsToJoinGroupCall({
    peerId: myPeerId,
    hostSocketId,
    roomId,
    localStreamId: localStream.id,
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const connectToNewUser = (data) => {
  const localStream = store.getState().call.localStream;
  const call = myPeer.call(data.peerId, localStream);
  call.on("stream", (incomingStream) => {
    const streams = store.getState().call.groupCallStreams;
    const stream = streams.find((stream) => stream.id === incomingStream.id);
    if (!stream) addVideoStream(incomingStream);
  });
};

export const leaveGroupCall = () => {
  if (groupCallHost) {
    ws.groupCallClosedByHost({
      peerId: myPeerId,
    });
  } else {
    ws.userLeftGroupCall({
      streamId: store.getState().call.localStream.id,
      roomId: groupCallRoomId,
    });
  }

  clearGroupData();
};

export const clearGroupData = () => {
  groupCallRoomId = null;
  groupCallHost = null;
  store.dispatch(clearGroupCallData());
  myPeer.distroy();
  connectWithMyPeer();

  const localStream = store.getState().call.localStream;
  localStream.getVideoTracks()[0].enabled = true;
  localStream.getAudioTracks()[0].enabled = true;
};

export const removeInactiveStream = (data) => {
  const groupCallStreams = store
    .getState()
    .call.groupCallStreams.filter((stream) => stream.id !== data.streamId);
  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};

const addVideoStream = (stream) => {
  const groupCallStreams = [...store.getState().call.groupCallStreams, stream];

  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};

// If group call is active, return roomId
// If not, return false
export const checkActiveGroupCall = () => {
  if (store.getState().call.groupCallActive) {
    return groupCallRoomId;
  } else {
    return false;
  }
};
