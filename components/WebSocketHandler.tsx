import React, { useEffect, useState, useRef } from "react";
import useWebsocket from "../hooks/useWebsocket.ts";
import styled from "../styles/Share.module.scss";
import { motion } from "framer-motion";

import { decode } from "rlp";
export const WebSocketHandler: React.FC<{
  wsEndpoint: string;
  securityToken: string;
}> = ({ wsEndpoint, securityToken }): JSX.Element => {
  const [received, setReceived] = useState([]);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const websocket = useWebsocket({ wsEndpoint, securityToken });
  const { socketRef } = websocket;

  const decodeMessage = (msg: string): string => {
    let uint8Array = new Uint8Array(JSON.parse(`[${msg}]`));
    let decodedArray = decode(uint8Array);
    if (decodedArray[0] instanceof Uint8Array) {
      return new TextDecoder().decode(decodedArray[0]);
    }
    throw Error(`Could not decode received message: ${msg}`);
  };

  const handleReceivedMessage = async (ev: MessageEvent<string>) => {
    try {
      const data = decodeMessage(ev.data);
      console.log("WebSocket Data: receiving...");
      received.push(data);
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

  async function render() {
    setMessage("");
    setMessage(received.join(""));
    const split = message.split("@");
    setFile(split[split.length - 3]);
    setFileName(split[split.length - 2]);
    console.log(`%c${fileName} found!`, `font-weight: 700;`);
  }

  return (
    <>
      <div className={styled.farea}>
        {file ? (
          <>
            <motion.div
              key={fileName}
              initial={({ opacity: 0 }, { y: -100 })}
              animate={({ opacity: 1 }, { y: 0 })}
              className={styled.rfile}
            >
              <div className={styled.rfname}>{fileName}</div>
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
            whileTap={{ rotate: [0, 90, 180, 270, 0] }}
            transition={{ duration: 0.3 }}
            className={styled.btn}
            onClick={() => render()}
          >
            <span title="refresh!" className="material-symbols-outlined">
              refresh
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
