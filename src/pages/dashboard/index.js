import PrivateLayout from "../../layout/PrivateLayout";
import {
  getUserData,
} from "../../lib/profile/profileData";
import DashboardView from "../../views/Dashboard";

export default function Dashboard({ getUser }) {
  return <DashboardView getUser={getUser}  />;
}


Dashboard.getLayout = function getLayout(page) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
