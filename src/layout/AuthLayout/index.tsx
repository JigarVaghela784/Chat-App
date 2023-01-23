import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <p>Auth Layout</p>
      {children}
    </div>
  );
};

export default AuthLayout;
