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
      console.log("response", response);
      await message.success("Signup Success", 0.5);
      push("/dashboard");
    } catch (error) {
      message.error(error?.response?.data?.error, 1.5);
    }
  };

  return (
    <div className={styles.Main}>
      <div className={styles.FormWrapper}>
        <h2>Reset Password</h2>
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
          <div onClick={handleLogInState}>Back to SignIn.</div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
