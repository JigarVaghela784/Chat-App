import { Avatar } from "antd";
import styles from "./userInfo.module.css";
const UserInfo = ({ user,prevData , withName = true}) => {
  const firstLetter = user?.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <div style={prevData?.name===user?{display:"none"}:{display:"block"}}>

      <Avatar>{firstLetter}</Avatar>
      </div>
      {withName && <h3>{user}</h3>}
    </div>
  );
};

export default UserInfo;
