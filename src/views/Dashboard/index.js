import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { logOutUser } from "../../store/actions/auth";
import { useStoreActions } from "../../store/hooks";
import styles from "./dashboard.module.css";
import Input from "../../components/atoms/input";
import {
  CloseOutlined,
  LogoutOutlined,
  SendOutlined,
  SmileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Chat from "../../components/atoms/chat";
import { Form, Image, Modal as PreviewModal } from "antd";

import UserInfo from "../../components/atoms/userInfo";
import { io } from "socket.io-client";

import Cookies from "js-cookie";
import axios from "axios";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import Head from "next/head";

import Modal from "../../components/atoms/modal";
const socket = io("http://localhost:8080/", { transports: ["websocket"] });

const Dashboard = () => {
  const { push } = useRouter();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isEmoji, setIsEmoji] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [chatImage, setChatImage] = useState(null);
  const [preview, setPreview] = useState();
  const [previewOpen, setPreviewOpen] = useState(false);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!chatImage) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(chatImage);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [chatImage]);

  const [isVisible, setIsVisible] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [form] = Form.useForm();
  const lastMessageRef = useRef(null);

  const [msg, setMsg] = useState({ message: "" });
  const token = Cookies.get("token");
  const actions = useStoreActions({ logOutUser });

  const notificationSound = () => {
    const audio = new Audio(
      "https://res.cloudinary.com/du0p5yed7/video/upload/v1650957124/Accord/sounds/notification_gm5zvp.mp3"
    );
    audio.play();
  };

  const handleLogout = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post("http://localhost:8080/logout", {
        mode: "cors",
      });
      Cookies.remove("token");
      actions;
      return push("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAllMessage = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("http://localhost:8080/user/message", {
        mode: "cors",
      });
      response.data.message.map((element) => {
        if (element.image) {
          const blob = new Blob([Buffer.from(element.image)]);
          element.image = URL.createObjectURL(blob);
        }
        setMessages(response?.data.message);
      });
      console.log("response?.data.message", response?.data.message);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getUser = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("http://localhost:8080/user", {
        mode: "cors",
      });
      const { name, email, _id } = response.data.user;
      setUserData({ name, email, _id });
    } catch (error) {
      console.log("error", error);
    }
  };

  const userProfile = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("http://localhost:8080/user/avatar", {
        mode: "cors",
      });
      const data = await response.data;
      const blob = new Blob([Buffer.from(data.data)]);
      setProfileImage(URL.createObjectURL(blob));
    } catch (error) {
      console.log("error", error);
    }
  };
  const uploadProfile = async (e) => {
    const formData = new FormData();
    formData.append("avatar", uploadImage);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.post(
        "http://localhost:8080/user/avatar",
        formData,
        {
          mode: "core",
        }
      );
      setIsUpload(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    lastMessageRef.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (!token) {
      push("/auth");
    } else {
      getUser();
      userProfile();
      getAllMessage();
    }
  }, []);
  console.log("isUpload", isUpload);
  useEffect(() => {
    if (isUpload) {
      userProfile();
      setIsUpload(false);
    }
  }, [isUpload]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setUnreadCount(0);
    }
  }, [isVisible]);
  const handleFileUpload = (event) => {
    setPreviewOpen(true);
    setChatImage(event.target.files[0]);
  };
  console.log("messages", messages);
  const handleSend = async () => {
    if (msg.message !== "") {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post(
          "http://localhost:8080/user/message",
          {
            mode: "cors",
            message: msg,
          }
        );

        const data = await response.data;
        socket.emit("sendMessage", { ...data });
      } catch (error) {}
    }
    if (chatImage !== null) {
      console.log("chatImage", chatImage);
      const formData = new FormData();
      formData.append("image", chatImage);
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post(
          "http://localhost:8080/user/message/image",
          formData,
          {
            mode: "core",
          }
        );
        const data = await response.data;
        console.log("response", data);
        socket.emit("sendMessage", { ...data });
      } catch (error) {}
    }
    setIsEmoji(false);
    setMsg({ message: "" });
    setChatImage(null);
    form.resetFields();
  };
  const emojiHandler = () => {
    setIsEmoji(!isEmoji);
  };
  const deleteMessageHandler = async (msg) => {
    const id = msg._id;
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.delete(
        `http://localhost:8080/user/message/${id}`,
        {
          mode: "cors",
        }
      );

      const data = await response.data;
      socket.emit("deleteMessage", { ...data });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (!isVisible) {
      notificationSound();
      setUnreadCount(unreadCount + 1);
    }
  }, [messages]);

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("message@@###", message);
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
  console.log("chatImage", chatImage);

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
        <div onClick={handleProfileModal}>
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

      <div className={styles.chatWrapper}>
        {messages?.map((e, index) => {
          const isUser = e.name === userData?.name;
          const currentIndex = messages.findIndex((d) => d._id === e._id);
          const prevData = messages[currentIndex - 1];
          let avatar = null;
          if (e.avatar) {
            const avatarBlob = new Blob([Buffer.from(e.avatar)]);
            avatar = URL.createObjectURL(avatarBlob);
          }
          return (
            <Chat
              profileImage={avatar}
              prevData={prevData}
              key={index}
              isUser={isUser}
              username={e.name}
              time={e.createdAt}
              message={e}
              deleteMessageHandler={deleteMessageHandler}
              isSeen={!isVisible}
            >
              {e?.msg || e?.message || e.emoji}
            </Chat>
          );
        })}

        <div ref={lastMessageRef}></div>
      </div>
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
      <Form className={styles.fieldWrapper} form={form} onFinish={handleSend}>
        <Form.Item
          name="message"
          className={styles.inputWrapper}
          onChange={(e) => setMsg({ message: e.target.value })}
        >
          <Input name="message" className={styles.input} msg={msg} />
        </Form.Item>
        <Form.Item>
          <label className={styles.sendImageWrapper}>
            <UploadOutlined style={{ fontSize: "30px", color: "#555" }} />
            <input
              className={styles.sendImage}
              accept="image/*"
              type="file"
              onChange={handleFileUpload}
            />
          </label>
        </Form.Item>
        <div className={styles.emojiWrapper} onClick={emojiHandler}>
          <SmileOutlined />
        </div>
        <Form.Item
          className={
            msg.message !== "" || chatImage !== null
              ? styles.buttonWrapper
              : styles.buttonWrapperDisable
          }
          onClick={handleSend}
        >
          <SendOutlined
            className={
              msg.message !== "" || chatImage !== null
                ? styles.button
                : styles.disableButton
            }
            style={{ fontSize: "22px" }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Dashboard;
