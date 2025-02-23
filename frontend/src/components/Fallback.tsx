import { FC } from "react";
import { BarLoader } from "react-spinners";

const Fallback: FC = () => {
  return (
    <div className="bg-white absolute flex flex-col justify-center items-center w-screen h-screen z-10">
      <div className="w-1/10">
        <img src="/images/logo_t.png" />
      </div>
      <BarLoader
        color="#4f39f6"
        height={4}
        loading={true}
        speedMultiplier={1}
        width={300}
      />
    </div>
  );
};

export default Fallback;
