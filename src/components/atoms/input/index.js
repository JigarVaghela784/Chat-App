import { Input as BaseInput } from "antd";

const Input = (props ) => {
  const {onChange,name,buttonText,rest,className}=props;

  return <BaseInput className={className} name={name}  onChange={onChange} {...rest} />
};

export default Input;
