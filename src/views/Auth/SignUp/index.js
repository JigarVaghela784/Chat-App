import React, { useState } from "react";
import { Form, Image, message } from "antd";
import Input from "../../../components/atoms/input";
import Button from "../../../components/atoms/button";
import styles from "./SignUp.module.css";
import Password from "../../../components/atoms/password";
import signUpPic from "../../../styles/assets/signup.svg";

import axios from "axios";

const SignIn = (props) => {
  const { setIsLogin } = props;
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    returnSecureToken: true,
  });

  const handleSignUp = async () => {
    const payload = {
      name: userDetails.username,
      email: userDetails.email,
      password: userDetails.password,
    };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        mode: "cors",
        payload,
      });
      await message.success("Signup Success", 1.5);
      setIsLogin(true);
    } catch (error) {
      message.error(error?.response?.data?.error, 1.5);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleLogInState = () => {
    setIsLogin(true);
  };

  return (
    <div className={styles.Main}>
      <div className={styles.container}>
        <div className={styles.FormWrapper}>
          <h2>Sign Up</h2>
          <div>
            <Form className={styles.Form} onChange={handleChange}>
              <Form.Item name="username">
                <Input
                  name="username"
                  placeholder="UserName"
                  // value={userDetails.username}
                  className={styles.InputField}
                />
              </Form.Item>
              <Form.Item name="email" onChange={handleChange}>
                <Input
                  name="email"
                  placeholder="email"
                  // value={userDetails.email}
                  className={styles.InputField}
                />
              </Form.Item>
              <Form.Item name="password" onChange={handleChange}>
                <Password
                  name="password"
                  placeholder="password"
                  className={styles.InputField}
                  // value={userDetails.password}
                />
              </Form.Item>
              <Button
                className={styles.Button}
                buttonText="Sign In"
                onClick={handleSignUp}
              />
            </Form>
            <div></div>
          </div>
        </div>
        <div className={styles.signUpImage}>
          <Image preview={false} width={250} src={signUpPic.src} />

          <div className={styles.member}>
            <div className={styles.login} onClick={handleLogInState}>
              {" "}
              already Signup switch To Login.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
