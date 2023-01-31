import styles from "./SiderBase.module.css";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, MenuProps } from "antd";
import { createElement, useState } from "react";
import useWindowSize from "../../../store/hooks/useWindowSize";
const { Sider } = Layout;

const SiderBase = () => {
  const { width } = useWindowSize();
  const items = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
      const key = String(index + 1);
      return {
        key: `sub${key}`,
        icon: createElement(icon),
        label: `subnav ${key}`,
        children: new Array(4).fill(null).map((_, j) => {
          const subKey = index * 4 + j + 1;
          return {
            key: subKey,
            label: `option${subKey}`,
          };
        }),
      };
    }
  );
  return width > 750 ? (
    <Sider width={250}>
      <Menu
        mode="inline"
        // defaultSelectedKeys={["1"]}
        // defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
        // items={items}
      />
    </Sider>
  ) : (
    ""
  );
};

export default SiderBase;
