import styles from "./SiderBase.module.css";
import {
  UserOutlined,
} from "@ant-design/icons";
import {  Layout, Menu,  } from "antd";
import { createElement, useEffect, useState } from "react";
import useWindowSize from "../../../store/hooks/useWindowSize";
import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
const { Sider } = Layout;

const SiderBase = () => {
  const { push } = Router;
  const token = Cookies.get("token");
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const { width } = useWindowSize();
  const allUser = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/finduser`
      );
      const data = await response.data;
      setUsers(data);
    } catch (error) {}
  };
  const user = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user`
      );
      const data = await response.data;
      setUserData(data.user);
    } catch (error) {}
  };
  useEffect(() => {
    allUser();
    user();
  }, []);
  console.log("userData", userData);
  console.log("users", users);
  const items = users.map((user, index) => {
    if (user._id !== userData?._id) {
      return {
        key: `${user._id}`,
        icon: createElement(UserOutlined),
        label: `${user.name}`,
        route: `/chatroom/${user._id}`,
      };
    }
  });
  return (
    width > 750 && (
      <Sider width={350}>
        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{ height: "100%", borderRight: 0, backgroundColor: "#eee" }}
          onClick={(value) => {
            const findData = items.find((element) => element?.key === value.key);
            console.log('findData', findData.route+userData?._id)
            push(`${findData.route}&${userData._id}`);
          }}
        />
      </Sider>
    )
  );
};

export default SiderBase;
