<<<<<<< Updated upstream
import { FC } from "react";

const Dashboard: FC = () => {
=======
import { FC, useEffect } from "react";
import { useLoaderData } from "react-router";

const Dashboard: FC = () => {
  const loader = useLoaderData();

  useEffect(() => {
    console.log(loader);
  }, [loader]);

>>>>>>> Stashed changes
  return <div>Dashboard</div>;
};

export default Dashboard;
