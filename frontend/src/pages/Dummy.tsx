import { FC } from "react";
import { ComponentPropsT } from "../routes";

const Dummy: FC<ComponentPropsT> = ({ permissions, name }) => {
  return (
    <div>
      <p>{name}</p>
      <p>{JSON.stringify(permissions)}</p>
    </div>
  );
};

export default Dummy;
