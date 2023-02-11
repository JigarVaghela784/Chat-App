import { useRouter } from "next/router";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { setUser } from "../../../store/actions/auth";
import { Form, message } from "antd";
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

  const userData = async (userDetails, id) => {
    const body = {
      userId: id,
      username: userDetails.username,
      email: userDetails.email,
    };
    try {
      const response = await axios.post(`/api/user`, body);
      const data = await response.data;
      console.log("data@@@", data);
    } catch (e) {
      message.error(e?.response?.data?.error?.message, 1.5);
      console.error(e);
    }
  };

  const handleSignUp = async () => {
    const payload = {
      name: userDetails.username,
      email: userDetails.email,
      password: userDetails.password,
    };
    try {
      const response = await axios.post("http://localhost:8080/signup", {
        mode:'cors',
        payload,
      });
      console.log("response", response);
       message.success("Signup Success", 0.5);
       push('/login')
    } catch (error) {
      message.error(error?.response?.data?.error, 1.5)

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
            <span onClick={handleLogInState}>Login</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
