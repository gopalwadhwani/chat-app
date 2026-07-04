import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import ChatBox from "../../components/ChatBox/ChatBox";
import "./Chat.css";
import RightSidebar from "../../components/RightSidebar/RightSidebar";

const Chat = () => {
  return (
    <div className="chat">
      <LeftSidebar />
      <ChatBox />
      <RightSidebar/>
    </div>
  );
};

export default Chat;