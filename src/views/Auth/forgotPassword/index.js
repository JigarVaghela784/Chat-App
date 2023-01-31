import { useRouter } from "next/router";
import React, { useState } from "react";
import { Form, message, notification } from "antd";
import Input from "../../../components/atoms/input";
import Button from "../../../components/atoms/button";
import styles from "./forgotPassword.module.css";
import axios from "axios";


const ForgotPassword = (props) => {
  const { setIsForgotPassword } = props;
  const [userDetails, setUserDetails] = useState({
    email: "",
    returnSecureToken: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleLogInState = () => {
    setIsForgotPassword(false);
  };

  const handleForgotPassword = async () => {
    const body={
      email:userDetails.email
    }
    try {
      await axios.post(`/api/resetpassword`,body);
      message.success("link send to your mail successfully please check your mail", 1.5);
    } catch (error) {
      message.error(error?.response?.data?.code, 1.5);
      console.error(error?.response?.data?.code);
    }
  };

  return (
    <div className={styles.Main}>
      <div className={styles.FormWrapper}>
        <h2>Sign In</h2>
        <div>
          <Form className={styles.Form} onChange={handleChange}>
            <Form.Item name="email">
              <Input
                name="email"
                placeholder="email"
                value={userDetails.email}
                className={styles.InputField}
              />
            </Form.Item>
            <Button
              className={styles.Button}
              buttonText="Submit"
              onClick={handleForgotPassword}
            />
          </Form>
          <div>
            Back to <span onClick={handleLogInState}>SignIn</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
