import { useAppStore } from "@/store";
import { HOST } from "@/utils/constant";
import { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();

  const { userInfo, addChannelInChannelList, addContactsInDMContacts } =
    useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const handleRecieveMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();
        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
          addMessage(message);
        }
        addContactsInDMContacts(message);
      };

      const handleRecieveChannleMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();

        if (selectedChatType && selectedChatData._id === message.channelId) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("recieve-channel-message", handleRecieveChannleMessage);

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [addChannelInChannelList, addContactsInDMContacts, userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
