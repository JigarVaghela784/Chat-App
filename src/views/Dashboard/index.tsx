import { useRouter } from "next/router";
import React from "react";

import Button from "src/components/Button";
import { logOutUser } from "src/store/actions/auth";
import { useStoreActions } from "src/store/hooks";

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
