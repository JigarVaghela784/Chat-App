import React from "react";

import AuthLayout from "src/layout/AuthLayout";
import SignIn from "src/views/Auth/SignIn";

export default function LoginPage() {
  return <SignIn />;
}

LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
