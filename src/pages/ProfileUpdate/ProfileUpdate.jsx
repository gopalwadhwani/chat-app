import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { auth, db } from "../../config/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../../config/cloudinary"; // adjust path
import { toast } from "react-toastify";

const ProfileUpdate = () => {

    const navigate = useNavigate();

    const [image, setImage] = useState(false);      // newly selected file
    const [prevImage, setPrevImage] = useState("");  // existing avatar URL from Firestore
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = auth.currentUser.uid;
                const userSnap = await getDoc(doc(db, "users", uid));
                const userData = userSnap.data();

                if (userData) {
                    setName(userData.name || "");
                    setBio(userData.bio || "");
                    setPrevImage(userData.avatar || "");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setInitializing(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Require either a newly selected image OR an existing avatar already set
        if (!image && !prevImage) {
            toast.error("Please select profile image");
            return;
        }

        setLoading(true);

        try {
            const uid = auth.currentUser.uid;
            let avatarUrl = prevImage;

            if (image) {
                avatarUrl = await uploadToCloudinary(image);
            }

            await updateDoc(doc(db, "users", uid), {
                name,
                bio,
                avatar: avatarUrl,
            });

            navigate("/chat");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (initializing) {
        return <div className="profile">Loading...</div>;
    }

    return (
        <div className='profile'>
            <div className="profile-container">
                <form onSubmit={handleSubmit}>
                    <h3>Profile Details</h3>

                    <label htmlFor="avatar">
                        <input
                            onChange={(e) => setImage(e.target.files[0])}
                            type="file"
                            id="avatar"
                            accept="image/*"
                            hidden
                        />

                        <img
                            src={
                                image
                                    ? URL.createObjectURL(image)
                                    : prevImage || assets.avatar_icon
                            }
                            alt=""
                        />
                        upload profile image
                    </label>

                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Write profile bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    ></textarea>

                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </form>

                <img
                    className='profile-pic'
                    src={
                        image
                            ? URL.createObjectURL(image)
                            : prevImage || assets.logo_icon
                    }
                    alt=""
                />
            </div>
        </div>
    )
}

export default ProfileUpdate;