import { FC } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { AppState } from "../store";

const Loading: FC = () => {
  const isLoading = useSelector((state: AppState) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/60 bg-opacity-50 z-50 flex items-center justify-center">
      <HashLoader color="#4f39f6" loading speedMultiplier={1.5} />
    </div>
  );
};

export default Loading;
