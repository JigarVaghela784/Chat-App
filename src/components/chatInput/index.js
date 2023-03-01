import { SendOutlined, SmileOutlined, UploadOutlined } from "@ant-design/icons";
import { Form } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import styles from "../../views/Dashboard/dashboard.module.css";
import Input from "../atoms/input";

const ChatInput = (props) => {
  const {
    msg,
    setMsg,
    socket,
    chatImage,
    setChatImage,
    setIsEmoji,
    handleFileUpload,
    isEmoji,
  } = props;
  const [form] = Form.useForm();
  const token = Cookies.get("token");
  // send user message
  const handleSend = async () => {
    if (msg.message !== "") {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/message`,
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
      const formData = new FormData();
      formData.append("image", chatImage);
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/message/image`,
          formData,
          {
            mode: "core",
          }
        );
        const data = await response.data;
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
  return (
    <Form className={styles.fieldWrapper} form={form} onFinish={handleSend}>
      <Form.Item
        name="message"
        className={styles.inputWrapper}
        onChange={(e) => setMsg({ message: e.target.value })}
      >
        <Input name="message" className={styles.input} msg={msg} />
      </Form.Item>
      <Form.Item name="image" onChange={handleFileUpload}>
        <label className={styles.sendImageWrapper}>
          <UploadOutlined style={{ fontSize: "30px", color: "#555" }} />
          <input
            name="image"
            className={styles.sendImage}
            accept="image/*"
            type="file"
          />
        </label>
      </Form.Item>
      <div className={styles.emojiWrapper} onClick={emojiHandler}>
        <SmileOutlined />
      </div>
      <Form.Item
      name="sendBtn"
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
  );
};

export default ChatInput;
