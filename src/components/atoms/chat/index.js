const Chat = ({ children, className, userName, time }) => {
  return (
      <div  className={className}>
        <div>{children}</div>
        <div>
          <span>{userName}</span>
        </div>
        <div>
          <span>{time}</span>
        </div>
      </div>
  );
};

export default Chat;
