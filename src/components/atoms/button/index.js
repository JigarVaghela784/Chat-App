import {Button as BaseButton} from "antd";

const Button= (props) => {
    const { buttonText, ...rest } = props;
    return (
            <BaseButton {...rest}>{buttonText}</BaseButton>
    );
};

export default Button;