import { FC, useEffect, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import * as HOutline from "@heroicons/react/24/outline";
import { api, ResponseT } from "../../../utils/api";
import { paginateInit, PaginateT } from "../../../utils/paginate";
import clsx from "clsx";
import { LayoutContext } from "../../../layout/types";
import useWebSocket from "react-use-websocket";
import { LoaderT } from "../../../user";

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

const ListPasien: FC = () => {
  const { sendMessage } = useWebSocket("ws://localhost:3000/socket/call", {
    shouldReconnect: () => true,
    onOpen: () => console.log("WebSocket connection opened!"),
    onClose: () => console.log("WebSocket connection closed!"),
    onError: (event: unknown) => console.error("WebSocket error:", event),
    onMessage: (event: unknown) => console.log("Received message:", event),
  });

  const { user } = useLoaderData<LoaderT>();

  const { setIsProcess } = useOutletContext<LayoutContext>();
  const [pasiens, setPasiens] = useState<PaginateT<_Get[]>>(paginateInit());

  const [search, setSearch] = useState<string>("");
  const getPasiens = async (
    url: string = "/registrasi-pelayanan/list-registrasi-pelayanan"
  ) => {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await api.get<ResponseT<PaginateT<_Get[]>>>(
        `${url}${query}`
      );

      if (response.data.data) {
        setPasiens(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsProcess(true);
      await getPasiens();
      setIsProcess(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
      <div className="flex w-1/2 items-center gap-2">
        <input
          type="text"
          placeholder="No RM, NIK, Nama Pasien"
          className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <button
          onClick={async () => {
            setIsProcess(true);
            await getPasiens();
            setIsProcess(false);
          }}
          className="py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-md flex items-center justify-center outline-none text-nowrap h-full gap-2 cursor-pointer"
        >
          <HOutline.MagnifyingGlassIcon className="size-6" />
          <span>Cari</span>
        </button>
      </div>
      <table className="me-table">
        <thead>
          <tr>
            <th>NO</th>
            <th>&nbsp;</th>
            <th>Nama</th>
            <th>NO Registrasi</th>
            <th>NO Antrian</th>
            <th>NO Antrian Dokter</th>
            <th>Nama Ruangan</th>
            <th>Dokter</th>
          </tr>
        </thead>
        <tbody>
          {pasiens.data.map((item, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>
                <div className="flex gap-2 w-full items-center justify-center">
                  <button
                    onClick={() => {
                      sendMessage(
                        JSON.stringify({ cdfix: user.cdfix, data: item })
                      );
                    }}
                    type="button"
                    className="p-1.5 bg-amber-500 hover:bg-amber-400 text-white aspect-square rounded-md flex items-center justify-center outline-none relative group cursor-pointer"
                  >
                    <HOutline.PhoneIcon className="size-6" />
                    <span className="absolute text-nowrap mb-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all group-hover:block bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg top-full z-10">
                      Panggil Pasien
                    </span>
                  </button>
                </div>
              </td>
              <td>{item.nama}</td>
              <td>{item.no_registrasi}</td>
              <td>{item.noantrian}</td>
              <td>{item.noantriandokter}</td>
              <td>{item.nama_ruangan}</td>
              <td>{item.dokter}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-end">
        {pasiens.links.map((link, k) => (
          <button
            key={k}
            type="button"
            className={clsx(
              "border flex items-center px-3 py-1.5",
              "border-blue-600",
              link.url === null
                ? "bg-slate-200"
                : link.active
                ? "cursor-pointer bg-blue-600 text-white"
                : "cursor-pointer bg-white text-blue-600 hover:bg-slate-300"
            )}
          >
            <span dangerouslySetInnerHTML={{ __html: link.label }} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListPasien;
