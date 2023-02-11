import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { logOutUser } from "../../store/actions/auth";
import { useStoreActions } from "../../store/hooks";
import styles from "./dashboard.module.css";
import Button from "../../components/atoms/button";
import Input from "../../components/atoms/input";
import cls from "classnames";
import { SendOutlined } from "@ant-design/icons";
import Chat from "../../components/atoms/chat";
import { Avatar, Form } from "antd";
import UserInfo from "../../components/atoms/userInfo";
import { io } from "socket.io-client";

import Cookies from "js-cookie";
import axios from "axios";

const socket = io("http://localhost:8080/", { transports: ["websocket"] });

const Dashboard = ({speed = 5}) => {
  const { push } = useRouter();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [sendMsg, setSendMsg] = useState(false);
  const [form] = Form.useForm();
  const lastMessageRef = useRef(null);
  let newMsg = [];

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
      console.log("response", response?.data.message);
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
    getUser();
  }, []);

  useEffect(() => {
    getAllMessage();
    socket.on("message", (message) => {
      console.log("message", message);
      messages.push(message);
    });
  }, [messages]);


  const handleSend = async () => {
    if (msg !== "") {
      // console.log("userData", userData);
      // socket.emit(`sendMessage`, {
      //   id:userData?._id,
      //   message:msg,
      //   username: userData?.name,
      //   email: userData.email,
      //   timestamp: new Date(Date.now()).toLocaleString(),
      // });
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post(
          "http://localhost:8080/user/message",
          {
            mode: "cors",
            message: msg,
          }
        );
        console.log("response", response);
      } catch (error) {}
     
    } else {
      console.error("please enter message");
    }
    // setSendMsg(false)
    setMsg("");
    form.resetFields();
  };
  const wrapperRef = useRef(null);
  useEffect(() => {
    const wrapper = wrapperRef.current;
    let animationId;

    const scroll = () => {
      wrapper.scrollTop += speed;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [speed]);
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerWrapper}>
        <UserInfo user={userData?.name || userData?.email} />
        <Button buttonText="Sign Out" onClick={handleLogout} />
      </div>

      <div className={styles.chatWrapper}  ref={wrapperRef}
      style={{  whiteSpace: "nowrap" }}>
        {messages?.map((e, index) => {
          return (
            <Chat
              key={index}
              className={
                e.email || e.ownerEmail === userData?.email
                  ? cls(styles.message, styles.left)
                  : cls(styles.message, styles.right)
              }
              username={
                e.email || e.ownerEmail === userData?.email
                  ? "you"
                  : e.name || e.ownerName || e.ownerEmail || e.email
              }
              time={e.timestamp}
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
          {/* <Button disabled={msg === "" ? true : false}> */}
          <SendOutlined style={{ fontSize: "22px" }} />
          {/* </Button> */}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Dashboard;
