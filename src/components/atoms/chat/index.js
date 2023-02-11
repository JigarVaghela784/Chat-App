import { Avatar } from "antd";
import styles from "./chat.module.css";
import cls from "classnames";
import dayjs from "dayjs";


const Chat = ({ children, className, username, time }) => {
  const newTime = dayjs(time).format("hh:mm");
  return (
    <div
      className={className}
    >
      <div className={styles.chatMessage}>
        <div
          className={
            username === "you"
              ? cls(styles.message, styles.messageLeft)
              : cls(styles.message, styles.messageRight)
          }
        >
          {children}
        </div>
        <div
          className={
            username === "you"
              ? cls(styles.userDataWrapper, styles.userDateLeft)
              : cls(styles.userDataWrapper, styles.userDateRight)
          }
        >
          <div className={styles.userNameWrapper}>
            <span className={styles.userName}>{username}</span>
          </div>
          <div className={styles.timeWrapper}>
            {newTime !== "Invalid Date" ? (
              <div className={styles.time}>{newTime}</div>
            ) : (
              dayjs().format("hh:mm")
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
