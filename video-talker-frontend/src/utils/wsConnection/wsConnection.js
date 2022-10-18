import socketClient from "socket.io-client";
import store from "../../store/store";
import * as dashboardActions from "../../store/actions/dashboardActions";

const SERVER = "http://localhost:5000";

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};

let socket;

export const connectWithWebSocket = () => {
  socket = socketClient(SERVER);
  socket.on("connection", () => {
    console.log("Successfully connected with ws server");
    console.log(socket.id);
  });

  socket.on("broadcast", (data) => {
    handleBroadcastEvents(data);
  });
};

export const registerNewUser = (username) => {
  socket.emit("register-new-user", {
    username: username,
    socketId: socket.id,
  });
};

const handleBroadcastEvents = (data) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      store.dispatch(dashboardActions.setActiveUsers(data.activeUsers));
      break;
    default:
      break;
  }
};
