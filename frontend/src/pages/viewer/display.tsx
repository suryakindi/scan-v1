import { FC, Fragment, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const Display: FC = () => {
  type _T1 = {
    id_user: number;
    name: string;
    nama_ruangan: string;
    current?: number;
  };

  type _T2 = {
    client_id: number | null;
    ruangan_ids: number[];
    dokters: _T1[];
  };

  type _Get = {
    created_by: string;
    dokter: string;
    id_dokter: number;
    id_pasien: number;
    id_registrasi_detail_layanan: number;
    id_ruangan: number;
    nama: string;
    nama_ruangan: string;
    no_registrasi: string;
    noantrian: string;
    noantriandokter: string;
    tanggal_masuk: string;
  };

  const [data, setData] = useState<_T2>();
  const [current, setCurrent] = useState<_Get | null>(null);
  const raw = localStorage.getItem("queue");
  const queue: _T2 | null = raw ? JSON.parse(raw) : null;

  const { lastJsonMessage } = useWebSocket<_Get | unknown>(
    `ws://localhost:3000/socket/viewer/display/${queue?.client_id}`,
    {
      shouldReconnect: () => true,
    }
  );

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (queue) {
        setData(queue);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastJsonMessage && typeof lastJsonMessage === "object") {
      const message = lastJsonMessage as _Get;

      if (
        ["nama", "noantrian", "nama_ruangan"].every((key) => key in message)
      ) {
        if (
          data?.dokters
            .map(({ id_user }) => id_user)
            .includes(message.id_dokter) &&
          data.ruangan_ids.includes(message.id_ruangan)
        ) {
          setData((prevData) => {
            if (!prevData) return prevData;

            return {
              ...prevData,
              dokters: prevData.dokters.map((dokter) =>
                Number(dokter.id_user) === message.id_dokter
                  ? { ...dokter, current: Number(message.noantrian) }
                  : dokter
              ),
            };
          });

          setCurrent(message);

          speak(
            `Nomor antrean ${message.noantrian}, silahkan menuju ke ${message.nama_ruangan}`
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 m-auto max-w-6xl">
      <div className="bg-red-400 flex items-center justify-center w-full p-4 rounded-md">
        <div className="max-w-16 mr-4 rounded-lg overflow-hidden">
          <img src="/images/logo_t.png" alt="logo..." />
        </div>
        <span className="text-gray-800 font-semibold text-lg">
          Scan Digital Nusantara Queue System
        </span>
      </div>
      <div className="bg-white shadow-lg p-6 rounded-md items-center flex flex-col gap-6 pt-12">
        <span className="text-5xl font-bold">Antrian Terakhir</span>
        <div className="bg-green-300 flex justify-center items-center w-full rounded-xl flex-2/3 flex-col gap-10 py-6">
          {current ? (
            <Fragment>
              <span className="text-xl font-bold">{current.nama_ruangan}</span>
              <span className="text-6xl font-bold">{current.noantrian}</span>
              <span className="text-xl font-bold">{current.nama}</span>
            </Fragment>
          ) : (
            <span className="text-6xl font-bold">_</span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.dokters.map((dokter, k) => (
          <div
            key={k}
            className="bg-white shadow-lg p-6 rounded-md gap-2 flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/images/doctor.svg"
                alt="Doctor..."
                className="w-10 h-10"
              />
            </div>
            <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
              {dokter.current ?? 0}
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
