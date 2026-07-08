import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase"; // adjust path to your firebase config file

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userInfo = userSnap.data();

      setUserData(userInfo);

      if (userInfo?.avatar && userInfo?.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid);
      } else {
        setUserData(null);
        setChatData([]);
        setChatUser(null);
        setMessagesId(null);
        setLoading(false);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        const data = snapshot.data();
        if (data?.chatData) {
          setChatData(data.chatData);
        }
      });

      return () => unsubscribe();
    }
  }, [userData]);

  // updates lastMessage/updatedAt/messageSeen for both users in a conversation
  const updateChatPreview = async (msgId, text, senderId, receiverId) => {
    const userIds = [senderId, receiverId];

    for (const id of userIds) {
      try {
        const userChatsRef = doc(db, "chats", id);
        const userChatsSnap = await getDoc(userChatsRef);
        const userChatsData = userChatsSnap.data();

        if (!userChatsData) continue;

        const chatIndex = userChatsData.chatData.findIndex(
          (c) => c.messageId === msgId
        );

        if (chatIndex !== -1) {
          userChatsData.chatData[chatIndex].lastMessage = text.slice(0, 30);
          userChatsData.chatData[chatIndex].updatedAt = Date.now();
          userChatsData.chatData[chatIndex].messageSeen = id === senderId;
          await updateDoc(userChatsRef, { chatData: userChatsData.chatData });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    chatUser,
    setChatUser,
    messagesId,
    setMessagesId,
    loadUserData,
    updateChatPreview,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;