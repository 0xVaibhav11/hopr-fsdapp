import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";

const Home = () => {
  const [chText, setChText] = useState("Secure");

  useEffect(() => {
    const changingText = setInterval(function () {
      if (chText === "Secure") {
        setChText("Hopr");
      } else if (chText === "Hopr") {
        setChText("Secure");
      }
      clearInterval(changingText);
    }, 6000);
    changingText;
  });

  return (
    <>
      <Head>
        <title>{"Share<3 |Home"}</title>
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.nav}>
            <div className={styles.name}>
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {
                    scale: 0.8,
                    opacity: 0,
                  },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: 0.4,
                    },
                  },
                }}
                className={styles.logo}
              >
                {"Share<3"}
              </motion.h1>
            </div>
            <div className={styles.links}>
              <a href="https://hoprnet.org" target="_blank" rel="noreferrer">
                What&#39;s HOPR?
              </a>

              <a
                href="https://discord.gg/SD9JR2QF"
                target="_blank"
                rel="noreferrer"
              >
                Contact
              </a>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <h1>
                It&#39;s <span className={styles.hilight}>{chText}</span>
              </h1>
              <h1>It&#39;s WEB3</h1>
              <p>
                Share your files privately to others completely securely with HOPR
              </p>
              <div className={styles.btn}>
                <div className={styles.dash}>
                  <Link href="/share">
                    <button className={styles.bttn}>Get Started</button>
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <Spline scene="https://prod.spline.design/4V-oxtujrIuucDuA/scene.splinecode" />
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Home;
