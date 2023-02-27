import PrivateLayout from "../../layout/PrivateLayout";
import {
  getUserData,
  userProfile,
} from "../../lib/profile/profileData";
import DashboardView from "../../views/Dashboard";

export default function Dashboard({ getUser, getProfile }) {
  return <DashboardView getUser={getUser} getProfile={getProfile}  />;
}

export const getServerSideProps = async ({ req }) => {
  const token = req.headers.cookie.replace("token=", "");
  const getUser = await getUserData(token);
  const getProfile = await userProfile(token);
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
      getProfile,
    },
  };
};

Dashboard.getLayout = function getLayout(page) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
