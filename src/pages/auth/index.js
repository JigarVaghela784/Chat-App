import AuthLayout from "../../layout/AuthLayout";
import SignIn from "../../views/Auth/SignIn";

export default function LoginPage() {
  return <SignIn />;
}

LoginPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
