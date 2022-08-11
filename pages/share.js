import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import WebSocketHandler from "../components/WebSocketHandler";
import styled from "../styles/Share.module.scss";
import { FileUploader } from "react-drag-drop-files";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

//file types config
const fileTypes = ["TXT", "JPG", "PNG", "GIF", "PDF", "SVG", "MP4"];

function Fshare() {
  const router = useRouter();

  const [securityToken, setSecurityToken] = useState(
    router.query.apiToken || ""
  );
  const [httpEndpoint, setHTTPEndpoint] = useState(
    router.query.apiEndpoint || "http://localhost:3001"
  );
  const [path, setPath] = useState("");
  const [address, setAddress] = useState("");

  const [fileToSend, setFileToSend] = useState([]);
  const [filed, setFiled] = useState({});
  const [errFeed, setErrFeed] = useState("");
  const [feed, setFeed] = useState("Send 🚀");
  const [tab, setTab] = useState("send");
  const [show, setShow] = useState(false);

  // Headers setting
  const getHeaders = (isPost = false) => {
    const headers = new Headers();
    if (isPost) {
      headers.set("Content-Type", "application/json");
      headers.set("Accept-Content", "application/json");
    }
    headers.set("Authorization", "Basic " + btoa(securityToken));
    return headers;
  };

  // useEffects
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

  // function to convert file into b64 chars
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

  // getting file & dividing into chunks(400bytes)
  const handleChange = async (file) => {
    console.log(file.name);
    const base64 = await convertBase64(file);
    const toSend = `${base64}@${file.name}`;
    const encoded = toSend.match(/.{1,400}/g) || [];
    setFileToSend(encoded);
    setErrFeed(`Uploded successfully! 😉`);
    setFiled({
      name: file.name,
      size: file.size,
    });
  };
  // on Size Error
  const sizeError = (file) => {
    console.log(file);
    setErrFeed(
      `Your file exceedes max limit of 100kb, Please choose smaller one`
    );
  };
  // on Size Error
  const onTypeError = (file) => {
    setErrFeed(`${file} 😑`);
  };

  // sending to the node
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
      })
        .then(function (response) {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then(function (response) {
          setFeed("sent! 😎");
        })
        .catch(function (error) {
          setFeed("retry 😕");
          console.error(error);
        });
    }
  };

  return (
    <>
      <div className={styled.continer}>
        {/* //Nav starts */}
        <div className={styled.nav}>
          <div className={styled.back}>
            <Link href="/">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
          </div>
          <div className={styled.tabtogl}>
            <div className={styled.inner}>
              {tab == "send" ? (
                <>
                  <div
                    className={styled.activeTab}
                    onClick={() => setTab("send")}
                  >
                    Send
                  </div>
                  <div className={styled.tab} onClick={() => setTab("receive")}>
                    Receive
                  </div>
                </>
              ) : (
                <>
                  <div className={styled.tab} onClick={() => setTab("send")}>
                    Send
                  </div>
                  <div
                    className={styled.activeTab}
                    onClick={() => setTab("receive")}
                  >
                    Receive
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styled.setting} onClick={() => setShow(true)}>
            {securityToken ? (
              <>
                <span className="material-symbols-outlined">settings</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">
                  settings_suggest
                </span>
              </>
            )}
          </div>
        </div>
        {/* //Nav ends //App's UI starts */}
        {tab == "send" ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styled.sendui}
            >
              <Tilt
                trackOnWindow="true"
                gyroscope="true"
                tiltMaxAngleX="10"
                tiltMaxAngleY="10"
                className={styled.dnd}
              >
                <FileUploader
                  className={styled.fileUploader}
                  handleChange={handleChange}
                  onSizeError={sizeError}
                  onTypeError={onTypeError}
                  hoverTitle="Drop here :)"
                  name="file"
                  types={fileTypes}
                  maxSize="0.1"
                >
                  <div className={styled.dash}>
                    <p>🏗️ Drag your file here to start</p>
                    <p>or</p>
                    <p className={styled.browse}>Browse files</p>
                    <p>{errFeed}</p>
                  </div>
                </FileUploader>
              </Tilt>
              <div className={styled.left}>
                {filed.name ? (
                  <>
                    <motion.div
                      key="2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={styled.file}
                    >
                      <p>{filed.name}</p>
                      <p className={styled.size}>{`${filed.size / 1000}kb`}</p>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <div className={styled.file}>
                      <p>No file selected</p>
                    </div>
                  </>
                )}

                <div className={styled.inputBox}>
                  <input
                    required
                    title="Recipient hopr address"
                    type="text"
                    name="address"
                    placeholder={address}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <span>Hopr address</span>
                </div>
                <div className={styled.inputBox}>
                  <input
                    required
                    title="Path to travel trough!"
                    type="text"
                    name="path"
                    placeholder={path}
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                  />
                  <span>Path</span>
                </div>
                <div className={styled.btn} onClick={() => sendMessage()}>
                  <div className={styled.dash}>
                    <button className={styled.bttn}>{feed}</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              key="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styled.receiveui}
            >
              <WebSocketHandler
                wsEndpoint={`${httpEndpoint}/api/v2/messages/websocket`}
                securityToken={securityToken}
              />
            </motion.div>
          </>
        )}
        {/* //App's UI ends // APi setting tab */}
        {show ? (
          <>
            <motion.div
              initial={({ opacity: 0 }, { x: 50 })}
              animate={({ opacity: 1 }, { x: 0 })}
              className={styled.apiset}
            >
              <div className={styled.inputBox}>
                <input
                  required
                  title="Api endpoint!"
                  type="text"
                  name="httpEndpoint"
                  placeholder={httpEndpoint}
                  value={httpEndpoint}
                  onChange={(e) => setHTTPEndpoint(e.target.value)}
                />
                <span>HTTP endpoint</span>
              </div>
              <div className={styled.inputBox}>
                <input
                  required
                  title="Api tocken!"
                  type="text"
                  name="securityToken"
                  placeholder={securityToken}
                  value={securityToken}
                  onChange={(e) => setSecurityToken(e.target.value)}
                />
                <span>Security tocken</span>
              </div>
              <div className={styled.btn} onClick={() => setShow(false)}>
                Done
              </div>
              <p className={styled.help}>help</p>
            </motion.div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Fshare;
