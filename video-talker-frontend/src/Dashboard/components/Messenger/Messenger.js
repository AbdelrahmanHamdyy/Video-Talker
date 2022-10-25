import React, { useState, useEffect } from "react";
import { sendMessagesUsingDataChannel } from "../../../utils/webRTC/webRTCHandler";
import MessageDisplayer from "./MessageDisplayer";
import "./Messenger.css";

const Messenger = ({ message, setDirectCallMessage }) => {
  let [inputValue, setInputValue] = useState("");

  const handleOnKeyDownEvent = (e) => {
    if (e.keyCode === 13) {
      sendMessagesUsingDataChannel(inputValue);
      setInputValue("");
    }
  };

  useEffect(() => {
    if (message.received) {
      setTimeout(() => {
        setDirectCallMessage(false, "");
      }, [3000]);
    }
  }, [message.received, setDirectCallMessage]);

  return (
    <>
      <input
        className="messages_input"
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={handleOnKeyDownEvent}
        placeholder="Type your message"
      />
      {message.received && <MessageDisplayer message={message.content} />}
    </>
  );
};

export default Messenger;
