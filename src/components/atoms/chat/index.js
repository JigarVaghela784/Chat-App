import { Image } from "antd";
import styles from "./chat.module.css";
import cls from "classnames";
import dayjs from "dayjs";
import UserInfo from "../userInfo";
import { CloseCircleTwoTone, DownloadOutlined } from "@ant-design/icons";

const Chat = ({
  children,
  username,
  time,
  isUser,
  prevData,
  message,
  deleteMessageHandler,
  profileImage,
}) => {
  const newTime = dayjs(time).format("hh:mm");
  const date = dayjs(time).format("DD-MM-YYYY");
  const prevDate = dayjs(prevData?.createdAt).format("DD-MM-YYYY");
  const yesterday = dayjs().subtract(1, "day").format("DD-MM-YYYY");
  const deleteMessage = () => {
    deleteMessageHandler(message);
  };
  const downloadMessage = () => {
    fetch(message.image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = message.imageName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
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
            <UserInfo
              src={profileImage}
              prevData={prevData}
              user={username}
              withName={false}
            />
          ) : (
            <UserInfo prevData={prevData} user={username} withName={false} />
          )}
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
            {!message.image ? <p>{children}</p> : <Image className={styles.chatImage} src={message.image} width={300} />}
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
        <div className={styles.iconWrapper}>
          {isUser && (
            <div className={styles.iconBtn} onClick={deleteMessage}>
              <CloseCircleTwoTone twoToneColor="#eb2f96" />
            </div>
          )}
          {message.image && (
            <div className={styles.iconBtn} onClick={downloadMessage}>
              <DownloadOutlined style={{color: '#2196f3' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
