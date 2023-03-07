import { io } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ChatSection from "../../components/chatSection";
import { CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import { Image, Modal } from "antd";
import ChatInput from "../../components/chatInput";
import styles from "../../views/Dashboard/dashboard.module.css";
import Head from "next/head";
import UserInfo from "../../components/atoms/userInfo";
import { useRouter } from "next/router";
import PrivateLayout from "../../layout/PrivateLayout";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getUserData } from "../../lib/profile/profileData";
const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ["websocket"],
});
const ChatRoom = (getUser) => {
  const [messages, setMessages] = useState([]);
  const [userData] = useState(getUser);
  const [chatUserData, setChatUserData] = useState(null)
  const [isEmoji, setIsEmoji] = useState(false);

  const [uploadImage, setUploadImage] = useState(null);
  const [profileImage, setProfileImage] = useState();
  const [open, setOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [chatImage, setChatImage] = useState(null);
  const [preview, setPreview] = useState();
  const [isVisible, setIsVisible] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [uptMsgProfile, setUptMsgProfile] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [msg, setMsg] = useState({ message: "" });
  const token = Cookies.get("token");
  const router = useRouter();
  const userId = router.query?.id;
  const getUserChatId = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chatuser/${userId}`,
        {
          mode: "core",
        }
      );
      const data = await response?.data;
      setChatId(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getChatUserData = async () => {
    const id = userId?.split("&")[0];
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/finduser/${id}`,
        {
          mode: "cors",
        }
      );
      const data = await response.data;
      const blob = new Blob([Buffer.from(data?.avatar, "base64")]);
      data.avatar = URL.createObjectURL(blob);
      setChatUserData(data);
    } catch (error) {}
  };
  console.log('chatId', chatId)
  useEffect(() => {
    if (!chatImage) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(chatImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [chatImage]);

  //add notification sound
  const notificationSound = () => {
    const audio = new Audio(
      "https://res.cloudinary.com/du0p5yed7/video/upload/v1650957124/Accord/sounds/notification_gm5zvp.mp3"
    );
    audio.play();
  };

  // logout user
  const handleLogout = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        mode: "cors",
      });
      Cookies.remove("token");
      actions;
      return push("/");
    } catch (error) {
      console.log("error", error);
    }
  };
  // useEffect(() => {
  //   socket.on("notification", (message) => {
  //     console.log("message", message);
  //     baseMessage.success(message)
  //   });

  // }, [])

  const userProfile = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
        {
          mode: "cors",
        }
      );
      const data = await response.data;
      const blob = new Blob([Buffer.from(data)]);
      const profileUrl = URL.createObjectURL(blob);
      setProfileImage(profileUrl);
      if (isUpload) {
        updateMsgProfile();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getAllMessage = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/message/${chatId}`,
        {
          mode: "cors",
        }
      );
      response?.data.map((element) => {
        const blob = new Blob([Buffer.from(element.avatar)]);
        element.avatar = URL.createObjectURL(blob);
        if (element.image) {
          const blobImage = new Blob([Buffer.from(element.image)]);
          element.image = URL.createObjectURL(blobImage);
        }
        setMessages(response?.data);
      });
    } catch (error) {
      console.log("error", error);
    }
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
  const updateMsgProfile = async () => {
    const formData = new FormData();
    formData.append("avatar", uptMsgProfile);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/message/avatar`,
        formData,
        {
          mode: "core",
        }
      );
      getAllMessage();
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });
    socket.emit("join", { ...userData, room: chatId }, (error) => {
      if (error) {
        alert(error);
        // location.href = "/";
      }
    });
    getAllMessage();
  }, [chatId]);
  useEffect(() => {
    getChatUserData();
    getUserChatId();
  }, [userId]);

  useEffect(() => {
    if (!token) {
      push("/auth");
    }
    userProfile();

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isUpload) {
      setTimeout(() => {
        userProfile();
        setIsUpload(false);
      }, 2000);
    }

    if (isVisible) {
      setUnreadCount(0);
    }
  }, [isVisible, isUpload]);
  const handleFileUpload = (event) => {
    setChatImage(event.target.files[0]);
  };

  //render user message
  useEffect(() => {
    if (!isVisible) {
      notificationSound();
      setUnreadCount(unreadCount + 1);
    }
    socket.on("message", (message) => {
      const avatarBlob = new Blob([Buffer?.from(message.avatar)]);
      message.avatar = URL.createObjectURL(avatarBlob);
      if (message?.image) {
        const blob = new Blob([Buffer.from(message.image)]);
        message.image = URL.createObjectURL(blob);
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("delMessage", (message) => {
      messages = messages?.filter((delMsg) => delMsg?._id !== message?._id);
      setMessages(messages);
    });

    return () => {
      socket.off("message");
    };
  }, [messages]);
  {
    isEmoji && (
      <div className={styles.emojiWrapper1}>
        <Picker data={data} onEmojiSelect={addEmoji} />
      </div>
    );
  }
  const addEmoji = (e) => {
    const emoji = e.native;
    setMsg({ message: msg?.message + emoji });
  };

  const handleProfileModal = () => {
    setOpen(true);
  };

  const handleCloseImage = () => {
    setChatImage(null);
    setPreview(null);
  };

  return (
    <PrivateLayout>
      <div className={styles.mainWrapper}>
        <Head>
          {unreadCount > 0 && !isVisible ? (
            <title>{unreadCount} new message</title>
          ) : (
            <title>chat</title>
          )}
        </Head>
        <div className={styles.headerWrapper}>
          <div onClick={handleProfileModal}>
            <UserInfo
              src={chatUserData?.avatar}
              user={chatUserData?.name || chatUserData?.email}
            />
          </div>

          <div
            style={{ fontSize: "25px", color: "#eee", cursor: "pointer" }}
            onClick={handleLogout}
          >
            <LogoutOutlined />
          </div>

    
        </div>
        <ChatSection
          messages={messages}
          userData={userData}
          isVisible={isVisible}
          socket={socket}
        />

        {isEmoji && (
          <div className={styles.emojiWrapper1}>
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
        {chatImage && (
          <>
            <div className={styles.imagePreviewWrapper}>
              <CloseOutlined
                onClick={handleCloseImage}
                style={{ fontSize: "20px" }}
              />
              <div className={styles.imgPreview}>
                <Image width={350} src={preview} />
              </div>
            </div>
          </>
        )}
        <ChatInput
          msg={msg}
          setMsg={setMsg}
          socket={socket}
          chatImage={chatImage}
          setIsEmoji={setIsEmoji}
          setChatImage={setChatImage}
          handleFileUpload={handleFileUpload}
          isEmoji={isEmoji}
          chatId={chatId}
        />
      </div>
    </PrivateLayout>
  );
};

export default ChatRoom;

export const getServerSideProps = async ({ req }) => {
  const token = req.headers.cookie.replace("token=", "");
  const getUser = (await getUserData(token)) || null;

  const localId = req.cookies["token"];
  if (!localId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: getUser,
  };
};
