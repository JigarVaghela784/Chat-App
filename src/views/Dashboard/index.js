import { useRouter } from "next/router";
import React from "react";

import { logOutUser } from "../../store/actions/auth";
import { useStoreActions } from "../../store/hooks";
import Button from "../../components/atoms/button";

const Dashboard = () => {
  const { push } = useRouter();
  const actions = useStoreActions({ logOutUser });

  const handleLogout = () => {
    actions.logOutUser();
    return push("/");
  };

  return (
    <div>
      Dashboard Page
      <Button buttonText="Sign Out" onClick={handleLogout} />
    </div>
  );
};

export default Dashboard;
