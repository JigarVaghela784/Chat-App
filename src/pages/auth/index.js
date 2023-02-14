import { useState } from "react";
import AuthLayout from "../../layout/AuthLayout";
import ForgotPassword from "../../views/Auth/forgotPassword";
import SignIn from "../../views/Auth/SignIn";
import Signup from "../../views/Auth/SignUp";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  return isLogin?(isForgotPassword?<ForgotPassword setIsForgotPassword={setIsForgotPassword}/>:<SignIn setIsForgotPassword={setIsForgotPassword} setIsLogin={setIsLogin} />):<Signup setIsLogin={setIsLogin}/>;
}

LoginPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
