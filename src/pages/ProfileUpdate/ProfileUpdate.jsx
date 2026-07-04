import React from "react";

const Chat = () => {
  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <h2>Chats</h2>

        <div className="chat-user">
          <p>User 1</p>
        </div>

        <div className="chat-user">
          <p>User 2</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat Room</h2>
        </div>

        <div className="messages">
          <div className="message received">
            Hello 👋
          </div>

          <div className="message sent">
            Hi
          </div>
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type message..."
          />

          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;