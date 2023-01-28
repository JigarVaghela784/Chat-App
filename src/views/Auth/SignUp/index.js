import { useRouter } from "next/router";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { setUser } from "../../../store/actions/auth";
import { Form } from "antd";
import Input from "../../../components/atoms/input";
import Button from "../../../components/atoms/button";
import { useStoreActions } from "../../../store/hooks";
import styles from "./SignUp.module.css";
import Password from "../../../components/atoms/password";
import auth from "../../../store/types/auth";
import axios from "axios";
import { getSimplifiedError } from "../../../lib/error";

const SignIn = (props) => {
  const { setIsLogin } = props;
  const { push } = useRouter();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    returnSecureToken: true,
  });
  const actions = useStoreActions({ setUser });

  console.log("userDetails", userDetails);
  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAreqn7Wq5XMxQxwvnDF-iA7cvJk51imys",
        userDetails
      );
      const data = await response.data;
      console.log('data', data)
      setIsLogin(true);
    } catch (e) {
      console.error(e);
      // toast(getSimplifiedError(error), { type: "error" });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleLogInState = () => {
    setIsLogin(true);
  };
  return (
    <div className={styles.Main}>
      <div className={styles.FormWrapper}>
        <h2>Sign Up</h2>
        <div>
          <Form className={styles.Form} onChange={handleChange}>
            <Form.Item name="username">
              <Input
                name="username"
                placeholder="UserName"
                value={userDetails.username}
                className={styles.InputField}
              />
            </Form.Item>
            <Form.Item name="email" onChange={handleChange}>
              <Input
                name="email"
                placeholder="email"
                value={userDetails.email}
                className={styles.InputField}
              />
            </Form.Item>
            <Form.Item name="password" onChange={handleChange}>
              <Password
                name="password"
                placeholder="password"
                className={styles.InputField}
                value={userDetails.password}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Button
              className={styles.Button}
              buttonText="Sign In"
              onClick={handleSignUp}
            />
          </Form>
          <div>
            already Signup switch To{" "}
            <span onClick={handleLogInState}>Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
