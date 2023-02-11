import { useRouter } from "next/router";
import React, { useState } from "react";
import { Form, message, notification } from "antd";
import Input from "../../../components/atoms/input";
import Button from "../../../components/atoms/button";
import styles from "./forgotPassword.module.css";
import axios from "axios";
import Password from "../../../components/atoms/password";

const ForgotPassword = (props) => {
  const { setIsForgotPassword } = props;
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
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
    const payload = {
      email: userDetails.email,
      password: userDetails.password,
    };
    try {
      const response = await axios.patch(
        "http://localhost:8080/forgotPassword",
        {
          mode: "cors",
          payload,
        }
      );
      await message.success("Password Change Successfully", 1.5);
      setIsForgotPassword(false);
    } catch (error) {
      message.error(error?.response?.data?.error, 1.5);
    }
  };

  return (
    <div className={styles.Main}>
      <div className={styles.FormWrapper}>
        <h2>Forgot Password</h2>
        <div>
          <Form className={styles.Form} onChange={handleChange}>
            <Form.Item name="email">
              <Input
                name="email"
                placeholder="Email"
                value={userDetails.email}
                className={styles.InputField}
              />
            </Form.Item>
            <Form.Item name="password">
              <Password
                name="password"
                placeholder="Password"
                value={userDetails.password}
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
