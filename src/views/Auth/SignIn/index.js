import { useRouter } from "next/router";
import React, { useState } from "react";
import { setUser } from "../../../store/actions/auth";
import { Form, message, notification } from "antd";
import Input from "../../../components/atoms/input";
import Button from "../../../components/atoms/button";
import { useStoreActions } from "../../../store/hooks";
import styles from "./SignIn.module.css";
import Password from "../../../components/atoms/password";
import axios from "axios";
import { getSimplifiedError } from "../../../lib/error";
import { toast } from "react-toastify";
import Cookies from "js-cookie";


const SignIn = (props) => {
  const { setIsLogin,setIsForgotPassword } = props;
  const { push } = useRouter();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    returnSecureToken: true,
  });
  const actions = useStoreActions({ setUser });

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAreqn7Wq5XMxQxwvnDF-iA7cvJk51imys",
        userDetails
      );
      const data = await response?.data;
      Cookies.set("localId", data.localId);
      localStorage.setItem("user", JSON.stringify(data));

      actions.setUser(userDetails);
      message.success("SignIn Success", 0.5);
      return push("/dashboard");
    } catch (e) {
      message.error(e?.response?.data?.error?.message, 1.5);
      console.error(e);

      // return push("/dashboard");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleLogInState = () => {
    setIsLogin(false);
  };

  const handleForgotPassword =() => {
    setIsForgotPassword(true)
  };

  return (
    <div className={styles.Main}>
      <div className={styles.FormWrapper}>
        <h2>Sign In</h2>
        <div>
          <Form className={styles.Form} onChange={handleChange}>
            <Form.Item name="email" >
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
                placeholder="password"
                type="password"
                className={styles.InputField}
                value={userDetails.password}
                onChange={handleChange}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <div>
              <span onClick={handleForgotPassword}>Forgot Password?</span>
            </div>
            <Button
              className={styles.Button}
              buttonText="Sign In"
              onClick={handleSignIn}
            />
          </Form>
          <div>
            Not Signup yet ? <span onClick={handleLogInState}>SignUp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
