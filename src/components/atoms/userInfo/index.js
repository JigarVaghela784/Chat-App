import { Avatar } from "antd";
import styles from './userInfo.module.css'
const UserInfo = ({user}) => {
  return (
    <div className={styles.container}>
      <Avatar />
      <h3>{user}</h3>
    </div>
  );
};

export default UserInfo;
