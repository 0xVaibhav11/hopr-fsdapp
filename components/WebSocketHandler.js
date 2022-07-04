import React, { useEffect, useState } from "react";
import useWebsocket from "../hooks/useWebsocket";

export const WebSocketHandler = ({ wsEndpoint, securityToken }) => {
  const [received, setReceived] = useState([]);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  // const [split, setSplit] = useState([]);
  const [file, setFile] = useState("");
  const websocket = useWebsocket({ wsEndpoint, securityToken });
  const { socketRef } = websocket;
  const handleReceivedMessage = async (ev) => {
    try {
      // we are only interested in messages, not all the other events coming in on the socket
      const data = JSON.parse(ev.data);
      if (data.type === "message") {
        console.log("WebSocket Data", data);
        received.push(data.msg);
        console.log(received);
      }
      setMessage(received.join(""));
      const split = message.split("@");
      setFile(split[0]);
      setFileName(split[1]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.addEventListener("message", handleReceivedMessage);

    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener("message", handleReceivedMessage);
    };
  }, [socketRef.current]);

  return (
    <a href={file} download={fileName}>
      {fileName}
    </a>
  );
};

export default WebSocketHandler;
