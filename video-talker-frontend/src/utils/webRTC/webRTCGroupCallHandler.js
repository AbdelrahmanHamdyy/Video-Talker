let myPeer;

export const connectWithMyPeer = () => {
  myPeer = new window.Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "5000",
  });

  myPeer.on("open", (id) => {
    console.log("Client side: Successfully connected with peerJS server");
    console.log(id);
  });
};
