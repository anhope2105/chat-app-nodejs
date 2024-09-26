import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/ChatContainer";
import ContactsContainer from "./components/ContactsContainer";
import EmptyChatContainer from "./components/EmptyChatContainer";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();

  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  });

  return (
    <div className="h-[100vh] flex text-white overflow-hidden">
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 bg-black/80 flex items-center justify-center flex-col">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileDownloadProgress}%
        </div>
      )}
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 bg-black/80 flex items-center justify-center flex-col">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          {fileUploadProgress}%
        </div>
      )}
      <ContactsContainer />
      {/* <EmptyChatContainer /> */}
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
