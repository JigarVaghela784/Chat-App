import {Input as BaseInput} from "antd";

const Input = (props) => {
  console.log({props})
  return (
    <BaseInput {...props}  />
  )
}

export default Input