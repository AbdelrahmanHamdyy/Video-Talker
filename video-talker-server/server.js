const express = require("express");
const socket = require("socket.io"); // Direct calls
const { ExpressPeerServer } = require("peer"); // Group calls
const groupCallHandler = require("./groupCallHandler");
const { v4: uuidv4 } = require("uuid");
const twilio = require("twilio");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors()); // Connect to our api from everywhere

app.get("/", (req, res) => {
  res.send({ api: "video-talker-api" });
});

app.get("/api/get-turn-credentials", (req, res) => {
  // Better to be moved to .env file
  const accountSid = "ACb6e3bcd081a6b48289e6a7bf1ec2a919";
  const authToken = "00f008e0fed10a23f1e2a9e53085fcf4";
  const client = twilio(accountSid, authToken);

  client.tokens.create().then((token) => res.send({ token }));
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);

groupCallHandler.createPeerServerListeners(peerServer);

// Creates an endpoint for communication and returns a socket descriptor representing the endpoint.
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let peers = []; // Store Active Users
let groupCallRooms = [];

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};

io.on("connection", (socket) => {
  socket.emit("connection", null);
  console.log("New user connected");
  console.log(socket.id);

  socket.on("register-new-user", (data) => {
    peers.push({
      username: data.username,
      socketId: data.socketId,
    });
    console.log(`New User Registered`);
    console.log(peers);

    io.sockets.emit("broadcast", {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers,
    });

    io.sockets.emit("broadcast", {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    peers = peers.filter((user) => user.socketId !== socket.id);
    io.sockets.emit("broadcast", {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers,
    });

    groupCallRooms = groupCallRooms.filter(
      (room) => room.socketId !== socket.id
    );
    io.sockets.emit("broadcast", {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });

  // Listeners related with direct call
  socket.on("pre-offer", (data) => {
    console.log("Pre-offer handled");
    io.to(data.callee.socketId).emit("pre-offer", {
      callerUsername: data.caller.username,
      callerSocketId: socket.id,
    });
  });

  socket.on("pre-offer-answer", (data) => {
    console.log("Handling Pre-offer answer");
    io.to(data.callerSocketId).emit("pre-offer-answer", {
      answer: data.answer,
    });
  });

  socket.on("webRTC-offer", (data) => {
    console.log("Handling webRTC offer");
    io.to(data.calleeSocketId).emit("webRTC-offer", {
      offer: data.offer,
    });
  });

  socket.on("webRTC-answer", (data) => {
    console.log("Handling webRTC answer");
    io.to(data.callerSocketId).emit("webRTC-answer", {
      answer: data.answer,
    });
  });

  socket.on("webRTC-candidate", (data) => {
    console.log("Handling Ice Candidate");
    io.to(data.connectedUserSocketId).emit("webRTC-candidate", {
      candidate: data.candidate,
    });
  });

  socket.on("user-hanged-up", (data) => {
    console.log("Handling User Hanged up");
    io.to(data.connectedUserSocketId).emit("user-hanged-up");
  });

  // Listeners related with group calls
  socket.on("group-call-register", (data) => {
    const roomId = uuidv4();
    socket.join(roomId);

    const newGroupCallRoom = {
      peerId: data.peerId,
      hostName: data.username,
      socketId: socket.id,
      roomId: roomId,
    };

    groupCallRooms.push(newGroupCallRoom);
    console.log(groupCallRooms);
    io.sockets.emit("broadcast", {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });

  socket.on("group-call-join-request", (data) => {
    io.to(data.roomId).emit("group-call-join-request", {
      peerId: data.peerId,
      streamId: data.localStreamId,
    });

    socket.join(data.roomId);
  });

  socket.on("group-call-user-left", (data) => {
    socket.leave(data.roomId);
    io.to(data.roomId).emit("group-call-user-left", {
      streamId: data.streamId,
    });
  });

  socket.on("group-call-closed-by-host", (data) => {
    groupCallRooms = groupCallRooms.filter(
      (room) => room.peerId !== data.peerId
    );
    io.sockets.emit("broadcast", {
      event: broadcastEventTypes.GROUP_CALL_ROOMS,
      groupCallRooms,
    });
  });
});
