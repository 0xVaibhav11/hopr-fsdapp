import React, { useState, useEffect } from "react";
import WebSocketHandler from "../components/WebSocketHandler";
import styles from "../styles/Home.module.css";

function Fshare() {
  const [fileToSend, setFileToSend] = useState([]);
  const [securityToken, setSecurityToken] = useState("");
  const [path, setPath] = useState("");
  const [wsEndpoint, setWsEndpoint] = useState("wss://localhost:3000");
  const [httpEndpoint, setHTTPEndpoint] = useState("https://localhost:3001");
  const [address, setAddress] = useState("");

  const getHeaders = (isPost = false) => {
    const headers = new Headers();
    if (isPost) {
      headers.set("Content-Type", "application/json");
      headers.set("Accept-Content", "application/json");
    }
    headers.set("Authorization", "Basic " + btoa(securityToken));
    return headers;
  };

  useEffect(() => {
    const loadAddress = async () => {
      const headers = getHeaders();
      const account = await fetch(`${httpEndpoint}/api/v2/account/addresses`, {
        headers,
      })
        .then((res) => res.json())
        .catch((err) => console.error(err));
      setAddress(account?.hoprAddress);
    };
    loadAddress();
  }, [securityToken, httpEndpoint]);

  useEffect(() => {
    console.log(fileToSend);
  }, [fileToSend]);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    console.log(file);
    console.log(file.name);
    console.log(base64);
    const toSend = `${base64}@${file.name}`;
    console.log(toSend);
    const encoded = toSend.match(/.{1,400}/g) || [];
    setFileToSend(encoded);
  };

  const sendMessage = async () => {
    if (!address) return;
    for (const elements of fileToSend) {
      await fetch(`${httpEndpoint}/api/v2/messages`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          recipient: address,
          body: elements,
          path: [path],
        }),
      }).catch((error) => console.error(error));
    }
  };

  return (
    <>
      <div className={styles.head}>
        <p className={styles.heading}>
          It is a file sharing dApp on HOPR mixnet.
        </p>
      </div>

      <div className={styles.app}>
        <div className={styles.downl}>
          <h1 className={styles.headin}>Download</h1>

          <label className={styles.fontSize}>WS Endpoint</label>
          <input
            className={styles.fontSize}
            name="wsEndpoint"
            placeholder={wsEndpoint}
            value={wsEndpoint}
            onChange={(e) => setWsEndpoint(e.target.value)}
          />
          <label className={styles.fontSize}>Security Token</label>
          <input
            className={styles.fontSize}
            name="securityToken"
            placeholder={securityToken}
            value={securityToken}
            onChange={(e) => setSecurityToken(e.target.value)}
          />

          <WebSocketHandler
            wsEndpoint={wsEndpoint}
            securityToken={securityToken}
          />
        </div>
        <div className={styles.upl}>
          <h1 className={styles.headin}>Upload</h1>
          <label className={styles.fontSize}>HTTP Endpoint</label>
          <input
            className={styles.fontSize}
            name="httpEndpoint"
            placeholder={httpEndpoint}
            value={httpEndpoint}
            onChange={(e) => setHTTPEndpoint(e.target.value)}
          />

          <label className={styles.fontSize}>Security Token</label>
          <input
            className={styles.fontSize}
            name="securityToken"
            placeholder={securityToken}
            value={securityToken}
            onChange={(e) => setSecurityToken(e.target.value)}
          />
          <label className={styles.fontSize}>Path</label>
          <input
            className={styles.fontSize}
            name="path"
            placeholder={path}
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />

          <input
            className={styles.file}
            type="file"
            onChange={(e) => {
              uploadFile(e);
            }}
          />

          <button className={styles.btn} onClick={() => sendMessage()}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Fshare;
