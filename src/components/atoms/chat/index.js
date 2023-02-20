import { Avatar } from "antd";
import styles from "./chat.module.css";
import cls from "classnames";
import dayjs from "dayjs";
import UserInfo from "../userInfo";
import { CloseCircleTwoTone } from "@ant-design/icons";
import Cookies from "js-cookie";


const Chat = ({
  children,
  username,
  time,
  isUser,
  prevData,
  message,
  deleteMessageHandler,
}) => {
  const newTime = dayjs(time).format("hh:mm");
  const date = dayjs(time).format("DD-MM-YYYY");
  const prevDate = dayjs(prevData?.createdAt).format("DD-MM-YYYY");
  const yesterday = dayjs().subtract(1, "day").format("DD-MM-YYYY");
  const deleteMessage = () => {
    deleteMessageHandler(message);
  };

  const findDate =
    date === dayjs().format("DD-MM-YYYY")
      ? "Today"
      : date === yesterday
      ? "Yesterday"
      : date;

  const nDate = prevDate !== date;
  return (
    <div>
      {nDate && (
        <div className={styles.dateWrapper}>
          <div className={styles.dateData}>{findDate}</div>
        </div>
      )}
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
            {newTime !== "Invalid Date" ? (
              <div className={styles.time}>{newTime}</div>
            ) : (
              dayjs().format("hh:mm")
            )}
          </div>
        </div>
        {isUser && (
          <div className={styles.deleteWrapper} onClick={deleteMessage}>
            <CloseCircleTwoTone twoToneColor="#eb2f96" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
