import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { logOutUser } from "../../store/actions/auth";
import { useStoreActions } from "../../store/hooks";
import styles from "./dashboard.module.css";
import Button from "../../components/atoms/button";
import Input from "../../components/atoms/input";
import { SendOutlined } from "@ant-design/icons";
import Chat from "../../components/atoms/chat";
import { Form } from "antd";

import UserInfo from "../../components/atoms/userInfo";
import { io } from "socket.io-client";

import Cookies from "js-cookie";
import axios from "axios";

const socket = io("http://localhost:8080/", { transports: ["websocket"] });

const Dashboard = () => {
  const { push } = useRouter();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [form] = Form.useForm();
  const lastMessageRef = useRef(null);
  const inputEl = useRef(null);
  const [msg, setMsg] = useState("");
  const token = Cookies.get("token");
  const actions = useStoreActions({ logOutUser });

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

  const handleSend = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.post("http://localhost:8088/user/message", {
        mode: "cors",
        message: msg,
      });
      const data = await response.data;
      socket.emit(`sendMessage`, {
        ...data,
      });
    } catch (error) {}
    setMsg("");
    form.resetFields();
  };
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off("message");
    };
  }, [messages]);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerWrapper}>
        <UserInfo user={userData?.name || userData?.email} />
        <Button buttonText="Sign Out" onClick={handleLogout} />
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
            >
              {e?.msg || e?.message}
            </Chat>
          );
        })}
        <div ref={lastMessageRef}></div>
      </div>
      <Form className={styles.fieldWrapper} form={form} onFinish={handleSend}>
        <Form.Item
          name="message"
          className={styles.inputWrapper}
          onChange={(e) => setMsg(e.target.value)}
        >
          <Input name="message" className={styles.input} />
        </Form.Item>
        <Form.Item className={styles.buttonWrapper} onClick={handleSend}>
          <SendOutlined style={{ fontSize: "22px" }} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Dashboard;
