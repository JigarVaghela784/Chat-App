import { useRouter } from "next/router";
import React, { useState } from "react";

import { setUser } from "../../store/actions/auth";
import { useStoreActions } from "../../store/hooks";
import Input from "../../components/atoms/input";
import Button from "../../components/atoms/button";

const SignIn = () => {
  const { push } = useRouter();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const actions = useStoreActions({ setUser });

  const handleSignIn = () => {
    actions.setUser(userDetails);
    setUserDetails({
      email: "",
      password: "",
    });
    return push("/dashboard");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  return (
    <div>
      SignIn Page
      <div>
        <Input
          name="email"
          placeholder="email"
          value={userDetails.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          placeholder="password"
          type="password"
          value={userDetails.password}
          onChange={handleChange}
        />
        <Button buttonText="Sign In" onClick={handleSignIn} />
      </div>
    </div>
  );
};

export default SignIn;
