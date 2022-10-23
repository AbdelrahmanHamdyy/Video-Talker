import React from "react";
import GroupCallRoomsListItem from "./GroupCallRoomsListItem";
import "./GroupCallRoomsList.css";

const dummylist = [
  {
    roomId: "123123",
    hostName: "Mark",
  },
  {
    roomId: "345678",
    hostName: "Paul",
  },
];

const GroupCallRoomsList = () => {
  return (
    <>
      {dummylist.map((room) => (
        <GroupCallRoomsListItem key={room.roomId} room={room} />
      ))}
    </>
  );
};

export default GroupCallRoomsList;
