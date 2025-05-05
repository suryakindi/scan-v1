import { FC, useEffect } from "react";
import { useRouteError } from "react-router";

const E404: FC = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);
  return <p>404</p>;
};

export default E404;
