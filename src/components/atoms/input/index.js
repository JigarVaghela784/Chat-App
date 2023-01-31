import { Input as BaseInput } from "antd";

const Input = (props ) => {
  const {onChange,name,buttonText,rest,className,placeholder}=props;

  return <BaseInput className={className} name={name} placeholder={placeholder}  onChange={onChange} {...rest} />
};

export default Input;
