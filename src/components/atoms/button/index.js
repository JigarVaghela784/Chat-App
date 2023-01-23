import {Button as BaseButton} from "antd";

const Button= (props) => {
    const { buttonText, ...rest } = props;
    console.log('props',props)
    return (
            <BaseButton {...rest}>{buttonText}</BaseButton>
    );
};

export default Button;