<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { FC } from "react";

const Dashboard: FC = () => {
=======
=======
>>>>>>> Stashed changes
import { FC, useEffect } from "react";
import { useLoaderData } from "react-router";

const Dashboard: FC = () => {
  const loader = useLoaderData();

  useEffect(() => {
    console.log(loader);
  }, [loader]);

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  return <div>Dashboard</div>;
};

export default Dashboard;
