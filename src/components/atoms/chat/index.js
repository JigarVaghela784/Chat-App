import { Avatar } from "antd";
import styles from "./chat.module.css";
import cls from "classnames";
import dayjs from "dayjs";
import UserInfo from "../userInfo";
import { useState } from "react";
import {
  CloseCircleTwoTone,
  CopyOutlined,
  DeleteFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import axios from "axios";

const Chat = ({
  children,
  username,
  time,
  isUser,
  prevData,
  message,
  deleteMessageHandler,
}) => {
  const [textToCopy, setTextToCopy] = useState(null);
  time = dayjs(time).format("hh:mm");
  const token = Cookies.get("token");
  const deleteMessage = () => {
    deleteMessageHandler(message);
  };

  return (
    <div>
      <div
        className={
          !isUser
            ? cls(styles.message, styles.message__guest)
            : prevData?.name !== username
            ? cls(styles.message, styles.message__user)
            : cls(styles.message, styles.message__userWrapper)
        }
      >
        <div className={!isUser ? styles.avatarWrapper : styles.userAvatar}>
          {prevData !== username ? (
            <UserInfo prevData={prevData} user={username} withName={false} />
          ) : null}
        </div>
        <div
          className={
            prevData?.name !== username
              ? isUser
                ? styles.message__userCard
                : styles.message__guestCard
              : isUser
              ? styles.message__prevUser
              : styles.message__prevGuest
          }
        >
          <div className={styles.messageLength}>
            <p>{children}</p>
          </div>
          <div className={styles.userInfo}>
            <div>
              {prevData?.name !== username ? (!isUser ? username : "") : ""}
            </div>
            {time !== "Invalid Date" ? (
              <div className={styles.time}>{time}</div>
            ) : (
              dayjs().format("hh:mm")
            )}
          </div>
        </div>
        {isUser && (
          <div className={styles.deleteWrapper} onClick={deleteMessage}>
            <CloseCircleTwoTone twoToneColor="#eb2f96"/>
          </div>
        )}
        {/* <div style={{ cursor: "pointer" }} onClick={copyHandler}>
          <CopyOutlined />
        </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Chat;
