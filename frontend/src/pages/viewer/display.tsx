import { FC } from "react";

const Display: FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div className="bg-blue-300 flex w-full p-6 rounded-md">
        <div className="max-w-24 mr-6 rounded-lg overflow-hidden">
          <img src="/images/logo_t.png" alt="logo..." />
        </div>
      </div>

      <div className="grid grid-cols-2 auto-rows-max gap-6">
        <div className="bg-white shadow-lg p-6 rounded-md flex items-center">
          <div className="w-full aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/bxMsHP06SN8?start=241&end=282&autoplay=1&loop=1&playlist=bxMsHP06SN8&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&disablekb=1&iv_load_policy=3"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
            ></iframe>
          </div>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-md items-center flex flex-col gap-6">
          <span className="text-5xl font-bold">Antrian Terakhir</span>
          <div className="bg-blue-300 flex justify-center items-center w-full rounded-xl flex-2/3">
            <span className="text-6xl font-bold">3</span>
          </div>
          <div className="flex flex-1/3">
            <span className="text-2xl">Silahkan Menuju</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 6 }, (_, k) => (
          <div
            key={k}
            className="bg-white shadow-lg p-6 rounded-md gap-2 flex flex-col"
          >
            <div className="bg-gray-200 w-24 rounded-full aspect-square skeleton" />
            <div className="bg-gray-200 h-6 rounded-sm skeleton" />
            <div className="bg-gray-200 h-6 rounded-sm skeleton" />
            <div className="bg-gray-200 h-6 rounded-sm skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Display;
