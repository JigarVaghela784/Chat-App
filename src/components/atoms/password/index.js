import {Input as BaseInput} from "antd";

const Password = (props) => {
  const {onChange,name,rest,placeholder}=props;

  return (
    <BaseInput.Password name={name} placeholder={placeholder}  onChange={onChange} {...rest}/>
  )
}

export default Password