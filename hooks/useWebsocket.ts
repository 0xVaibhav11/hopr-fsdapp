import { useImmer } from "use-immer";
import { useEffect, useRef, useState } from "react";
import { debounce } from "debounce";

export type ConnectionStatus = "CONNECTED" | "DISCONNECTED";
export type Settings = {
  wsEndpoint: string;
  securityToken?: string;
};

const useWebsocket = (settings: Settings) => {
  // update timestamp when you want to reconnect to the websocket
  const [reconnectTmsp, setReconnectTmsp] = useState<number>();
  const [state, setState] = useImmer<{
    status: ConnectionStatus;
    error?: string;
  }>({ status: "DISCONNECTED" });

  const socketRef = useRef<WebSocket>();

  const setReconnectTmspDebounced = debounce((timestamp: number) => {
    setReconnectTmsp(timestamp);
  }, 1e3);

  const handleOpenEvent = () => {
    console.info("WS CONNECTED");
    setState((draft) => {
      draft.status = "CONNECTED";
      return draft;
    });
  };

  const handleCloseEvent = () => {
    console.info("WS DISCONNECTED");
    setState((draft) => {
      draft.status = "DISCONNECTED";
      return draft;
    });
    setReconnectTmspDebounced(+new Date());
  };

  const handleErrorEvent = (e: Event) => {
    console.error("WS ERROR", e);
    setState((draft) => {
      draft.status = "DISCONNECTED";
      draft.error = String(e);
    });
    setReconnectTmspDebounced(+new Date());
  };

  // runs everytime "endpoint" or "reconnectTmsp" changes
  useEffect(() => {
    if (typeof window === "undefined") return; // We are on SSR

    // disconnect from previous connection
    if (socketRef.current) {
      console.info("WS Disconnecting..");
      socketRef.current.close(1000, "Shutting down");
    }

    // need to set the token in the query parameters, to enable websocket authentication
    try {
      const wsUrl = new URL(settings.wsEndpoint);
      wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss' : 'ws'

      if (settings.securityToken) {
        wsUrl.search = `?apiToken=${settings.securityToken}`;
      }
      console.info("WS Connecting..");
      socketRef.current = new WebSocket(wsUrl);

      // handle connection opening
      socketRef.current.addEventListener("open", handleOpenEvent);
      // handle connection closing
      socketRef.current.addEventListener("close", handleCloseEvent);
      // handle errors
      socketRef.current.addEventListener("error", handleErrorEvent);
    } catch (err) {
      console.error("URL is invalid", settings.wsEndpoint);
    }

    // cleanup when unmounting
    return () => {
      if (!socketRef.current) return;

      socketRef.current.removeEventListener("open", handleOpenEvent);
      socketRef.current.removeEventListener("close", handleCloseEvent);
      socketRef.current.removeEventListener("error", handleErrorEvent);
    };
  }, [settings.wsEndpoint, settings.securityToken]);

  return {
    state,
    socketRef
  };
};

export default useWebsocket;