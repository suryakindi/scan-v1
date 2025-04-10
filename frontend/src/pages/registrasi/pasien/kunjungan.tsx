import { FC, useEffect, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import * as HOutline from "@heroicons/react/24/outline";
import { api, ResponseT } from "../../../utils/api";
import { paginateInit, PaginateT } from "../../../utils/paginate";
import clsx from "clsx";
import { LayoutContext } from "../../../layout/types";
import useWebSocket from "react-use-websocket";
import { LoaderT } from "../../../user";
import Select from "react-select";
import {
  cast,
  findValue,
  mapOptions,
  styles,
} from "../../../utils/react-select";
import { RuanganT } from "./types";
import moment from "moment";

type _Get = {
  created_by: string;
  dokter: string;
  id_dokter: number;
  id_pasien: number;
  id_registrasi: number;
  id_registrasi_detail_layanan: number;
  id_ruangan: number;
  nama: string;
  nama_ruangan: string;
  no_registrasi: string;
  noantrian: string;
  noantriandokter: string;
  tanggal_masuk: string;
  status:
    | "Belum Checkin"
    | "Checkin"
    | "Belum Dilayani"
    | "Dilayani"
    | "Selesai"
    | "Pulang"
    | "Berobat Berjalan"
    | "Meninggal"
    | "Rujukan";
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

  const [filters, setFilters] = useState<{
    tglAwal: string;
    tglAkhir: string;
    ruangan: string;
    search: string;
  }>({
    ruangan: "",
    search: "",
    tglAkhir: moment().format("YYYY-MM-DD"),
    tglAwal: moment().format("YYYY-MM-DD"),
  });

  const [search, setSearch] = useState<string>("");
  const getPasiens = async (
    url: string = "/registrasi-pelayanan/list-registrasi-pelayanan"
  ) => {
    try {
      // cuma dummy
      const base = url.startsWith("http") ? undefined : "http://localhost";
      const parsedUrl = new URL(url, base);

      const queryObject = Object.fromEntries(parsedUrl.searchParams.entries());

      const response = await api.get<ResponseT<PaginateT<_Get[]>>>(url, {
        params: {
          ...filters,
          tglAwal: filters.tglAwal.split("-").reverse().join("-"),
          tglAkhir: filters.tglAkhir.split("-").reverse().join("-"),
          ...queryObject,
        },
      });

      if (response.data.data) {
        setPasiens(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const [ruangans, setRuangans] = useState<PaginateT<RuanganT[]>>(
    paginateInit()
  );

  const getMasterRuangan = async () => {
    try {
      const response = await api.get<ResponseT<PaginateT<RuanganT[]>>>(
        `/get-master-ruangan/${user.cdfix}`
      );

      if (response.data.data) {
        setRuangans(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsProcess(true);
      await getPasiens();
      await getMasterRuangan();
      setIsProcess(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-white shadow-lg p-6 rounded-md mb-6 grid gap-4 auto-rows-min">
      <div className="grid grid-cols-4 gap-3">
        <div className="h-full flex items-center">
          <span className="font-medium">Kunjungan</span>
        </div>

        <div className="flex items-center gap-1">
          <input
            type="date"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
            value={filters.tglAwal}
            onChange={({ currentTarget: { value } }) =>
              setFilters((prev) => ({
                ...prev,
                tglAwal: value,
              }))
            }
          />
          <span>s/d</span>
          <input
            type="date"
            className="border border-gray-300 py-1.5 px-2 rounded-sm outline-none active:border-blue-300 focus:border-blue-300 w-full"
            value={filters.tglAkhir}
            onChange={({ currentTarget: { value } }) =>
              setFilters((prev) => ({
                ...prev,
                tglAkhir: value,
              }))
            }
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
          options={mapOptions(ruangans.data, {
            l: "nama_ruangan",
            v: "nama_ruangan",
          })}
          value={findValue(
            ruangans.data,
            {
              nama_ruangan: filters.ruangan,
            },
            { label: "nama_ruangan", value: "nama_ruangan" }
          )}
          onChange={(e) =>
            cast<{ label: string; value: string }>(e, async ({ value }) => {
              setFilters((prev) => ({ ...prev, ruangan: value }));
            })
          }
        />

        <div className="flex items-center gap-2">
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
      </div>
      <table className="me-table">
        <thead>
          <tr>
            <th>NO</th>
            <th>&nbsp;</th>
            <th>Nama</th>
            <th>NO Registrasi</th>
            <th>NO Antrian</th>
            <th>Nama Ruangan</th>
            <th>Status</th>
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
                  {/* <button
                    onClick={() => batalRegistrasi(item.id_registrasi)}
                    type="button"
                    className="p-1.5 bg-red-500 hover:bg-red-400 text-white aspect-square rounded-md flex items-center justify-center outline-none relative group cursor-pointer"
                  >
                    <HOutline.XMarkIcon className="size-6" />
                    <span className="absolute text-nowrap mb-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all group-hover:block bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg top-full z-10">
                      Batal Registrasi
                    </span>
                  </button>
                  
                  Dibuat Dengan CronJob
                  
                  */}
                </div>
              </td>
              <td>{item.nama}</td>
              <td>{item.no_registrasi}</td>
              <td>{item.noantrian}</td>
              <td>{item.nama_ruangan}</td>
              <td>
                <div className="flex bg-slate-500 text-white mx-auto rounded-full px-1.5 py-0.5 justify-between items-center max-w-36">
                  <span className="text-sm">{item.status}</span>
                  <span
                    className={clsx("w-4 h-4 block rounded-full", {
                      "bg-red-600": item.status === "Belum Dilayani",
                      "bg-yellow-600": item.status === "Dilayani",
                      "bg-green-600": item.status === "Selesai",
                      "bg-black": item.status === "Pulang",
                    })}
                  ></span>
                </div>
              </td>
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
