import { Avatar } from "antd";
import styles from "./chat.module.css";
import cls from "classnames";
import dayjs from "dayjs";

const Chat = ({ children, className, userName, time }) => {
  const hours=dayjs(time).format('hh')
  const minutes=dayjs(time).format('mm')

  return (
    <div className={className}>
      <div>
        <div className={styles.message}>{children}</div>
        <div
          className={
            userName === "you"
              ? cls(styles.userDataWrapper, styles.userDateLeft)
              : cls(styles.userDataWrapper, styles.userDateRight)
          }
        >
          <div className={styles.userNameWrapper}>
            <span className={styles.userName}>{userName}</span>
          </div>
          <div className={styles.timeWrapper}>
            <div className={styles.time}>{hours}:{minutes}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
