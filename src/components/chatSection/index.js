import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";
import styles from "./chatSection.module.css";
import Chat from "../atoms/chat";

const ChatSection = (props) => {
  const { messages, userData, isVisible, socket, chatId } = props;
  const lastMessageRef = useRef(null);
  const token = Cookies.get("token");

  // delete user message
  const deleteMessageHandler = async (msg) => {
    const id = msg._id;
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/user/message/${id}`,
        {
          mode: "cors",
        }
      );
      const data = await response.data;
      socket.emit("deleteMessage", { ...data });
    } catch (error) {}
  };
  useEffect(() => {
    lastMessageRef.current.scrollIntoView();
  }, [messages]);
  return (
    <div className={styles.chatWrapper}>
      {messages?.map((e, index) => {
        const isUser = e.name === userData?.name;
        const currentIndex = messages.findIndex((d) => d._id === e._id);
        const prevData = messages[currentIndex - 1];

        if (chatId === e.messageId) {
          return (
            <Chat
              profileImage={e.avatar}
              prevData={prevData}
              key={index}
              isUser={isUser}
              username={e.name}
              time={e.createdAt}
              message={e}
              deleteMessageHandler={deleteMessageHandler}
              isSeen={!isVisible}
            >
              {e?.msg || e?.message || e.emoji}
            </Chat>
          );
        }
      })}

      <div ref={lastMessageRef}></div>
    </div>
  );
};

export default ChatSection;
