import { useState } from "react";
import AuthLayout from "../../layout/AuthLayout";
import SignIn from "../../views/Auth/SignIn";
import Signup from "../../views/Auth/SignUp";

export default function LoginPage() {
  const [IsLogin, setIsLogin] = useState(true)
  return IsLogin?<SignIn setIsLogin={setIsLogin} />:<Signup setIsLogin={setIsLogin}/>;
}

LoginPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
