import React, { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<Props> = (props) => {
  return (
    <div>
      <input {...props} />
    </div>
  );
};

export default Input;
