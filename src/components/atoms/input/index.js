import { Input as BaseInput } from "antd";

const Input = (props) => {
  const { onChange, name, buttonText, rest, className, placeholder, msg } =
    props;
  return (
    <BaseInput
      className={className}
      name={name}
      placeholder={placeholder}
      value={msg?.message}
      onChange={onChange}
      {...rest}
      autoFocus
    />
  );
};

export default Input;
