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

import {
  addDoc,
  collection,
  orderBy,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Cookies from "js-cookie";
import axios from "axios";
import dayjs from "dayjs";

const Dashboard = () => {
  const { push } = useRouter();
  const [message, setMessage] = useState([]);
  const [userData, setUserData] = useState(null);
  const [form] = Form.useForm();
  const lastMessageRef = useRef(null);

  const [msg, setMsg] = useState("");
  const actions = useStoreActions({ logOutUser });
  const handleLogout = () => {
    actions.logOutUser();
    return push("/");
  };

  const localId = Cookies.get("localId");
  const getUserData = async () => {
    try {
      const response = await axios.get(`/api/user?userId=${localId}`);
      setUserData(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  const getData = async () => {
    const querySnapshot = query(
      collection(db, "Messages"),
      orderBy("timestamp", "asc")
    );
    return await onSnapshot(
      querySnapshot,
      (snapshot) => {
        let newData = [];

        snapshot.forEach((doc) => {
          newData.push({ id: doc.id, ...doc.data() });
        });
        setMessage(newData);
      },
      (error) => {
        console.error(error);
      }
    );
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView();
  }, [message]);

  const handleSend = async () => {
    if (msg !== "") {
      const docRef = await addDoc(collection(db, "Messages"), {
        message: msg,
        email: userData?.email,
        username: userData?.username,
        timestamp: serverTimestamp(),
      });
    } else {
      console.error("please enter message");
    }
    setMsg("");
    form.resetFields();
  };
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerWrapper}>
        <UserInfo user={userData?.username || userData?.email} />
        <Button buttonText="Sign Out" onClick={handleLogout} />
      </div>

      <div className={styles.chatWrapper}>
        {message?.map((e, index) => {
          let chatTime = dayjs.unix(e.timestamp?.seconds);
          return (
            <Chat
              key={index}
              className={
                e.email === userData?.email
                  ? cls(styles.message, styles.left)
                  : cls(styles.message, styles.right)
              }
              username={
                e.email === userData?.email ? "you" : e.username || e.email
              }
              time={chatTime}
            >
              {e?.message}
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
