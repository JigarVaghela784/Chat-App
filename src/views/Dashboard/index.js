import { useRouter } from "next/router";
import React from "react";

import { logOutUser } from "../../store/actions/auth";
import { useStoreActions } from "../../store/hooks";
import styles from './dashboard.module.css'
import Button from "../../components/atoms/button";
import Input from "../../components/atoms/input";

const Dashboard = () => {
  const { push } = useRouter();
  const actions = useStoreActions({ logOutUser });

  const handleLogout = () => {
    actions.logOutUser();
    return push("/");
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerWrapper}>
        Dashboard Page
        <Button buttonText="Sign Out" onClick={handleLogout} />
      </div>
      <div className={styles.chatWrapper}>

      </div>
      <div className={styles.inputWrapper}>
          <Input className={styles.input}/>
      </div>
    </div>
  );
};

export default Dashboard;
