import { FC } from "react";
import { BarLoader } from "react-spinners";

const LoadingOverlay: FC = () => {
  return (
    <div className="bg-white fixed flex flex-col justify-center items-center z-10 top-0 bottom-0 right-0 left-0">
      <div className="w-1/10">
        <img src="/images/logo_t.png" />
      </div>
      <BarLoader
        color="#1447e6"
        height={4}
        loading={true}
        speedMultiplier={1}
        width={300}
      />
    </div>
  );
};

export default LoadingOverlay;
