import { LogoutOutlined } from "@ant-design/icons";
import Head from "next/head";
import styles from "./dashboard.module.css";
const Dashboard = () => {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className={styles.mainWrapper}>
        <div className={styles.headerWrapper}>
          <div
            style={{ fontSize: "25px", color: "#eee", cursor: "pointer" }}
            // onClick={handleLogout}
          >
            <LogoutOutlined />
          </div>
        </div>
        <h1>Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;
