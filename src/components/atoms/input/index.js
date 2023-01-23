import { Input as BaseInput } from "antd";

const Input = (props ) => {
  const {onChange,name,buttonText,rest}=props;

  return <BaseInput name={name}  onChange={onChange} {...rest} />
};

export default Input;
