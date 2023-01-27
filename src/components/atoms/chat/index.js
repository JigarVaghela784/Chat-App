const Chat = ({ children, className, userName }) => {
  console.log("user@@", userName);
  return (
    <div className={className}>
      <div>{children}</div>
      <span>{userName}</span>
    </div>
  );
};

export default Chat;
