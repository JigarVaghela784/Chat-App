import React, { ButtonHTMLAttributes } from "react";

type Props = {
  buttonText?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = (props) => {
  const { buttonText, ...rest } = props;
  return (
    <div>
      <button {...rest}>{buttonText}</button>
    </div>
  );
};

export default Button;
