import { Avatar } from "antd";
import styles from "./userInfo.module.css";
const UserInfo = ({ user, prevData, withName = true,src }) => {
  const firstLetter = user?.charAt(0).toUpperCase();
  return (
    <div className={withName ? styles.container : styles.chatContainer}>
      <div
        className={
          prevData?.name !== user
            ? styles.avatarWrapper
            : styles.hiddenAvatarWrapper
        }
      >
        <Avatar src={src} style={{fontSize:"25px"}}>{firstLetter}</Avatar>
      </div>
      <div>{withName && <h3>{user}</h3>}</div>
    </div>
  );
};

export default UserInfo;
