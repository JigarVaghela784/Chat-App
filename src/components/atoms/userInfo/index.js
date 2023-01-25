import { Avatar } from "antd";
import Cookies from "js-cookie";
import styles from './userInfo.module.css'
const UserInfo = () => {
    // const email=Cookies.get('token')
    // console.log('email', email)
  return (
    <div className={styles.container}>
      <Avatar />
      <h3>user@gmail.com</h3>
    </div>
  );
};

export default UserInfo;
