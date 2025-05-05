import { FC, useEffect } from "react";
import { useRouteError } from "react-router";

const E500: FC = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);
  return <p>500</p>;
};

export default E500;
