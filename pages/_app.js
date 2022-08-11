import "../styles/globals.scss";
import { motion, AnimatePresence } from "framer-motion";

function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence>
      <motion.div
        key={router.route}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // varients={{
        //   pageInitial: {
        //     width: 0,
        //     opacity: 1,
        //   },
        //   pageAnimate: {
        //     width: "100%",
        //     opacity: 0,
        //   },
        //   pageExit: {
        //     x: window.innerWidth,
        //     opacity: 0,
        //   },
        // }}
      >
        <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
  );
}

export default MyApp;
