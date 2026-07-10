import React, { useContext, useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { db } from '../../config/firebase'
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { uploadToCloudinary } from '../../config/cloudinary'
import { toast } from 'react-toastify'

const ChatBox = () => {
  const {
    userData,
    chatUser,
    setChatUser,
    messagesId,
    setMessagesId,
    updateChatPreview,
    setShowRightSidebar,
  } = useContext(AppContext)

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const scrollEnd = useRef()

  // listen for real-time messages in the current conversation
  useEffect(() => {
    if (!messagesId) {
      setMessages([])
      return
    }

    const unsubscribe = onSnapshot(doc(db, "messages", messagesId), (docSnap) => {
      const data = docSnap.data()
      setMessages(data?.messages || [])
    })

    return () => unsubscribe()
  }, [messagesId])

  // auto-scroll to latest message
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !messagesId) return

    try {
      await updateDoc(doc(db, "messages", messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          text: input,
          createdAt: new Date(),
        }),
      })

      await updateChatPreview(messagesId, input, userData.id, chatUser.rId)
      setInput("")
    } catch (error) {
      console.error(error)
      toast.error("Failed to send message")
    }
  }

  const sendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !messagesId) return

    try {
      const imageUrl = await uploadToCloudinary(file)

      await updateDoc(doc(db, "messages", messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          image: imageUrl,
          createdAt: new Date(),
        }),
      })

      await updateChatPreview(messagesId, "Image", userData.id, chatUser.rId)
    } catch (error) {
      console.error(error)
      toast.error("Failed to send image")
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return ""
    return timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // mobile: return to LeftSidebar
  const goBack = () => {
    setChatUser(null)
    setMessagesId(null)
  }

  if (!chatUser) {
    return (
      <div className="chat-welcome">
        <img src={assets.logo_icon} alt="" />
        <p>Select a chat to start messaging</p>
      </div>
    )
  }

  return (
    <div className='chat-box'>

      <div className="chat-user">
        <img
          src={assets.arrow_icon}
          alt=""
          className="back-icon"
          onClick={goBack}
        />
        <div
          className="chat-user-info"
          onClick={() => setShowRightSidebar(true)}
        >
          <img src={chatUser.userData.avatar || assets.profile_img} alt="" />
          <p>
            {chatUser.userData.name || chatUser.userData.username}
            <img className='dot' src={assets.green_dot} alt="" />
          </p>
        </div>
        <img src={assets.help_icon} className='help' alt="" onClick={() => setShowRightSidebar(true)} />
      </div>

      <div className="chat-msg">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sId === userData.id ? "s-msg" : "r-msg"}
          >
            {msg.image ? (
              <img className="msg-img" src={msg.image} alt="" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}
            <div>
              <img
                src={
                  msg.sId === userData.id
                    ? userData.avatar || assets.profile_img
                    : chatUser.userData.avatar || assets.profile_img
                }
                alt=""
              />
              <p>{formatTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}

        <div ref={scrollEnd}></div>

      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Send a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
          onChange={sendImage}
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" onClick={sendMessage} />
      </div>

    </div>
  )
}

export default ChatBox