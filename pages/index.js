import React, { useState, useEffect } from "react";
import WebSocketHandler from "../components/WebSocketHandler";
import styles from "../styles/Home.module.css";

function Fshare() {
  const [fileToSend, setFileToSend] = useState([]);
  const [securityToken, setSecurityToken] = useState("^^LOCAL-testing-123^^");
  const [wsEndpoint, setWsEndpoint] = useState("ws://localhost:3000");
  const [httpEndpoint, setHTTPEndpoint] = useState("http://localhost:3001");
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
        }),
      }).catch((err) => console.error(err));
    }
  };

  //   const sendMessage = async () => {
  //     if (!address) return;
  //     await fetch(`${httpEndpoint}/api/v2/messages`, {
  //       method: "POST",
  //       headers: getHeaders(true),
  //       body: JSON.stringify({
  //         recipient: "16Uiu2HAm58JMsXAZU4DaHAYaHcMMSX3dDZeL9XhUm79qdCYdRCCe",
  //         body: "bye",
  //       }),
  //     }).catch((err) => console.error(err));
  //   };
  return (
    <div className={styles.app}>
      <div className={styles.upl}>
        <h1>Upload</h1>
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

        <input
          type="file"
          onChange={(e) => {
            uploadFile(e);
          }}
        />

        <button className={styles.fontSize} onClick={() => sendMessage()}>
          Upload
        </button>
      </div>

      <div className={styles.downl}>
        <h1>Download</h1>

        <label className={styles.fontSize}>WS Endpoint</label>
        <input
          className={styles.fontSize}
          name="wsEndpoint"
          placeholder={wsEndpoint}
          value={wsEndpoint}
          onChange={(e) => setWsEndpoint(e.target.value)}
        />
      </div>

      <WebSocketHandler wsEndpoint={wsEndpoint} securityToken={securityToken} />
    </div>
  );
}

export default Fshare;
