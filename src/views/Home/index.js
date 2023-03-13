import { useRouter } from "next/router";
import Button from "../../components/atoms/button";
import styles from "./home.module.css";

const Home = () => {
  const { push } = useRouter();
  // eslint-disable-next-line no-console

  const handleRedirect = () => {
    return push("/auth");
  };
  return (
    <div className={styles.container}>
      <div className={styles.homeWrapper}>

      <div className={styles.headWrapper}>
        <h1>Welcome to chat app</h1>
      </div>
      <Button buttonText="Go to Login Page" onClick={handleRedirect} />

    </div>
      </div>

  );
};

export default Home;
