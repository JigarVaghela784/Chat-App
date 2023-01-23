import React from "react";

interface Props {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <p>Private Layout</p>
      {children}
    </div>
  );
};

export default PrivateLayout;
