import styles from "./SiderBase.module.css";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { createElement, useEffect, useState } from "react";
import useWindowSize from "../../../store/hooks/useWindowSize";
import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
import UserInfo from "../userInfo";
import Modal from "../modal";
const { Sider } = Layout;

const SiderBase = () => {
  const { push } = Router;
  const token = Cookies.get("token");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [uploadImage, setUploadImage] = useState(null)
  const { width } = useWindowSize();
  const getUserData = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        {
          mode: "cors",
        }
      );
      const data = await response.data;
      const blob = new Blob([Buffer.from(data?.avatar, "base64")]);
      data.avatar = URL.createObjectURL(blob);
      setUserData(data);
    } catch (error) {
      console.log("error", error);
    }
  };
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

  //Upload user profile to database
  const uploadProfile = async () => {
    const formData = new FormData();
    formData.append("avatar", uploadImage);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
        formData,
        {
          mode: "core",
        }
      );
      setUptMsgProfile(uploadImage);
      setIsUpload(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUserData();
    allUser();
  }, []);
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
  const handleProfileModal = () => {
    setOpen(true);
  };

  return (
    <div>
      <div style={{ cursor: "pointer" }} onClick={handleProfileModal}>
        <UserInfo
          title={true}
          src={userData?.avatar}
          user={userData?.name || userData?.email}
        />
      </div>

      {open && (
        <Modal
          open={open}
          setOpen={setOpen}
          setUploadImage={setUploadImage}
          uploadProfile={uploadProfile}
        />
      )}
      {width > 750 && (
        <Sider width={350}>
          <Menu
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            style={{
              minHeight: " calc(100vh - 78px)",
              borderRight: 0,
              backgroundColor: "#eee",
            }}
            onClick={(value) => {
              const findData = items.find(
                (element) => element?.key === value.key
              );
              console.log("findData", findData.route + userData?._id);
              push(`${findData.route}&${userData._id}`);
            }}
          />
        </Sider>
      )}
    </div>
  );
};

export default SiderBase;
