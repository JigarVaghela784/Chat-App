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
    try {
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAreqn7Wq5XMxQxwvnDF-iA7cvJk51imys",
        { requestType: "PASSWORD_RESET", email: `${userDetails.email}` }
      );
      console.log("response", response);
      

      const setTime = setTimeout(setIsForgotPassword(false),
      message.success("Link Send Success", 0.5), 2000);
      return clearTimeout(setTime);
    } catch (e) {
      console.error(e);
      message.error(e?.response?.data?.error?.message, 1.5);
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
