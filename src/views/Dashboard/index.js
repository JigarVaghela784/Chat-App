import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { logOutUser } from "../../store/actions/auth";
import { useStoreActions } from "../../store/hooks";
import styles from "./dashboard.module.css";
import Button from "../../components/atoms/button";
import Input from "../../components/atoms/input";
import { LogoutOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import Chat from "../../components/atoms/chat";
import { Form } from "antd";

import UserInfo from "../../components/atoms/userInfo";
import { io } from "socket.io-client";

import Cookies from "js-cookie";
import axios from "axios";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { notification } from "antd";
import Head from "next/head";
const socket = io("http://localhost:8080/", { transports: ["websocket"] });

const Dashboard = ({ speed = 5 }) => {
  const { push } = useRouter();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isEmoji, setIsEmoji] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [form] = Form.useForm();
  const lastMessageRef = useRef(null);
  const inputElement = useRef(null);

  const [msg, setMsg] = useState({ message: "" });
  const token = Cookies.get("token");
  const actions = useStoreActions({ logOutUser });

  // const notificationSound=()=> {
  //   const audio = new Audio(
  //     "https://res.cloudinary.com/du0p5yed7/video/upload/v1650957124/Accord/sounds/notification_gm5zvp.mp3"
  //   );
  //   console.log('audio', audio)
  //   return audio.play();
  // }

  const notificationSound = () => {
    const audio = new Audio(
      "https://res.cloudinary.com/du0p5yed7/video/upload/v1650957124/Accord/sounds/notification_gm5zvp.mp3"
    );
    audio.play();
  };

  // const notificationSound = new Audio(
  //   "https://res.cloudinary.com/du0p5yed7/video/upload/v1650957124/Accord/sounds/notification_gm5zvp.mp3"
  // );

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
      setMessages(response?.data.message);
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

  useEffect(() => {
    lastMessageRef.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (!token) {
      push("/auth");
    } else {
      getUser();
    }
    getAllMessage();
  }, []);

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
  }, [isVisible])
  

  console.log({ isVisible });

  const handleSend = async () => {
    console.log("msgHandleSend", msg);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.post("http://localhost:8080/user/message", {
        mode: "cors",
        message: msg,
      });

      const data = await response.data;
      socket.emit(`sendMessage`, {
        ...data,
      });
    } catch (error) {}

    setIsEmoji(false);
    setMsg({ message: "" });
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
      console.log("unreadCountBefore", unreadCount);
      console.log("newMessage");
      notificationSound();

      setUnreadCount(unreadCount + 1);
      console.log("unreadCountAfter", unreadCount);
    }
   
  
  }, [messages]);

  useEffect(() => {
    socket.on("message", (message) => {
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
        <div>
          <UserInfo user={userData?.name || userData?.email} />
        </div>
        <div
          style={{ fontSize: "25px", color: "#eee", cursor: "pointer" }}
          onClick={handleLogout}
        >
          <LogoutOutlined />
        </div>
      </div>
      <div className={styles.chatWrapper}>
        {messages?.map((e, index) => {
          const isUser = e.name === userData?.name;
          const currentIndex = messages.findIndex((d) => d._id === e._id);
          const prevData = messages[currentIndex - 1];

          return (
            <Chat
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
      <Form className={styles.fieldWrapper} form={form} onFinish={handleSend}>
        <Form.Item
          name="message"
          className={styles.inputWrapper}
          onChange={(e) => setMsg({ message: e.target.value })}
        >
          <Input name="message" className={styles.input} msg={msg} />
        </Form.Item>
        <div className={styles.emojiWrapper} onClick={emojiHandler}>
          <SmileOutlined />
        </div>
        <Form.Item className={styles.buttonWrapper} onClick={handleSend}>
          <SendOutlined style={{ fontSize: "22px" }} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Dashboard;
