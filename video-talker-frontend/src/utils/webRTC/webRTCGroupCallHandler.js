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
};

export const createNewGroupCall = () => {
  ws.registerGroupCall({
    username: store.getState().dashboard.username,
    peerId: myPeerId,
  });
};
