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
import {
  query,
  orderBy,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Cookies from "js-cookie";

const Dashboard = () => {
  const email = Cookies.get("token");
  console.log("email", email);
  const { push } = useRouter();
  const [isSend, setIsSend] = useState(false);
  const [message, setMessage] = useState([]);
  const [userData, setUserData] = useState(null)
  const [form] = Form.useForm();
  
  const [msg, setMsg] = useState({
    msg: "",
    time: serverTimestamp(),
    user: "",
  });
  const actions = useStoreActions({ logOutUser });
  
  const handleLogout = () => {
    actions.logOutUser();
    return push("/");
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("user")));
  }, []);

  const getData = async () => {
    let newData = [];
    const querySnapshot = await getDocs(collection(db, "Messages"));
    querySnapshot.forEach((doc) => {
      const response = doc.data();
      newData.push(response);
    });
    console.log("querySnapshot", newData);
    setMessage(newData);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "Messages"), msg);
    console.log("docRef", docRef);
    form.resetFields();
  };
  
  const handleChange = (e) => {
    setMsg({ ...msg, msg: e.target.value,user:userData?.email });
    setIsSend(false);
  };
  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerWrapper}>
        <UserInfo user={userData?.email} />
        <Button buttonText="Sign Out" onClick={handleLogout} />
      </div>
      <div className={styles.chatWrapper}>
        {message?.map((e, index) => {
          return (
            <Chat key={index} className={styles.message} userName={e.user===userData.email?"you":e?.user}>
              {e?.msg}
            </Chat>
          );
        })}
      </div>
      <Form className={styles.fieldWrapper} form={form}>
        <Form.Item
          name="message"
          className={styles.inputWrapper}
          onChange={handleChange}
        >
          <Input name="message" className={styles.input} />
        </Form.Item>
        <Form.Item className={styles.inputWrapper} onClick={handleSend}>
          <SendOutlined style={{ fontSize: "22px" }} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Dashboard;
