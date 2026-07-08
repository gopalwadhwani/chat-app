import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { db } from "../../config/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { logout } from "../../config/firebase";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
  } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);

  // search for a user by username
  const inputHandler = async (e) => {
    const input = e.target.value;
    setSearch(input);

    if (!input.trim()) {
      setShowSearch(false);
      setFoundUser(null);
      return;
    }

    setShowSearch(true);

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", input.trim().toLowerCase()));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const result = querySnap.docs[0].data();

        if (result.id === userData.id) {
          setFoundUser(null); // don't show self
        } else {
          setFoundUser(result);
        }
      } else {
        setFoundUser(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    }
  };

  // start (or open existing) chat with the searched user
  const addChat = async (targetUser) => {
    try {
      const alreadyExists = chatData.find((c) => c.rId === targetUser.id);

      if (alreadyExists) {
        setChat(alreadyExists);
        setSearch("");
        setShowSearch(false);
        return;
      }

      const messagesRef = collection(db, "messages");
      const newMessageRef = doc(messagesRef);

      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(db, "chats", targetUser.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(db, "chats", userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: targetUser.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      setSearch("");
      setShowSearch(false);
    } catch (error) {
      console.error(error);
      toast.error("Could not start chat");
    }
  };

  // build the list of conversations with each partner's profile info
  useEffect(() => {
    const buildChatUsers = async () => {
      const temp = [];

      for (const chat of chatData) {
        const userSnap = await getDoc(doc(db, "users", chat.rId));
        if (userSnap.exists()) {
          temp.push({ ...chat, userData: userSnap.data() });
        }
      }

      temp.sort((a, b) => b.updatedAt - a.updatedAt);
      setChatUsers(temp);
    };

    if (chatData?.length > 0) {
      buildChatUsers();
    } else {
      setChatUsers([]);
    }
  }, [chatData]);

  // open an existing conversation
  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item);
      navigate("/chat");

      const userChatsRef = doc(db, "chats", userData.id);
      const userChatsSnap = await getDoc(userChatsRef);
      const userChatsData = userChatsSnap.data();

      const index = userChatsData.chatData.findIndex(
        (c) => c.messageId === item.messageId
      );

      if (index !== -1) {
        userChatsData.chatData[index].messageSeen = true;
        await updateDoc(userChatsRef, { chatData: userChatsData.chatData });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="left-sidebar">
      <div className="sidebar-top">

        <div className="logo-row">
          <img src={assets.logo} alt="Logo" className="logo" />

          <div className="menu">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="menu-icon"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="sub-menu">
                <p onClick={() => { setShowMenu(false); navigate("/profile"); }}>
                  Edit Profile
                </p>
                <hr />
                <p onClick={() => { setShowMenu(false); logout(); }}>
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="search-box">
          <img
            src={assets.search_icon}
            alt="Search"
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={inputHandler}
          />
        </div>

      </div>

      <div className="users-list">
        {showSearch && foundUser ? (
          <div className="user" onClick={() => addChat(foundUser)}>
            <img
              src={foundUser.avatar || assets.avatar_icon}
              alt=""
              className="profile-img"
            />
            <div className="user-info">
              <p>{foundUser.username}</p>
              <span>Click to start chat</span>
            </div>
          </div>
        ) : showSearch && !foundUser ? (
          <p className="no-result">No user found</p>
        ) : (
          chatUsers.map((item, index) => (
            <div
              key={index}
              className={`user ${chatUser?.userData?.id === item.userData.id ? "active" : ""}`}
              onClick={() => setChat(item)}
            >
              <img
                src={item.userData.avatar || assets.avatar_icon}
                alt=""
                className="profile-img"
              />
              <div className="user-info">
                <p>{item.userData.username}</p>
                <span>{item.lastMessage || "Say hi 👋"}</span>
              </div>
              {!item.messageSeen && item.rId !== userData.id && (
                <span className="unseen-dot"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;