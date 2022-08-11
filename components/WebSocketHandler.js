import React, { useEffect, useState, useRef } from "react";
import useWebsocket from "../hooks/useWebsocket";
import styled from "../styles/Share.module.scss";
import { motion } from "framer-motion";

export const WebSocketHandler = ({ wsEndpoint, securityToken }) => {
  const [received, setReceived] = useState([]);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const websocket = useWebsocket({ wsEndpoint, securityToken });
  const { socketRef } = websocket;
  const handleReceivedMessage = async (ev) => {
    try {
      const data = JSON.parse(ev.data);
      // we are only interested in messages
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

  function render() {
    setMessage("");
    setMessage(received.join(""));
    console.log(message);
    const split = message.split("@");
    console.log(split);
    setFile(split[0]);
    console.log(file);
    setFileName(split[split.length - 1]);
    console.log(fileName);
  }

  return (
    <>
      <div className={styled.farea}>
        {file ? (
          <>
            <motion.div
              initial={({ opacity: 0 }, { y: -100 })}
              animate={({ opacity: 1 }, { y: 0 })}
              className={styled.rfile}
            >
              <div className={styled.rfname}>{"101byte.txt"}</div>
              <a href={file} download={fileName}>
                <span className="material-symbols-outlined">file_download</span>
              </a>
            </motion.div>
          </>
        ) : (
          <>
            <div className={styled.nofile}>No file appeared on node</div>
          </>
        )}
      </div>

      {received[0] ? (
        <>
          <motion.div
            whileTap={{ rotate: [360, 360, 360, 360, 0] }}
            transition={{ duration: 1 }}
            className={styled.btn}
            onClick={() => render()}
          >
            <span title="sync!" className="material-symbols-outlined">
              sync
            </span>
          </motion.div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default WebSocketHandler;
