import AuthLayout from "../../layout/AuthLayout";
import SignIn from "../../views/Auth/SignIn";
import Signup from "../../views/Auth/SignUp";

export default function LoginPage() {
  return <Signup />;
}

LoginPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
