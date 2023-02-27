import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Form, Image, message } from "antd";
import Input from "../../../components/atoms/input";
import Button from "../../../components/atoms/button";
import { useStoreActions } from "../../../store/hooks";
import styles from "./SignIn.module.css";
import Password from "../../../components/atoms/password";
import loginPic from "../../../styles/assets/login.svg";
import axios from "axios";
import Cookies from "js-cookie";

const SignIn = (props) => {
  const { setIsLogin, setIsForgotPassword } = props;
  const { push } = useRouter();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    returnSecureToken: true,
  });
  const token = Cookies.get("token");

  const handleSignIn = async () => {
    const payload = {
      email: userDetails.email,
      password: userDetails.password,
    };
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        mode: "cors",
        payload,
      });
      const token = response.data.token;
      Cookies.set("token", token);
      await message.success("Signup Success", 0.5);
      push("/dashboard");
    } catch (error) {
      message.error(error?.response?.data?.error, 1.5);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleLogInState = () => {
    setIsLogin(false);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  useEffect(() => {
    if (token) {
      push("/dashboard");
    }
  }, [handleSignIn]);

  return (
    <div className={styles.Main}>
      <div className={styles.container}>
        <div className={styles.signInImage}>
          <Image preview={false} width={300} src={loginPic.src} />

          <div className={styles.member}>
            <div className={styles.login} onClick={handleLogInState}>
              Not Signup yet ? SignUp
            </div>
          </div>
        </div>
        <div className={styles.FormWrapper}>
          <h1>Sign In</h1>
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
              <div className={styles.resetPass}>
                <span className={styles.login} onClick={handleForgotPassword}>
                  Forgot Password?
                </span>
              </div>
            </Form.Item>
            <Button
              className={styles.Button}
              buttonText="Sign In"
              onClick={handleSignIn}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
