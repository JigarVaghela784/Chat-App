import { useRouter } from "next/router";
import { useReducerData } from "../../store/hooks";
import Button from "../../components/atoms/button";

const Home = () => {
  const { push } = useRouter();
  const user = useReducerData("auth", "user", {});
  // eslint-disable-next-line no-console

  const handleRedirect = () => {
    return push("/auth");
  };
  return (
    <div>
      <div>
        <h1>Chat Room</h1>
      </div>

      <Button buttonText="Go to Login Page" onClick={handleRedirect} />
    </div>
  );
};

export default Home;
