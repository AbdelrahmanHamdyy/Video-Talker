import {
  callStates,
  setCallState,
  setGroupCallActive,
  setGroupCallIncomingStreams,
} from "../../store/actions/callActions";
import store from "../../store/store";
import * as ws from "../wsConnection/wsConnection";

let myPeer;
let myPeerId;

export const connectWithMyPeer = () => {
  myPeer = new window.Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "5000",
  });

  myPeer.on("open", (id) => {
    console.log("Client side: Successfully connected with peerJS server");
    myPeerId = id;
  });

  myPeer.on("call", (call) => {
    call.answer(store.getState().call.localStream);
    call.on("stream", (incomingStream) => {
      const streams = store.getState().call.groupCallStreams;
      const stream = streams.find((stream) => stream.id === incomingStream.id);
      if (!stream) addVideoStream(incomingStream);
    });
  });
};

export const createNewGroupCall = () => {
  ws.registerGroupCall({
    username: store.getState().dashboard.username,
    peerId: myPeerId,
  });

  store.dispatch(setGroupCallActive(true));
  store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const joinGroupCall = (hostSocketId, roomId) => {
  const localStream = store.getState().call.localStream;

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

const addVideoStream = (stream) => {
  const groupCallStreams = {
    ...store.getState().call.groupCallStreams,
    stream,
  };

  store.dispatch(setGroupCallIncomingStreams(groupCallStreams));
};
