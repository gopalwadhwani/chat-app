import React, { useContext, useEffect, useState } from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logout, db } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'
import { doc, onSnapshot } from 'firebase/firestore'

const RightSidebar = () => {
    const { chatUser, messagesId } = useContext(AppContext)
    const [mediaMessages, setMediaMessages] = useState([])

    useEffect(() => {
        if (!messagesId) {
            setMediaMessages([])
            return
        }

        const unsubscribe = onSnapshot(doc(db, "messages", messagesId), (docSnap) => {
            const data = docSnap.data()
            const images = (data?.messages || []).filter((m) => m.image)
            setMediaMessages(images)
        })

        return () => unsubscribe()
    }, [messagesId])

    if (!chatUser) {
        return (
            <div className='rs'>
                <button onClick={() => logout()}>Logout</button>
            </div>
        )
    }

    return (
        <div className='rs'>
            <div className="rs-profile">
                <img src={chatUser.userData.avatar || assets.profile_img} alt="" />
                <h3>
                    {chatUser.userData.name || chatUser.userData.username}
                    <img src={assets.green_dot} className='dot' alt="" />
                </h3>
                <p>{chatUser.userData.bio || "Hey, there! I am using chat app"}</p>
            </div>

            <hr />

            <div className="rs-media">
                <p>Media</p>
                <div>
                    {mediaMessages.length > 0 ? (
                        mediaMessages.map((msg, index) => (
                            <img
                                key={index}
                                src={msg.image}
                                alt=""
                                onClick={() => window.open(msg.image, "_blank")}
                            />
                        ))
                    ) : (
                        <p className="no-media">No media shared yet</p>
                    )}
                </div>
            </div>

            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default RightSidebar