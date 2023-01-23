
import PrivateLayout from "../../layout/PrivateLayout";
import DashboardView from "../../views/Dashboard";

export default function Dashboard() {
  return <DashboardView />;
}

export const getServerSideProps = async ({ req }) => {
  const token = req.cookies["token"];
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

Dashboard.getLayout = function getLayout(page) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
