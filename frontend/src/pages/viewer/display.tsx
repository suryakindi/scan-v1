import { FC, useEffect, useState } from "react";

const Display: FC = () => {
  type _T1 = {
    id_user: number;
    name: string;
    nama_ruangan: string;
  };

  type _T2 = {
    client_id: number | null;
    ruangan_ids: number[];
    dokters: _T1[];
  };

  const [data, setData] = useState<_T2>();
  const raw = localStorage.getItem("queue");

  useEffect(() => {
    return () => {
      if (raw) {
        setData(JSON.parse(raw));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div className="bg-red-400 flex items-center justify-center w-full p-4 rounded-md">
        <div className="max-w-16 mr-4 rounded-lg overflow-hidden">
          <img src="/images/logo_t.png" alt="logo..." />
        </div>
        <span className="text-gray-800 font-semibold text-lg">
          Scan Digital Nusantara Queue System
        </span>
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
          <div className="bg-green-300 flex justify-center items-center w-full rounded-xl flex-2/3">
            <span className="text-6xl font-bold">3</span>
          </div>
          <div className="flex flex-1/3">
            <span className="text-2xl">Silahkan Menuju</span>
          </div>
          
        </div>
      </div>
        <div className="grid grid-cols-4 gap-6">
          {data?.dokters.map((dokter, k) => (
            <div
              key={k}
              className="bg-white shadow-lg p-6 rounded-md gap-2 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img src="/images/doctor.svg" alt="Doctor..." className="w-10 h-10" />
              </div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                1
              </span>
              <span>{dokter.nama_ruangan}</span>
              <span>{dokter.name}</span>
            </div>
          ))}
        </div>


    </div>
  );
};

export default Display;
