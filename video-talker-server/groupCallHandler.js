const createPeerServerListeners = (PeerServer) => {
  PeerServer.on("connection", (client) => {
    console.log(
      `Successfully connected to PeerJS server, Client ID: ${client.id}`
    );
  });
};

module.exports = {
  createPeerServerListeners,
};
