import { FC, Fragment, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { RuanganT } from "../registrasi/pasien/types";

const Display: FC = () => {
  type _T2 = {
    client_id: number | null;
    ruangans: (RuanganT & { current?: number })[];
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

  const now = new Date().getDate();
  const _local = {
    getStrict: <T,>(key: string): T | null => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;

        type _R = { date?: number; data: T };

        const _r: _R = JSON.parse(item);

        if (_r.date !== now) {
          localStorage.removeItem(key);
          return null;
        }

        return _r.data;
      } catch {
        return null;
      }
    },
    set: <T,>(key: string, data: T): void => {
      localStorage.setItem(key, JSON.stringify({ date: now, data }));
    },
    get: <T,>(key: string): T | null => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? "");
      } catch {
        return null;
      }
    },
  };

  const [data, setData] = useState<_T2 | null>(
    _local.getStrict<_T2>("viewer-display-data") ?? _local.get("queue")
  );
  const [current, setCurrent] = useState<_Get | null>(
    _local.getStrict<_Get>("viewer-display-current")
  );

  const { lastJsonMessage } = useWebSocket<_Get | unknown>(
    `ws://localhost:3000/socket/viewer/display/${data?.client_id}`,
    {
      shouldReconnect: () => true,
    }
  );

  const speak = (text: string) => {
    if (!text) return;
    console.log(text);

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.speak(utterance);
      };
    } else {
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (lastJsonMessage && typeof lastJsonMessage === "object") {
      const message = lastJsonMessage as _Get;

      if (["id_ruangan", "noantrian"].every((key) => key in message)) {
        if (
          data?.ruangans.some(
            (ruangan) => Number(ruangan.id) === Number(message.id_ruangan)
          )
        ) {
          setData((prevData) => {
            if (!prevData) return prevData;
            const nextData = {
              ...prevData,
              ruangans: prevData.ruangans.map((ruangan) =>
                Number(ruangan.id) === message.id_ruangan
                  ? { ...ruangan, current: Number(message.noantrian) }
                  : ruangan
              ),
            };

            _local.set("viewer-display-data", nextData);
            _local.set("viewer-display-current", message);

            return nextData;
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
            <Fragment>
              <span className="text-xl font-bold">_</span>
              <span className="text-6xl font-bold">_</span>
              <span className="text-xl font-bold">_</span>
            </Fragment>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.ruangans.map((ruangan, k) => (
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
              {ruangan.current ?? 0}
            </span>
            <span>{ruangan.nama_ruangan}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }, (_, k) => (
          <div
            key={k}
            className="grid grid-cols-5 bg-green-400 rounded-md font-bold text-white"
          >
            <div className="flex items-center justify-center p-6">
              <span>{k + 1}</span>
            </div>
            <div className="flex items-center justify-center p-6 col-span-2">
              <span>Pasien {k + 1}</span>
            </div>
            <div className="flex items-center justify-center p-6 col-span-2">
              <span>Ruangan {k + 1}</span>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="flex pt-10 bg-gradient-to-b from-green-700 to-transparent rounded-md overflow-hidden border border-green-900">
        <table className="tabel-antrean w-full font-bold">
          <thead>
            <tr>
              <th>Nomer Antrean</th>
              <th>Nama Pasien</th>
              <th>Ruangan</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, k) => (
              <tr key={k}>
                <td>{k + 1}</td>
                <td>Pasien {k + 1}</td>
                <td>Ruangan {k + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default Display;
