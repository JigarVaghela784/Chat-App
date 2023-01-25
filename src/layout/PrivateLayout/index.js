import styles from "./privateLayout.module.css";
import { Layout, Space } from "antd";
import SiderBase from "../../components/atoms/sider";
const { Content } = Layout;

const PrivateLayout = ({ children }) => {
  return (
    <Layout>
      <SiderBase/>
      <Layout>
        <Content style={styles.contentStyle}> {children}</Content>
      </Layout>
    </Layout>

  );
};

export default PrivateLayout;
