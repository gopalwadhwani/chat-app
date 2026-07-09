import { useContext } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import ChatBox from "../../components/ChatBox/ChatBox";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import "./Chat.css";
import { AppContext } from "../../context/AppContext";

const Chat = () => {
  const { chatUser, showRightSidebar } = useContext(AppContext);

  // determines which single panel is visible on mobile
  let activePanel = "left";
  if (chatUser && !showRightSidebar) activePanel = "chat";
  if (chatUser && showRightSidebar) activePanel = "right";

  return (
    <div className="chat">
      <div className={`panel panel-left ${activePanel === "left" ? "active" : ""}`}>
        <LeftSidebar />
      </div>
      <div className={`panel panel-chat ${activePanel === "chat" ? "active" : ""}`}>
        <ChatBox />
      </div>
      <div className={`panel panel-right ${activePanel === "right" ? "active" : ""}`}>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Chat;