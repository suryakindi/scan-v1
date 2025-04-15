import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import * as HOutline from "@heroicons/react/24/outline";
import Select from "react-select";
import { styles } from "../../utils/react-select";
import { options } from "../../mock/react-select";
import { api, ResponseT } from "../../utils/api";
import { paginateInit, PaginateT } from "../../utils/paginate";
import useWebSocket from "react-use-websocket";
import { Link, useLoaderData } from "react-router";
import { LoaderT } from "../../user";
import { Toast } from "../../utils/alert";

type Data = {
  id_registrasi: number;
  nama: string;
  id_ruangan: number;
  waktu_pemanggilan: string | null;
  id_status_pulang: string | null;
  status_pulang: string | null;
  id_status_pasien: number;
  status_pasien: string;
  noantrian: string;
  no_registrasi: string;
  tanggal_registrasi: string;
  nama_ruangan: string;
  selisih_waktu: string | null;
};

const RawatJalan: FC = () => {
  const { user } = useLoaderData<LoaderT>();

  const { sendMessage } = useWebSocket("ws://localhost:3000/socket/call", {
    shouldReconnect: () => true,
    onOpen: () => console.log("WebSocket connection opened!"),
    onClose: () => console.log("WebSocket connection closed!"),
    onError: (event: unknown) => console.error("WebSocket error:", event),
    onMessage: (event: unknown) => console.log("Received message:", event),
  });

  const [data, setData] = useState<PaginateT<Data[]>>(paginateInit([]));

  const getData = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<Data[]>>>(
        "/layanan/daftar-pasien/teregistrasi"
      );

      if (response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const call = async (antrean: Data) => {
    try {
      sendMessage(JSON.stringify({ cdfix: user.cdfix, data: antrean }));
      await api.put(
        `/layanan/update-waktu-pemanggilan/${antrean.id_registrasi}`
      );
      getData();
      Toast.fire({
        title: "Berhasil",
        text: "Berhasil memanggil pasien",
        icon: "success",
      });
    } catch (error) {
      Toast.fire({
        title: "Gagal",
        text: "Gagal memanggil pasien",
        icon: "error",
      });
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
      <div className="grid grid-cols-4 gap-3">
        <div className="h-full flex items-center">
          <span className="font-medium">Rawat Jalan</span>
        </div>

        <div className="flex items-center gap-1">
          <input
            type="date"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
          />
          <span>s/d</span>
          <input
            type="date"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
          />
        </div>

        <Select
          inputId="poliklinik-klinik"
          className="w-full"
          isSearchable={true}
          styles={styles}
          placeholder="Pilih..."
          menuPlacement="bottom"
          required={true}
          isClearable={true}
          options={options}
        />

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="No RM, NIK, Nama Pasien"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
          />

          <button
            onClick={async () => {}}
            className="py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-md flex items-center justify-center outline-none text-nowrap h-full gap-2 cursor-pointer"
          >
            <HOutline.MagnifyingGlassIcon className="size-6" />
            <span>Cari</span>
          </button>
        </div>
      </div>

      <table className="me-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Nama</th>
            <th>Statu Pulang</th>
            <th>Waiting</th>
            <th>Status</th>
            <th>M.Records</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((item, k) => (
            <tr key={k}>
              <td>
                <div className="size-8 bg-green-200 text-green-600 flex items-center justify-center rounded-full m-auto">
                  {item.noantrian}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-blue-200 text-blue-600 flex items-center justify-center rounded-full">
                    {k % 2 === 0 ? "L" : "P"}
                  </div>
                  <span>{item.nama}</span>
                </div>
              </td>
              <td>{item.status_pulang}</td>
              <td>
                {item.selisih_waktu && (
                  <span className="text-sm bg-gray-500 text-white px-4 py-1 rounded-sm">
                    {item.selisih_waktu}
                  </span>
                )}
              </td>
              <td>
                <div className="flex bg-slate-500 text-white mx-auto rounded-full px-1.5 py-0.5 justify-between items-center max-w-36">
                  <span className="text-sm">{item.status_pasien}</span>
                  <span
                    className={clsx("w-4 h-4 block rounded-full", {
                      "bg-red-600": item.status_pasien === "Belum Dilayani",
                      "bg-yellow-600": item.status_pasien === "Dilayani",
                      "bg-green-600": item.status_pasien === "Selesai",
                      "bg-black": item.status_pasien === "Pulang",
                    })}
                  ></span>
                </div>
              </td>
              <td>
                <div className="rounded-md overflow-hidden flex items-center mx-auto h-10 w-max">
                  <Link
                    to={`/registrasi/soap/${item.id_registrasi}`}
                    className="flex items-center bg-green-600 hover:bg-green-500 text-white px-3 h-full cursor-pointer"
                  >
                    M.Records
                  </Link>
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 h-full flex items-center justify-center cursor-pointer"
                    onClick={() => call(item)}
                  >
                    <HOutline.SpeakerWaveIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RawatJalan;
