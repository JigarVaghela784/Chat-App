import { useRouter } from "next/router";
import {useReducerData} from "../../store/hooks";
import Button from "../../components/atoms/button";

const Home = () => {
  const { push } = useRouter();
  const user = useReducerData("auth", "user", {});
  // eslint-disable-next-line no-console
  console.log("user", user);

  const handleRedirect = () => {
    return push("/auth");
  };
  return (
    <div>
      Home Page
      <Button buttonText="Go to Login Page" onClick={handleRedirect} />
    </div>
  );
};

export default Home;
