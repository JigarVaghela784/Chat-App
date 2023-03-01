import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { logOutUser } from "../../store/actions/auth";
import { useStoreActions } from "../../store/hooks";
import styles from "./dashboard.module.css";
import { CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import { Image } from "antd";

import UserInfo from "../../components/atoms/userInfo";
import io from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Head from "next/head";
import Modal from "../../components/atoms/modal";
import ChatInput from "../../components/chatInput";
import ChatSection from "../../components/chatSection";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ["polling", "websocket"],
});

const Dashboard = ({ getUser }) => {
  const { push } = useRouter();
  const [messages, setMessages] = useState([]);
  const [userData] = useState(getUser);
  const [isEmoji, setIsEmoji] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [profileImage, setProfileImage] = useState();
  const [open, setOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [chatImage, setChatImage] = useState(null);
  const [preview, setPreview] = useState();
  const [isVisible, setIsVisible] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [uptMsgProfile, setUptMsgProfile] = useState(null);
  const [msg, setMsg] = useState({ message: "" });
  const token = Cookies.get("token");
  const actions = useStoreActions({ logOutUser });

  // create a preview as a side effect
  useEffect(() => {
    if (!chatImage) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(chatImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [chatImage]);

  //add notification sound
  const notificationSound = () => {
    const audio = new Audio(
      "https://res.cloudinary.com/du0p5yed7/video/upload/v1650957124/Accord/sounds/notification_gm5zvp.mp3"
    );
    audio.play();
  };

  // logout user
  const handleLogout = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        mode: "cors",
      });
      Cookies.remove("token");
      actions;
      return push("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  const userProfile = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
        {
          mode: "cors",
        }
      );
      const data = await response.data;
      const blob = new Blob([Buffer.from(data)]);
      const profileUrl = URL.createObjectURL(blob);
      setProfileImage(profileUrl);
      if (isUpload) {
        updateMsgProfile();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAllMessage = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/message`,
        {
          mode: "cors",
        }
      );
      response?.data.map((element) => {
        const blob = new Blob([Buffer.from(element.avatar)]);
        element.avatar = URL.createObjectURL(blob);
        if (element.image) {
          const blobImage = new Blob([Buffer.from(element.image)]);
          element.image = URL.createObjectURL(blobImage);
        }
        setMessages(response?.data);
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  //Upload user profile to database
  const uploadProfile = async () => {
    const formData = new FormData();
    formData.append("avatar", uploadImage);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
        formData,
        {
          mode: "core",
        }
      );
      setUptMsgProfile(uploadImage);
      setIsUpload(true);
    } catch (error) {
      console.log("error", error);
    }
  };
  const updateMsgProfile = async () => {
    const formData = new FormData();
    formData.append("avatar", uptMsgProfile);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/message/avatar`,
        formData,
        {
          mode: "core",
        }
      );
      getAllMessage();
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!token) {
      push("/auth");
    }
    getAllMessage();
    userProfile();
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  useEffect(() => {
    if (isUpload) {
      setTimeout(() => {
        userProfile();
        setIsUpload(false);
      }, 2000);
    }

    if (isVisible) {
      setUnreadCount(0);
    }
  }, [isVisible, isUpload]);
  const handleFileUpload = (event) => {
    setChatImage(event.target.files[0]);
  };

  //render user message
  useEffect(() => {
    if (!isVisible) {
      notificationSound();
      setUnreadCount(unreadCount + 1);
    }
    socket.on("message", (message) => {
      const avatarBlob = new Blob([Buffer.from(message.avatar)]);
      message.avatar = URL.createObjectURL(avatarBlob);
      if (message?.image) {
        const blob = new Blob([Buffer.from(message.image)]);
        message.image = URL.createObjectURL(blob);
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("delMessage", (message) => {
      messages = messages?.filter((delMsg) => delMsg?._id !== message?._id);
      setMessages(messages);
    });

    return () => {
      socket.off("message");
    };
  }, [messages]);

  const addEmoji = (e) => {
    const emoji = e.native;
    setMsg({ message: msg?.message + emoji });
  };

  const handleProfileModal = () => {
    setOpen(true);
  };

  const handleCloseImage = () => {
    setChatImage(null);
    setPreview(null);
  };

  return (
    <div className={styles.mainWrapper}>
      <Head>
        {unreadCount > 0 && !isVisible ? (
          <title>{unreadCount} new message</title>
        ) : (
          <title>chat</title>
        )}
      </Head>

      <div className={styles.headerWrapper}>
        <div style={{ cursor: "pointer" }} onClick={handleProfileModal}>
          <UserInfo
            src={profileImage}
            user={userData?.name || userData?.email}
          />
        </div>

        <div
          style={{ fontSize: "25px", color: "#eee", cursor: "pointer" }}
          onClick={handleLogout}
        >
          <LogoutOutlined />
        </div>

        {open && (
          <Modal
            open={open}
            setOpen={setOpen}
            setUploadImage={setUploadImage}
            uploadProfile={uploadProfile}
          />
        )}
      </div>

      <ChatSection
        messages={messages}
        userData={userData}
        isVisible={isVisible}
        socket={socket}
      />

      {isEmoji && (
        <div className={styles.emojiWrapper1}>
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
      {chatImage && (
        <>
          <div className={styles.imagePreviewWrapper}>
            <CloseOutlined
              onClick={handleCloseImage}
              style={{ fontSize: "20px" }}
            />
            <div className={styles.imgPreview}>
              <Image width={350} src={preview} />
            </div>
          </div>
        </>
      )}
      <ChatInput
        msg={msg}
        setMsg={setMsg}
        socket={socket}
        chatImage={chatImage}
        setIsEmoji={setIsEmoji}
        setChatImage={setChatImage}
        handleFileUpload={handleFileUpload}
        isEmoji={isEmoji}
      />
    </div>
  );
};

export default Dashboard;
