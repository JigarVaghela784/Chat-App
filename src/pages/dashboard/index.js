
import PrivateLayout from "../../layout/PrivateLayout";
import { getAllData } from "../../lib/chat/getAllChat";
import DashboardView from "../../views/Dashboard";


export default function Dashboard() {
  return <DashboardView  />;
}

export const getServerSideProps = async ({ req }) => {
  const getData=await getAllData()
  console.log('getData', getData)
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
      // getData,
    },
  };
};

Dashboard.getLayout = function getLayout(page) {
  return <PrivateLayout>{page}</PrivateLayout>;
};

