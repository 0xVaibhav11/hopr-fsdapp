import React, { useEffect, useState } from "react";
import useWebsocket from "../hooks/useWebsocket";
import styles from "../styles/Home.module.css";

export const WebSocketHandler = ({ wsEndpoint, securityToken }) => {
  const [received, setReceived] = useState([]);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
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
        console.log(`received ${received}`);
      }
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

  const render = () => {
    setMessage(received.join(""));
    console.log(message);
    const split = message.split("@");
    console.log(split);
    setFile(split[0]);
    console.log(file);
    setFileName(split[split.length - 1]);
    console.log(fileName);
  };

  return (
    <>
      {received ? (
        <>
          <button className={styles.btn} onClick={() => render()}>
            Fetch
          </button>
        </>
      ) : (
        <></>
      )}

      {file ? (
        <>
          <a href={file} download={fileName}>
            Download {fileName}
          </a>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default WebSocketHandler;
