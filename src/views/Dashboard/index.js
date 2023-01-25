import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Cookies from "js-cookie";

const Dashboard = () => {
      const email=Cookies.get('token')
    console.log('email', email)
  const { push } = useRouter();
  const [isSend, setIsSend] = useState(false)
  const [message, setMessage] = useState([]);
  const [msg, setMsg] = useState({
    msg: "",
    time: serverTimestamp(),
    user: "Annu",
  });
  let info=[]
  const actions = useStoreActions({ logOutUser });

  const handleLogout = () => {
    actions.logOutUser();
    return push("/");
  };

  useEffect(() => {
    info=(JSON.parse(localStorage.getItem("message")));
    setMessage(info)
  }, [isSend]);
  
  
  const handleSend = async (e) => {
    e.preventDefault();
    // const docRef = await addDoc(collection(db, "Messages"), msg); 
    // console.log("docRef", docRef);
    info=(JSON.parse(localStorage.getItem("message")))||[];
    info.push(msg);
    localStorage.setItem("message", JSON.stringify(info));
    setIsSend(true)
  };

  const handleChange = (e) => {
    setMsg({ ...msg, msg: e.target.value });
    setIsSend(false)
  };
  console.log('message', message)
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerWrapper}>
        <UserInfo />
        <Button buttonText="Sign Out" onClick={handleLogout} />
      </div>
      <div className={styles.chatWrapper}>
        {message?.map((e, index) => {
          return (
            <Chat key={index} className={styles.message}>
              {e?.msg}
            </Chat>
          );
        })}
      </div>
      <Form className={styles.fieldWrapper}>
        <Form.Item className={styles.inputWrapper} onChange={handleChange}>
          <Input className={styles.input} />
        </Form.Item>
        <Form.Item className={styles.inputWrapper} onClick={handleSend}>
          <SendOutlined style={{ fontSize: "22px" }} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Dashboard;
