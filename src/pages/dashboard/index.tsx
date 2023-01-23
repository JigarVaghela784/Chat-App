import { GetServerSideProps } from "next";
import React from "react";

import PrivateLayout from "src/layout/PrivateLayout";
import DashboardView from "src/views/Dashboard";

export default function Dashboard() {
  return <DashboardView />;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <PrivateLayout>{page}</PrivateLayout>;
};
