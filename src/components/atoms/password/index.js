import {Input as BaseInput} from "antd";

const Password = (props) => {
  const {onChange,name,rest}=props;

  return (
    <BaseInput.Password name={name}  onChange={onChange} {...rest}/>
  )
}

export default Password