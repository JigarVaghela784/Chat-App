import React, { useState } from "react";
import { Form, message, notification, Image } from "antd";
import Input from "../../../components/atoms/input";
import Button from "../../../components/atoms/button";
import styles from "./forgotPassword.module.css";
import forgotPasswordPic from "../../../styles/assets/forgot_password.svg";
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
        `${process.env.NEXT_PUBLIC_API_URL}/forgotPassword`,
        {
          mode: "cors",
          payload,
        }
      );
      await message.success("Signup Success", 0.5);
      push("/dashboard");
    } catch (error) {
      message.error(error?.response?.data?.error, 1.5);
    }
  };

  return (
    <div className={styles.Main}>
      <div className={styles.container}>
        <div className={styles.forgotPasswordImage}>
          <Image preview={false} width={250} src={forgotPasswordPic.src} />

          <div className={styles.resetPass}>
            <span className={styles.login} onClick={handleLogInState}>
              Back to SignIn.
            </span>
          </div>
        </div>
        <div className={styles.FormWrapper}>
          <h1>Reset Password</h1>
          <Form className={styles.Form} onChange={handleChange}>
            <Form.Item name="email">
              <Input
                name="email"
                placeholder="email"
                className={styles.InputField}
              />
            </Form.Item>
            <Form.Item name="password" onChange={handleChange}>
              <Password
                name="password"
                placeholder="password"
                className={styles.InputField}
              />
            </Form.Item>
            <Button
              className={styles.Button}
              buttonText="Submit  "
              onClick={handleForgotPassword}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
