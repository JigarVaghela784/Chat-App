import React from "react";

interface Props {
  children: React.ReactNode;
}

const PublicLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <p>Public Layout</p>
      {children}
    </div>
  );
};

export default PublicLayout;
