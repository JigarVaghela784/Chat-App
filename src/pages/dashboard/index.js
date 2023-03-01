import PrivateLayout from "../../layout/PrivateLayout";
import {
  getUserData,
} from "../../lib/profile/profileData";
import DashboardView from "../../views/Dashboard";

export default function Dashboard({ getUser }) {
  return <DashboardView getUser={getUser}  />;
}

export const getServerSideProps = async ({ req }) => {
  const token = req.headers.cookie.replace("token=", "");
  const getUser = await getUserData(token)||null;
  
  const localId = req.cookies["token"];
  if (!localId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      getUser,
    },
  };
};

Dashboard.getLayout = function getLayout(page) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
