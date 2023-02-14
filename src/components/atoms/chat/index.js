import { Avatar } from "antd";
import styles from "./chat.module.css";
import cls from "classnames";
import dayjs from "dayjs";
import UserInfo from "../userInfo";
import { useState } from "react";

const Chat = ({ children, username, time, isUser, prevData }) => {
  time = dayjs(time).format("hh:mm");
  return (
    <div>
      <div
        className={
          !isUser
            ? cls(styles.message, styles.message__guest)
            : cls(styles.message, styles.message__user)
        }
      >
        <div>
          {prevData !== username ? (
            <UserInfo prevData={prevData}  user={username} withName={false} />
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
        {/* </div> */}
      </div>
    </div>
  );
};

export default Chat;
